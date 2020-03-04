import React, { useEffect, useRef, useState } from "react";
import BrightnessSlider from "./components/BrightnessSlider";

const getOriginalPixels = (canvas, image) => {
  if (canvas) {
    const [w, h] = [canvas.width, canvas.height];
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, w, h).data;
  }
  return [];
};

const updateBrightness = (canvas, originalPixels, brightness) => {
  const [w, h] = [canvas.width, canvas.height];
  const context = canvas.getContext("2d");
  const imageData = context.createImageData(w, h);
  let pixels = imageData.data;

  for (let p = 0; p < pixels.length; p++) {
    if (p % 4 !== 3) {
      pixels[p] = originalPixels[p] + brightness;
    } else {
      // Every 4th pixel is alpha value, which we don't want to modify
      pixels[p] = originalPixels[p];
    }
  }
  canvas.getContext("2d").putImageData(imageData, 0, 0);
};

export default () => {
  const [originalPixels, setOriginalPixels] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    let image = new Image();
    image.onload = () => {
      setOriginalPixels(getOriginalPixels(canvasRef.current, image));
    };
    image.crossOrigin = "Anonymous";
    image.src = "tubulin.png";
  }, []);

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
        callback={v => updateBrightness(canvasRef.current, originalPixels, v)}
      />
    </>
  );
};
