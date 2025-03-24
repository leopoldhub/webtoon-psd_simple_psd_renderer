// @webtoon/psd
// Copyright 2021-present NAVER WEBTOON
// MIT License

import "./style.css";
import Psd from "@webtoon/psd";

const showFile = async (fileBuffer: ArrayBuffer) => {
  console.time("Parse PSD file");
  const psd = Psd.parse(fileBuffer);
  console.timeEnd("Parse PSD file");

  console.log(psd);

  const {canvasEl, context} = generateCanvas({height: psd.height, width: psd.width});

  for (const [index, layer] of [...psd.layers.entries()].reverse()) {
    console.time(`Compositing layer ${index}`);
    const pixelData = await layer.composite(true, true);
    console.timeEnd(`Compositing layer ${index}`);

    console.log(index, layer)

    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = layer.width;
    offscreenCanvas.height = layer.height;
    const offscreenContext = offscreenCanvas.getContext("2d") as CanvasRenderingContext2D;

    const imageData = offscreenContext.createImageData(layer.width, layer.height);
    imageData.data.set(pixelData);
    offscreenContext.putImageData(imageData, 0, 0);

    context.drawImage(offscreenCanvas, layer.left, layer.top);
  }
  document.getElementById("results")!.appendChild(canvasEl);
};

const generateCanvas = (data: {
  width: number;
  height: number;
}) => {
  const canvasEl = document.createElement("canvas");
  const context = canvasEl.getContext("2d") as CanvasRenderingContext2D;

  const {width, height} = data;

  canvasEl.width = width;
  canvasEl.height = height;

  return {canvasEl, context};
};

// main().catch(console.error);

/*const generateCanvas = (data: {
  pixelData: Uint8ClampedArray;
  width: number;
  height: number;
}) => {
  const canvasEl = document.createElement("canvas");
  const context = canvasEl.getContext("2d") as CanvasRenderingContext2D;

  const {width, height, pixelData: rgba} = data;
  const imageData = context.createImageData(width, height);

  canvasEl.width = width;
  canvasEl.height = height;

  imageData.data.set(rgba);
  context.putImageData(imageData, 0, 0);

  return canvasEl;
};*/

/*

const readFileAsArrayBuffer = (file: File) => {
  if (file.arrayBuffer) {
    return file.arrayBuffer();
  } else {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    return new Promise<ArrayBuffer>((resolve) => {
      reader.addEventListener("load", (event) => {
        if (event.target) {
          resolve(event.target.result as ArrayBuffer);
        } else {
          throw new Error("Loaded file but event.target is null");
        }
      });
    });
  }
};

const workerCallback = ({data}: MessageEvent<any>, element: HTMLDivElement) => {
  const {type, timestamp, value} = data;
  validateMessage(data);

  console.log(
    `It took %d ms to send this message (worker → main, type: %o)`,
    Date.now() - timestamp,
    type
  );

  if (type === "Layer") {
    const layer = value;

    // -- Layers --
    element.insertAdjacentHTML("beforeend", `<h3>${layer.name}</h3>`);
    element.insertAdjacentHTML(
      "beforeend",
      `<div><p class="layer-info">size : ${layer.width} x ${layer.height} | top: ${layer.top} | left: ${layer.left}</p></div>`
    );
    console.time("Create and append <canvas> for layer");
    element.appendChild(generateCanvas(layer));
    console.timeEnd("Create and append <canvas> for layer");
  }
};

 */

const readFileAsArrayBuffer = (file: File) => {
  if (file.arrayBuffer) {
    return file.arrayBuffer();
  } else {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    return new Promise<ArrayBuffer>((resolve) => {
      reader.addEventListener("load", (event) => {
        if (event.target) {
          resolve(event.target.result as ArrayBuffer);
        } else {
          throw new Error("Loaded file but event.target is null");
        }
      });
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  console.log("Script loaded");

  const resultsEl = document.querySelector("#results") as HTMLDivElement;
  const inputEl = document.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement;

  inputEl.addEventListener("change", () => {
    const file = (inputEl.files as FileList)[0];
    if (!file) return;

    readFileAsArrayBuffer(file).then((buffer) => {
      showFile(buffer).catch(console.error);
    });

    // Reset the input so we can reload the same file over and over
    inputEl.value = "";
    resultsEl.innerHTML = "";
  });
});
