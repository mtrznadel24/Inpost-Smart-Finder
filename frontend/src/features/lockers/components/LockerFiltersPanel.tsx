import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { LockerFiltersState } from "../types";

interface LockerFiltersPanelProps {
  filters: LockerFiltersState;
  onFiltersChange: (newFilters: LockerFiltersState) => void;
}

export function LockerFiltersPanel({ filters, onFiltersChange }: LockerFiltersPanelProps) {
  const { t } = useTranslation();

  const safeFilters = filters || {
    is_24_7: false,
    payment_available: false,
    easy_access_zone: false,
    physical_type: undefined
  };

  return (
    <div className="flex flex-col gap-8 h-full pb-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-zinc-900">{t("sidebar.title")}</h1>
        <p className="text-sm text-zinc-500 mt-1">{t("sidebar.subtitle")}</p>
      </div>

      <div className="relative shadow-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <Input
          placeholder={t("sidebar.searchPlaceholder")}
          className="pl-10 bg-white border-zinc-200 focus-visible:ring-yellow-400 rounded-xl"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              console.log("Looking for:", e.currentTarget.value);
            }
          }}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">
          {t("sidebar.deliveryOptions")}
        </h3>
        <div className="space-y-3">

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-100 bg-white shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="access" className="text-sm font-bold text-zinc-900">
                {t("sidebar.easyAccessLabel")}
              </Label>
              <p className="text-[11px] text-zinc-500 leading-tight">
                {t("sidebar.easyAccessDesc")}
              </p>
            </div>
            <Switch
              id="access"
              checked={safeFilters.easy_access_zone}
              onCheckedChange={(val) => onFiltersChange({ ...safeFilters, easy_access_zone: val })}
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-100 bg-white shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="payment" className="text-sm font-bold text-zinc-900">
                {t("sidebar.paymentLabel")}
              </Label>
              <p className="text-[11px] text-zinc-500 leading-tight">
                {t("sidebar.paymentDesc")}
              </p>
            </div>
            <Switch
              id="payment"
              checked={safeFilters.payment_available}
              onCheckedChange={(val) => onFiltersChange({ ...safeFilters, payment_available: val })}
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-100 bg-white shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="247" className="text-sm font-bold text-zinc-900">
                {t("sidebar.available247Label")}
              </Label>
              <p className="text-[11px] text-zinc-500 leading-tight">
                {t("sidebar.available247Desc")}
              </p>
            </div>
            <Switch
              id="247"
              checked={safeFilters.is_24_7}
              onCheckedChange={(val) => onFiltersChange({ ...safeFilters, is_24_7: val })}
            />
          </div>

        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">
          {t("sidebar.machineType")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { id: undefined, label: t("sidebar.typeAll") },
            { id: "screenless", label: t("sidebar.typeScreenless") },
            { id: "modular", label: t("sidebar.typeModular") },
            { id: "newfm", label: t("sidebar.typeNewFM") },
            { id: "next", label: t("sidebar.typeNext") }
          ].map((type) => {
            const isSelected = safeFilters.physical_type === type.id;
            return (
              <Badge
                key={type.id || "all"}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer px-4 py-1.5 transition-all duration-200 ${
                  isSelected 
                    ? "bg-yellow-400 hover:bg-yellow-500 text-zinc-900 font-bold border-transparent" 
                    : "bg-white hover:bg-zinc-50 text-zinc-600 border-zinc-200"
                }`}
                onClick={() => onFiltersChange({ ...safeFilters, physical_type: type.id })}
              >
                {type.label}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}