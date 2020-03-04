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
    <div>
      <span>Brightness:</span>
      <input
        type="range"
        value={brightness}
        onChange={v => {
          handleChange(parseInt(v.target.value));
        }}
        min={-50}
        max={50}
      />
      <span>{brightness}</span>
    </div>
  );
};
