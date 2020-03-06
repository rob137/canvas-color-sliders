import React, { useEffect, useReducer, useRef, useState } from "react";
import BrightnessSlider from "./components/BrightnessSlider";
import ColorSlider from "./components/ColorSlider";

const getOriginalPixels = (canvas, image) => {
  if (canvas) {
    const [w, h] = [canvas.width, canvas.height];
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, w, h).data;
  }
  return [];
};

const reducer = (state, action) => {
  switch (action.type) {
    case "initial":
      return { currentPixels: action.payload };
    case "color":
      const { color, value, originalPixels } = action.payload;
      const colors = ["red", "green", "blue"];
      const colorIndex = colors.indexOf(color);
      const pixels = Uint8ClampedArray.from(originalPixels);
      for (let p = colorIndex; p < pixels.length; p += 4) {
        pixels[p] = originalPixels[p] + value;
      }
      return { currentPixels: pixels };
    case "brightness":
      return "placeholder";
    default:
      throw new Error();
  }
};

function fromCanvas(canvasRef) {
  const canvas = canvasRef.current;
  const [w, h] = [canvas.width, canvas.height];
  const context = canvas.getContext("2d");
  const imageData = context.createImageData(w, h);
  const pixels = imageData.data;
  return { canvas, w, h, context, imageData, pixels };
}

export default () => {
  const [originalPixels, setOriginalPixels] = useState([]);
  const [red, setRed] = useState(0);
  const canvasRef = useRef(null);
  const initialState = { currentPixels: [] };
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      const op = getOriginalPixels(canvasRef.current, image);
      setOriginalPixels(op);
      dispatch({ type: "initial", payload: op });
    };
    image.crossOrigin = "Anonymous";
    image.src = "tubulin.png";
  }, []);

  useEffect(() => {
    const { canvas, w, h, context, imageData, pixels } = fromCanvas(canvasRef);
    for (let p = 0; p < pixels.length; p++) {
      pixels[p] = state.currentPixels[p];
    }
    context.putImageData(imageData, 0, 0);
  }, [red]);

  const applyColor = (color, value) => {
    const { canvas, w, h, context, imageData, pixels } = fromCanvas(canvasRef);
    dispatch({
      type: "color",
      payload: { color, value, originalPixels }
    });
  };

  return (
    <>
      <h1>Canvas</h1>
      <canvas
        ref={canvasRef}
        width="400"
        height="600"
        style={{ border: "1px solid red" }}
      />
      <BrightnessSlider callback={v => {}} />
      <ColorSlider
        callback={v => {
          setRed(v);
          applyColor("red", v);
        }}
        color={"red"}
      />
      <ColorSlider callback={v => {}} color={"green"} />
      <ColorSlider callback={v => {}} color={"blue"} />
    </>
  );
};
