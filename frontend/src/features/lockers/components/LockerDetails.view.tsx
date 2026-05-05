import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MapPin,
  Clock,
  CreditCard,
  Accessibility,
  Info,
  CheckCircle2,
  XCircle,
  Package
} from "lucide-react";
import type { LockerDetails } from "@/features/lockers/types.ts";

const FeatureRow = ({ condition, text, icon: Icon }: { condition: boolean, text: string, icon: any }) => (
  <div className={`flex items-center gap-3 p-3 rounded-lg border ${condition ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-50/50 border-zinc-100 opacity-60'}`}>
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm border">
      <Icon className={`w-4 h-4 ${condition ? 'text-zinc-900' : 'text-zinc-400'}`} />
    </div>
    <span className={`text-sm flex-1 ${condition ? 'font-medium text-zinc-900' : 'text-zinc-500'}`}>
      {text}
    </span>
    {condition ? (
      <CheckCircle2 className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-zinc-300" />
    )}
  </div>
);

interface LockerDetailsViewProps {
  locker: LockerDetails;
}

export function LockerDetailsView({ locker }: LockerDetailsViewProps) {
  const { t } = useTranslation();

  return (
    <ScrollArea className="h-full pr-4 -mr-4">
      <div className="flex flex-col gap-6 pb-6">

        <div className="aspect-video relative rounded-xl overflow-hidden bg-zinc-100 border shadow-inner shrink-0">
          {locker.image_url ? (
            <img
              src={locker.image_url}
              alt={locker.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400 gap-2">
              <Package className="w-8 h-8 opacity-50" />
              <span className="text-xs font-medium uppercase tracking-wider">{t("sidebar.noImage")}</span>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm shadow-sm font-bold text-zinc-900">
              {locker.status}
            </Badge>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">{locker.name}</h2>
            {locker.physical_type && locker.physical_type !== "other" && (
              <Badge variant="outline" className="text-xs uppercase">
                {locker.physical_type}
              </Badge>
            )}
          </div>
          <div className="flex items-start gap-2 text-zinc-500 text-sm mt-2">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-yellow-500" />
            <span className="leading-tight">{locker.address}<br/>{locker.city}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <FeatureRow condition={locker.is_24_7} text={t("sidebar.available247")} icon={Clock} />
          <FeatureRow condition={locker.payment_available} text={t("sidebar.paymentAvailable")} icon={CreditCard} />
          <FeatureRow condition={locker.easy_access_zone} text={t("sidebar.easyAccess")} icon={Accessibility} />
        </div>

        {locker.description && (
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-blue-900">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-bold">{t("sidebar.descriptionHeader")}</h4>
            </div>
            <p className="text-sm leading-relaxed opacity-90">{locker.description}</p>
          </div>
        )}

      </div>
    </ScrollArea>
  );
}