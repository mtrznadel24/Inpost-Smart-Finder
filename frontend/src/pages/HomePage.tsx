import { Map } from "@/features/map/components/Map";
import { Sidebar } from "@/components/layout/Sidebar";
import { useTranslation } from "react-i18next";
import {MobileMenu} from "@/components/layout/MobileMenu.tsx";

export function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="flex h-screen w-full bg-zinc-50 overflow-hidden relative">

      <aside className="w-80 bg-white border-r p-4 z-10 shadow-xl hidden md:flex flex-col">
        <Sidebar />
      </aside>

      <main className="flex-1 relative h-full w-full">
        <Map />
        <MobileMenu />
      </main>

    </div>
  );
}