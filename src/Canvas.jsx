import React, { useEffect, useRef, useState } from "react";
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
export default () => {
  const [originalPixels, setOriginalPixels] = useState([]);
  const [brightness, setBrightness] = useState(1);
  const [red, setRed] = useState(0);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    let image = new Image();
    image.onload = () => {
      const op = getOriginalPixels(canvasRef.current, image);
      setOriginalPixels(op);
    };
    image.crossOrigin = "Anonymous";
    image.src = "tubulin.png";
  }, []);

  useEffect(() => {}, [brightness, red, green, blue]);

  const updateImage = (canvas, originalPixels, value, color) => {
    const colors = ["red", "green", "blue"];
    const [w, h] = [canvas.width, canvas.height];
    const context = canvas.getContext("2d");
    const imageData = context.createImageData(w, h);
    let pixels = imageData.data;

    for (let p = 0; p < pixels.length; p++) {
      if (
        (color === "brightness" && p % 4 !== 3) ||
        p % 4 === colors.indexOf(color)
      ) {
        pixels[p] = originalPixels[p] + value;
      } else {
        pixels[p] = originalPixels[p];
      }
    }
    canvas.getContext("2d").putImageData(imageData, 0, 0);
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
      <BrightnessSlider
        callback={v => {
          updateImage(canvasRef.current, originalPixels, v, "brightness");
          setBrightness(v);
        }}
      />
      <ColorSlider
        callback={v => {
          updateImage(canvasRef.current, originalPixels, v, "red");
          setRed(v);
        }}
        color={"red"}
      />
      <ColorSlider
        callback={v => {
          updateImage(canvasRef.current, originalPixels, v, "green");
          setGreen(v);
        }}
        color={"green"}
      />
      <ColorSlider
        callback={v => {
          updateImage(canvasRef.current, originalPixels, v, "blue");
          setBlue(v);
        }}
        color={"blue"}
      />
    </>
  );
};
