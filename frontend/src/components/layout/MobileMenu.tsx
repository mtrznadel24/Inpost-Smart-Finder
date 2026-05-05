import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";

export function MobileMenu() {
  return (
    <div className="absolute top-4 left-4 z-[1000] md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="secondary" size="icon" className="shadow-lg rounded-full h-12 w-12 bg-white">
            <Menu className="h-6 w-6 text-zinc-900" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-[300px] sm:w-[350px]">
          <SheetHeader className="text-left mb-6">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>

          <Sidebar />

        </SheetContent>
      </Sheet>
    </div>
  );
}