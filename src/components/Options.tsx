import React from "react";
import OptionsProps from "../Models/Options";

const Options: React.FC<OptionsProps> = ({
  limit,
  setLimit,
  options,
  setOldLimit,
}) => {
  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOldLimit(limit);
    if (e) {
      setLimit(Number(e.target.value));
    }
  };

  return (
    <div className="options">
      <label htmlFor="limit-select">Items per page:</label>
      <select id="limit-select" value={limit} onChange={handleOptionChange}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Options;
