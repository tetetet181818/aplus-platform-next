import React from "react";
import { useFormik } from "formik";

const Form = ({
  children,
  initialValues = {},
  validationSchema,
  onSubmit,
  className = "space-y-6",
}) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    validateOnChange: true,
    validateOnBlur: true,
  });

  return (
    <form onSubmit={formik.handleSubmit} className={className}>
      {children}
      {formik.submitError && (
        <div className="text-red-500 text-sm mt-2">{formik.submitError}</div>
      )}
    </form>
  );
};

export default Form;
