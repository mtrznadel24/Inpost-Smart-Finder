import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { LockerDetails } from "@/features/lockers/components/LockerDetails";
import { LockerFiltersPanel } from "@/features/lockers/components/LockerFiltersPanel";
import { ArrowLeft } from "lucide-react";
import type { LockerFiltersState } from "@/features/lockers/types";

interface SidebarProps {
  lockerId: number | null;
  onClose: () => void;
  filters: LockerFiltersState;
  onFiltersChange: (newFilters: LockerFiltersState) => void;
}

export function Sidebar({ lockerId, onClose, filters, onFiltersChange }: SidebarProps) {
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
        <LockerFiltersPanel filters={filters} onFiltersChange={onFiltersChange} />
      )}
    </div>
  );
}