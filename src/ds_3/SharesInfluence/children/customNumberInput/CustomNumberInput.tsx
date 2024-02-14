import React from "react";
import classNames from "classnames";

import { CustomNumberInputProps } from "./customNumberInput.interface";

import "./styles.scss";

export const CustomNumberInput = (props: CustomNumberInputProps) => (
  <input
    {...props}
    type="number"
    className={classNames([
      "custom-number-input",
      { "custom-number-input__disabled": props.disabled },
    ])}
  ></input>
);
