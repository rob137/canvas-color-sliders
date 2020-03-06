import React, { useState } from "react";

export default ({ callback }) => {
  const [brightness, setBrightness] = useState(0);

  const handleChange = newValue => {
    setBrightness(newValue);
    if (callback) {
      callback(newValue);
    }
  };

  return (
    <div className="BrightnessSlider">
      <span className="BrightnessSlider_name">Brightness:</span>
      <input
        type="range"
        className="BrightnessSlider_slider"
        value={brightness}
        onChange={v => {
          handleChange(parseInt(v.target.value));
        }}
        min={-50}
        max={50}
      />
      <span className="BrightnessSlider_value">{brightness}</span>
    </div>
  );
};
