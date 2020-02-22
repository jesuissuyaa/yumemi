import React from "react";

const color = "#61DBFB";

const Checkbox = props => {
  return (
    <div>
      <input
        type="checkbox"
        name={props.label}
        value={props.value}
        onChange={props.onChange}
      />
      <style jsx>{`
        input {
          -webkit-appearance: none;
          background: white;
          border: 2px solid ${color};
          border-radius: 20%;
          display: flex;
          padding: 9px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        input:focus {
          outline: none;
        }
        input:checked:after {
          content: " ";
          position: absolute;
          width: 10px;
          height: 10px;
          background: ${color};
          border-radius: 20%;
        }
      `}</style>
    </div>
  );
};

export default Checkbox;
