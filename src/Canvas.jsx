import React, { useEffect, useReducer, useRef, useState } from "react";
import BrightnessSlider from "./components/BrightnessSlider";
import ColorSlider from "./components/ColorSlider";

// To unpack commonly-used variables.
const fromCanvas = canvasRef => {
  const canvas = canvasRef.current;
  const [w, h] = [canvas.width, canvas.height];
  const context = canvas.getContext("2d");
  const imageData = context.createImageData(w, h);
  const px = imageData.data;
  return { canvas, w, h, context, imageData, px };
};

const getOriginalPixels = (canvas, image) => {
  if (canvas) {
    const [w, h] = [canvas.width, canvas.height];
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, w, h).data;
  }
  return [];
};

const applyBrightness = (value, px, basePx) => {
  for (let p = 0; p < px.length; p += 1) {
    if (p % 4 !== 3) {
      px[p] = basePx[p] + value;
    } else {
      px[p] = basePx[p];
    }
  }
  return px;
};

const applyColor = (color, value, px, basePx) => {
  const colors = ["red", "green", "blue"];
  const colorIndex = colors.indexOf(color);
  for (let p = colorIndex; p < px.length; p += 4) {
    px[p] = basePx[p] + value;
  }
  return px;
};

const reducer = (state, action) => {
  const { color, colors, brightness, value, originalPx } = action.payload;
  let px = Uint8ClampedArray.from(state.currentPx);
  let coloredPx = Uint8ClampedArray.from(state.currentPx);
  switch (action.type) {
    case "initial":
      return { currentPx: action.payload };
    case "color":
      // First apply brightness to original px (without colors).
      let adjustedPx = applyBrightness(brightness, px, originalPx);
      // Then other colors.
      for (const colorName in colors) {
        if (colorName !== color) {
          adjustedPx = applyColor(
            colorName,
            colors[colorName],
            adjustedPx,
            adjustedPx
          );
        }
      }

      px = applyColor(color, value, px, adjustedPx);
      console.log(px);
      return { currentPx: px };
    case "brightness":
      // First apply current colors to original px (without brightness).
      coloredPx = Uint8ClampedArray.from(originalPx);
      for (const colorName in colors) {
        coloredPx = applyColor(
          colorName,
          colors[colorName],
          coloredPx,
          coloredPx
        );
      }

      px = applyBrightness(value, px, coloredPx);
      return { currentPx: px };
    default:
      throw new Error();
  }
};

export default () => {
  const [originalPx, setOriginalPx] = useState([]);
  const [brightness, setBrightness] = useState(0);
  const [red, setRed] = useState(0);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);
  const canvasRef = useRef(null);
  const initialState = { currentPx: new Uint8ClampedArray() };
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      const op = getOriginalPixels(canvasRef.current, image);
      setOriginalPx(op);
      dispatch({ type: "initial", payload: op });
    };
    image.crossOrigin = "Anonymous";
    image.src = "tubulin.png";
  }, []);

  useEffect(() => {
    // Update canvas following updates to state.
    const { context, imageData, px } = fromCanvas(canvasRef);
    for (let p = 0; p < px.length; p++) {
      px[p] = state.currentPx[p];
    }
    context.putImageData(imageData, 0, 0);
  }, [state.currentPx]);

  const colors = { red, green, blue };
  return (
    <>
      <h1>Canvas</h1>
      <canvas
        ref={canvasRef}
        width="400"
        height="600"
        style={{ border: "1px solid red" }}
      />
      <BrightnessSlider
        callback={value => {
          setBrightness(value);
          dispatch({
            type: "brightness",
            payload: { value, originalPx, colors }
          });
        }}
      />
      <ColorSlider
        callback={value => {
          setRed(value);
          dispatch({
            type: "color",
            payload: { color: "red", value, originalPx, brightness, colors }
          });
        }}
        color={"red"}
      />
      <ColorSlider
        callback={value => {
          setGreen(value);
          dispatch({
            type: "color",
            payload: { color: "green", value, originalPx, brightness, colors }
          });
        }}
        color={"green"}
      />
      <ColorSlider
        callback={value => {
          setBlue(value);
          dispatch({
            type: "color",
            payload: { color: "blue", value, originalPx, brightness, colors }
          });
        }}
        color={"blue"}
      />
    </>
  );
};
