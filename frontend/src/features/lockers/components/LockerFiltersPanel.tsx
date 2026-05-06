import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Search, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LockerFiltersState } from "../types";
import { useGeocoding } from "@/hooks/useGeocoding.ts";
import { useState } from "react";

interface LockerFiltersPanelProps {
  filters: LockerFiltersState;
  onFiltersChange: (newFilters: LockerFiltersState) => void;
  onLocationSearch: (target: { lat: number, lng: number, zoom: number }) => void;
}

export function LockerFiltersPanel({ filters, onFiltersChange, onLocationSearch }: LockerFiltersPanelProps) {
  const { t, i18n } = useTranslation();
  const { searchAddress, isSearching, error } = useGeocoding();
  const [searchValue, setSearchValue] = useState("");

  const safeFilters = filters || {
    is_24_7: false,
    payment_available: false,
    easy_access_zone: false,
    physical_type: undefined,
    function: undefined
  };

  const handleSearch = async () => {
    if (!searchValue.trim()) return;
    const result = await searchAddress(searchValue);
    if (result) {
      onLocationSearch({ lat: result.lat, lng: result.lng, zoom: result.zoom });
    }
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'pl' ? 'en' : 'pl';
    i18n.changeLanguage(nextLang);
  };

  return (
    <div className="flex flex-col gap-8 h-full pb-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900">{t("sidebar.title")}</h1>
          <p className="text-sm text-zinc-500 mt-1">{t("sidebar.subtitle")}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLanguage}
          className="text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900"
        >
          <Globe className="w-4 h-4 mr-1.5" />
          {i18n.language === 'pl' ? 'EN' : 'PL'}
        </Button>
      </div>

      <div className="flex flex-col gap-1">
        <div className="relative shadow-sm">
          {isSearching ? (
             <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 animate-spin" />
          ) : (
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          )}
          <Input
            placeholder={t("sidebar.searchPlaceholder")}
             value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 bg-white border-zinc-200 focus-visible:ring-yellow-400 rounded-xl"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                  handleSearch();
              }
            }}
          />
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{t(error as any)}</p>}
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

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">
          {t("sidebar.additionalFunctions")}
        </h3>
        <div className="flex flex-col gap-2">
          {[
            { id: undefined, label: t("sidebar.typeAll") },
            { id: "parcel_send", label: t("sidebar.funcSendParcel") },
            { id: "allegro_parcel_send", label: t("sidebar.funcSendAllegro") },
            { id: "cross_network_parcel_send", label: t("sidebar.funcSendCrossNetwork") },
            { id: "standard_courier_send", label: t("sidebar.funcCourierPickup") }
          ].map((func) => {
            const isSelected = safeFilters.function === func.id;
            return (
              <Badge
                key={func.id || "all_func"}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 transition-all duration-200 justify-start ${
                  isSelected 
                    ? "bg-zinc-900 hover:bg-zinc-800 text-white font-bold border-transparent" 
                    : "bg-white hover:bg-zinc-50 text-zinc-600 border-zinc-200"
                }`}

                onClick={() => onFiltersChange({ ...safeFilters, function: func.id })}
              >
                {func.label}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}