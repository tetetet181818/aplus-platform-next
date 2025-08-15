import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FormField = ({ name, label, type = "text", formik, ...props }) => {
  const field = formik.getFieldProps(name);

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        {...props}
      />
      {formik.touched[name] && formik.errors[name] && (
        <div className="text-red-500 text-sm">{formik.errors[name]}</div>
      )}
    </div>
  );
};

export default FormField;
