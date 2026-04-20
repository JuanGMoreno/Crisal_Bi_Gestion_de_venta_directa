import { Button } from "@/shared/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface HeaderManagerSalesProps {
  onCreateSale: () => void;
}

export default function HeaderManagerSales({
  onCreateSale,
}: HeaderManagerSalesProps) {
  return (
    <div className="mb-4 m-4 flex items-center justify-between gap-4">
      <div>
        <h2 className="pb-2 text-3xl font-bold">Gestion de Ventas</h2>
        <p className="text-gray-400">
          Registra ventas, consulta su estado y controla el impacto sobre el inventario.
        </p>
      </div>
      <Button size="lg" onClick={onCreateSale}>
        Registrar venta
        <ShoppingCart className="ml-2" />
      </Button>
    </div>
  );
}

