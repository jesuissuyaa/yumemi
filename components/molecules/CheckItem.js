import React from "react";
import Checkbox from "@/components/atoms/Checkbox";
// チェックボックス + ラベルのコンポーネント
const CheckItem = props => {
  return (
    <div className="checkbox-wrapper">
      <Checkbox
        name={props.label}
        value={props.value}
        onChange={props.onChange}
      />
      <label htmlFor={props.label}>{props.label}</label>
      <style jsx>{`
        .checkbox-wrapper {
          display: flex;
          flex-basis: 15%;
          margin-bottom: 1rem;
          align-items: center;
        }
        label {
          margin-left: 0.3rem;
        }
      `}</style>
    </div>
  );
};

export default CheckItem;
