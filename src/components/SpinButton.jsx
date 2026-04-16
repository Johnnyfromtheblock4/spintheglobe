import React from "react";

const SpinButton = ({ isSpinning, hasSelection, onClick }) => {
  let label = "Spin";

  if (isSpinning) {
    label = "Stop";
  } else if (hasSelection) {
    label = "Spin again";
  }

  return (
    <button type="button" className="btn spin-btn" onClick={onClick}>
      {label}
    </button>
  );
};

export default SpinButton;
