import { useTranslation } from "react-i18next";
import { useLocker } from "../hooks/useLocker";
import { Skeleton } from "@/components/ui/skeleton";
import { LockerDetailsView } from "./LockerDetails.view";

interface LockerDetailsProps {
  lockerId: number;
}

export function LockerDetails({ lockerId }: LockerDetailsProps) {
  const { t } = useTranslation();
  const { data: locker, isLoading, isError } = useLocker(lockerId);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="space-y-2 mt-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !locker) {
    return <p className="text-red-500 text-sm">{t("sidebar.loadingError")}</p>;
  }

  return <LockerDetailsView locker={locker} />;
}