import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ message = "جاري التحميل..." }) => {
  return (
    <div className="container py-12 px-4 md:px-6 flex flex-col justify-center items-center min-h-[60vh]">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-gray-600 dark:text-gray-400 text-lg">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
