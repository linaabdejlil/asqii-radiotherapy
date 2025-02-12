import React from "react";

const CustomInput = ({
  id,
  name,
  type,
  value,
  placeholder,
  required = false,
  onChange,
  onBlur,
  onClick,
  className,
  isValid,
  readOnly,
}) => {
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      className={`${
        isValid === false
          ? "outline outline-2 outline-red-500 placeholder:text-red-500"
          : "outline-none"
      } ${className}`}
      placeholder={
        isValid === false ? " *** ce champ est obligatoire" : placeholder
      }
      onChange={onChange}
      onBlur={onBlur}
      onClick={onClick}
      required={required}
      readOnly={readOnly}
    />
  );
};

export default CustomInput;
