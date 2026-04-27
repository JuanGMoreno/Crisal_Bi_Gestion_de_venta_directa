"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import type Product from "@/features/products/types/Product";
import { Button } from "@/shared/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/lib/utils";

interface ProductComboboxProps {
  products: Product[];
  value?: string;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  onChange: (value: string) => void;
}

export function ProductCombobox({
  products,
  value,
  placeholder = "Selecciona un producto",
  emptyMessage = "No se encontraron productos",
  disabled = false,
  invalid = false,
  onChange,
}: ProductComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id_producto === value),
    [products, value]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={invalid}
          disabled={disabled}
          className={cn(
            "h-9 w-full justify-between px-3 font-normal",
            !selectedProduct && "text-muted-foreground",
            invalid && "border-destructive focus-visible:ring-destructive/30"
          )}
        >
          <span className="truncate">
            {selectedProduct ? selectedProduct.nombre : placeholder}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar por nombre, codigo o categoria" />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {products.map((product) => {
                const isSelected = product.id_producto === value;

                return (
                  <CommandItem
                    key={product.id_producto}
                    value={product.nombre}
                    keywords={[product.codigo, product.categoria]}
                    onSelect={() => {
                      onChange(product.id_producto);
                      setOpen(false);
                    }}
                    className="items-start gap-3 px-3 py-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{product.nombre}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {product.codigo} · {product.categoria}
                      </p>
                    </div>
                    <Check
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
