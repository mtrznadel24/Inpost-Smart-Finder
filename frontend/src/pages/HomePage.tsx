import { useState } from "react";
import { Map } from "@/features/map/components/Map";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { LockerDetails } from "@/features/lockers/components/LockerDetails";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function HomePage() {
  const [selectedLockerId, setSelectedLockerId] = useState<number | null>(null);

  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="flex h-screen w-full bg-zinc-50 overflow-hidden relative">

      <aside className="w-80 bg-white border-r p-4 z-10 shadow-xl hidden md:flex flex-col">
        <Sidebar lockerId={selectedLockerId} onClose={() => setSelectedLockerId(null)} />
      </aside>

      <main className="flex-1 relative h-full w-full">
        <Map onMarkerClick={(id) => setSelectedLockerId(id)} />
        <MobileMenu />
      </main>

      {isMobile && (
        <Drawer
          open={selectedLockerId !== null}
          onOpenChange={(open) => {
            if (!open) setSelectedLockerId(null);
          }}
        >
          <DrawerContent className="max-h-[85vh]">
            <div className="p-4 overflow-y-auto">
              {selectedLockerId && <LockerDetails lockerId={selectedLockerId} />}
            </div>
          </DrawerContent>
        </Drawer>
      )}

    </div>
  );
}