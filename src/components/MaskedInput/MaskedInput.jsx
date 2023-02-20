import React from "react";
import InputMask from "react-input-mask";
import { Input } from "antd";
import FormItem from "antd/lib/form/FormItem";

const MaskInput = props => {
  const { disabled, mask, label, meta, required } = props;
  return (
    <FormItem
      label={label}
      validateStatus={
        meta.touched ? (meta.error ? "error" : "success") : undefined
      }
      help={meta.touched ? (meta.error ? meta.error : undefined) : undefined}
      hasFeedback={meta.touched ? true : false}
      required={required}
    >
      <InputMask
        mask={mask}
        disabled={disabled}
        autoComplete="off"
        {...props.input}
      >
        <Input />
      </InputMask>
    </FormItem>
  );
};

export default MaskInput;
