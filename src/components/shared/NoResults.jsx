import { Card, CardContent } from "@/components/ui/card";

const NoResults = ({ icon, title, message, actionButton }) => {
  return (
    <Card className="w-full max-w-lg mx-auto shadow-none border-dashed border-gray-300 dark:border-gray-700">
      <CardContent className="text-center py-12 px-6">
        {icon && <div className="mb-4 flex justify-center">{icon}</div>}
        <h3 className="text-xl font-bold mb-2 text-gray-700 dark:text-gray-300">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        {actionButton}
      </CardContent>
    </Card>
  );
};

export default NoResults;
