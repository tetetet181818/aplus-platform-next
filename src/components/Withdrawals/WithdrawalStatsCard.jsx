import { Card, CardContent } from "@/components/ui/card";
const WithdrawalStatsCard = ({ title, value }) => (
  <Card className="flex-1 text-center transition-all hover:shadow-md">
    <CardContent className="p-4">
      <h3 className="text-primary text-lg font-semibold">{title}</h3>
      <p className="font-bold text-2xl mt-3 animate-fade-in">{value}</p>
    </CardContent>
  </Card>
);

export default WithdrawalStatsCard;
