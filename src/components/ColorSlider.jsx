import React, { useState } from "react";

export default ({ callback, color }) => {
  const [value, setValue] = useState(0);

  const handleChange = newValue => {
    setValue(newValue);
    if (callback) {
      callback(newValue);
    }
  };

  const colorCaps = color[0].toUpperCase() + color.slice(1);
  return (
    <div className="ColorSlider">
      <span className="ColorSlider_name">{colorCaps}:</span>
      <input
        type="range"
        className="ColorSlider_slider"
        value={value}
        onChange={v => {
          handleChange(parseInt(v.target.value));
        }}
        min={0}
        max={50}
      />
      <span className="ColorSlider_value">{value}</span>
    </div>
  );
};
