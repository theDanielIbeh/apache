import { Field } from "formik";
import * as React from "react";

interface InputProps {
  error?: string;
  touched?: boolean;
  name: string;
  label: string;
  value: string;
  type?: string;
  placeholder?: string;
}

const Input: React.FC<InputProps> = ({
  error,
  touched,
  name,
  value,
  label,
  ...rest
}) => {
  return (
    <div className="form-group" style={{ marginTop: "20px" }}>
      <label htmlFor={name}>{label}</label>
      <Field
        {...rest}
        id={name}
        name={name}
        value={value}
        className="form-control"
      />
      {error && touched && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Input;
