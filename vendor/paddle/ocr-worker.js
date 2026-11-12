// Runs the text reader in the background so the camera screen stays responsive.
self.window = self;
// the reader draws on canvases via document.createElement("canvas"): give it off-screen ones
self.document = {
  createElement: t => { if (t !== "canvas") throw new Error("no " + t + " in worker"); const c = new OffscreenCanvas(1, 1); c.style = {}; return c; },
  addEventListener() {}, removeEventListener() {}, body: {}, currentScript: null, title: ""
};
importScripts("paddle-ocr.js");
let ocrP;
const base = self.location.href.replace(/[^/]*$/, "");
function getOcr() {
  return ocrP ||= (async () => {
    const { Ocr, ort } = self.PaddleOCR;
    ort.env.wasm.wasmPaths = base; ort.env.wasm.numThreads = 1;
    return Ocr.create({ models: { detectionPath: base + "ch_PP-OCRv4_det_infer.onnx",
      recognitionPath: base + "ch_PP-OCRv4_rec_infer.onnx", dictionaryPath: base + "ppocr_keys_v1.txt" } });
  })().catch(e => { ocrP = null; throw e; });
}
self.onmessage = async ({ data: { id, op, img } }) => {
  try {
    const ocr = await getOcr();
    if (op === "load") return postMessage({ id, ok: true });
    const res = await ocr.detect({ data: img.data, width: img.width, height: img.height });
    postMessage({ id, ok: true, res: { texts: (res.texts || []).map(t => ({ text: t.text, mean: t.mean, box: t.box })),
      resizedImageWidth: res.resizedImageWidth, resizedImageHeight: res.resizedImageHeight } });
  } catch (e) { postMessage({ id, ok: false, err: String(e && e.message || e) }); }
};
