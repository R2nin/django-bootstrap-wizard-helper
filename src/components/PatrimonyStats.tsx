
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp, Building, Users } from "lucide-react";
import { PatrimonyItem } from "@/pages/Index";

interface PatrimonyStatsProps {
  items: PatrimonyItem[];
}

export const PatrimonyStats = ({ items }: PatrimonyStatsProps) => {
  const totalItems = items.length;
  const activeItems = items.filter(item => item.status === 'active').length;
  const totalValue = items.reduce((sum, item) => sum + item.value, 0);
  const uniqueLocations = new Set(items.map(item => item.location)).size;

  const stats = [
    {
      title: "Total de Itens",
      value: totalItems,
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Itens Ativos",
      value: activeItems,
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Valor Total",
      value: `R$ ${totalValue.toLocaleString('pt-BR')}`,
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Localizações",
      value: uniqueLocations,
      icon: Building,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
