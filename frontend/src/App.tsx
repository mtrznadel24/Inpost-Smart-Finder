import { Button } from "@/components/ui/button";
import { Map } from "@/features/map/components/Map";
import { useTranslation } from "react-i18next";

function App() {
  const { t } = useTranslation();

  return (
    <div className="flex h-screen w-full bg-zinc-50 overflow-hidden">
      <aside className="w-80 bg-white border-r p-4 flex flex-col gap-4 z-10 shadow-xl">
        <h1 className="text-xl font-bold text-zinc-900">{t("sidebar.title")}</h1>
        <p className="text-sm text-zinc-500">{t("sidebar.subtitle")}</p>

        <Button>{t("sidebar.searchButton")}</Button>
      </aside>

      <main className="flex-1 relative">
        <Map />
      </main>
    </div>
  );
}

export default App;