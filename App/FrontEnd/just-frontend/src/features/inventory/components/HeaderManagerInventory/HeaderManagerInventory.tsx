import { Button } from "@/shared/components/ui/button";
import { PackagePlus } from "lucide-react";

interface HeaderManagerInventoryProps {
  onCreateEntry: () => void;
}

export default function HeaderManagerInventory({
  onCreateEntry,
}: HeaderManagerInventoryProps) {
  return (
    <div className="mb-4 m-4 flex items-center justify-between gap-4">
      <div>
        <h2 className="pb-2 text-3xl font-bold">Gestion de Inventario</h2>
        <p className="text-gray-400">
          Gestiona el stock de tus productos registrando ingresos, vencimientos y costos de compra.
        </p>
      </div>
      <Button size="lg" onClick={onCreateEntry}>
        Registrar Ingreso
        <PackagePlus className="ml-2" />
      </Button>
    </div>
  );
}
