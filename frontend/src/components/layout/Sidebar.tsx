import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { LockerDetails } from "@/features/lockers/components/LockerDetails";
import { ArrowLeft } from "lucide-react";

interface SidebarProps {
  lockerId: number | null;
  onClose: () => void;
}

export function Sidebar({ lockerId, onClose }: SidebarProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 h-full">
      {lockerId ? (
        <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-fit -ml-2 mb-4 text-zinc-500 hover:text-zinc-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("sidebar.backToList")}
          </Button>

          <div className="flex-1 overflow-hidden">
            <LockerDetails lockerId={lockerId} />
          </div>
        </div>
      ) : (
        <>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-zinc-900">{t("sidebar.title")}</h1>
            <p className="text-sm text-zinc-500 mt-1">{t("sidebar.subtitle")}</p>
          </div>

          <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-zinc-900 font-bold">
            {t("sidebar.searchButton")}
          </Button>

          <div className="flex-1 overflow-y-auto mt-4 border-t pt-4">
            <p className="text-sm text-zinc-400">Filters...</p>
          </div>
        </>
      )}
    </div>
  );
}