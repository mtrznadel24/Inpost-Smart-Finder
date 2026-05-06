import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import type { LockerFiltersState } from "@/features/lockers/types";

interface MobileMenuProps {
  filters: LockerFiltersState;
  onFiltersChange: (newFilters: LockerFiltersState) => void;
  onLocationSearch: (target: { lat: number, lng: number, zoom: number }) => void;
}

export function MobileMenu({ filters, onFiltersChange, onLocationSearch }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute top-4 right-4 z-[1000] md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>

        <SheetTrigger asChild>
          <Button variant="secondary" size="icon" className="shadow-lg rounded-full h-12 w-12 bg-white">
            <Menu className="h-6 w-6 text-zinc-900" />
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-[300px] sm:w-[350px] p-4 flex flex-col [&>button.opacity-70]:hidden">

          <SheetTitle className="sr-only">Filters and Searchbar</SheetTitle>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 h-12 w-12 rounded-full hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 z-[100] pointer-events-auto block"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(false);
            }}
          >
            <X className="h-6 w-6" />
          </Button>

          <div className="flex-1 overflow-y-auto px-1 pt-16 pb-4">
            <Sidebar
              lockerId={null}
              onClose={() => setOpen(false)}
              filters={filters}
              onFiltersChange={onFiltersChange}
              onLocationSearch={onLocationSearch}
            />
          </div>

        </SheetContent>
      </Sheet>
    </div>
  );
}