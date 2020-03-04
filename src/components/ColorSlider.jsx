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
    <div>
      <span>{colorCaps}</span>
      <input
        type="range"
        value={value}
        onChange={v => {
          handleChange(parseInt(v.target.value));
        }}
        min={0}
        max={50}
      />
      <span>{value}</span>
    </div>
  );
};
