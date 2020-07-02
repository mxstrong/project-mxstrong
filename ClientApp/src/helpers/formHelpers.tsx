import React from "react";
import { TextField } from "@material-ui/core";

interface IOptions {
  className: string;
  label: string;
  input: string;
  meta: {
    touched: boolean;
    invalid: boolean;
    error: boolean;
  };
}

export const renderTextField = ({
  label,
  input,
  meta: { touched, invalid, error },
  ...custom
}: IOptions) => (
  <TextField
    label={label}
    placeholder={label}
    error={touched && invalid}
    helperText={touched && error}
    {...input}
    {...custom}
  />
);
