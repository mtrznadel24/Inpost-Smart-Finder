import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export function Sidebar() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 h-full">
      <div>
        <h1 className="text-xl font-bold text-zinc-900">{t("sidebar.title" as any)}</h1>
        <p className="text-sm text-zinc-500">{t("sidebar.subtitle" as any)}</p>
      </div>

      <Button className="w-full">{t("sidebar.searchButton" as any)}</Button>

      <div className="flex-1 overflow-y-auto mt-4">
        <p className="text-sm text-zinc-400">Filters...</p>
      </div>
    </div>
  );
}