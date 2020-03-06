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
  const colorDict = { red, green, blue };

  useEffect(() => {
    let image = new Image();
    image.onload = () => {
      const op = getOriginalPixels(canvasRef.current, image);
      setOriginalPixels(op);
    };
    image.crossOrigin = "Anonymous";
    image.src = "tubulin.png";
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const colors = ["red", "green", "blue"];
    const [w, h] = [canvas.width, canvas.height];
    const context = canvas.getContext("2d");
    const imageData = context.createImageData(w, h);
    let pixels = imageData.data;

    // Apply colors
    colors.forEach(color => {
      const index = colors.indexOf(color);
      for (let p = index; p < pixels.length; p += 4) {
        pixels[p] = originalPixels[p] + colorDict[color];
      }
    });
    // Apply brightness
    for (let p = 0; p < pixels.length; p++) {
      if (p % 4 !== 3) {
        pixels[p] = pixels[p] + brightness;
      } else {
        pixels[p] = originalPixels[p];
      }
    }

    canvas.getContext("2d").putImageData(imageData, 0, 0);
  }, [brightness, red, green, blue]);

  const updateImage = (canvas, originalPixels, value, color) => {};

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
