
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PatrimonyStats } from "@/components/PatrimonyStats";
import { PatrimonyReport } from "@/components/PatrimonyReport";
import { PatrimonyItem } from "@/pages/Index";

interface DashboardProps {
  patrimonyItems: PatrimonyItem[];
}

export const Dashboard = ({ patrimonyItems }: DashboardProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <PatrimonyReport items={patrimonyItems} />
      </div>
      
      <PatrimonyStats items={patrimonyItems} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Itens Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patrimonyItems.slice(0, 5).map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.location}</p>
                  </div>
                  <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                    {item.status === 'active' ? 'Ativo' : 
                     item.status === 'maintenance' ? 'Manutenção' : 'Inativo'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categorias Principais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from(new Set(patrimonyItems.map(item => item.category))).map((category) => {
                const count = patrimonyItems.filter(item => item.category === category).length;
                return (
                  <div key={category} className="flex justify-between items-center">
                    <span className="font-medium">{category}</span>
                    <Badge variant="outline">{count} itens</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
