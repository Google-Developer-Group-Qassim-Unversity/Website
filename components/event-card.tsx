"use client"

import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ApiEventItem, ApiOpenEventItem } from "@/lib/api/types";
import { getEffectiveRegistrationStatus, getEventPhase } from "@/lib/event-utils";
import { Button } from "./ui/button";
import { EventSignupButton } from "./event-signup-button";
import { EventLevel } from "./event-level";
import { useTranslation } from 'react-i18next';
import '@/lib/i18n-client';

interface EventCardProps {
  event: ApiEventItem | ApiOpenEventItem;
  hideSignup?: boolean;
}

export function EventCard({ event, hideSignup = false }: EventCardProps) {
  const { t } = useTranslation();
  const phase = getEventPhase(event);
  const effectiveReg = getEffectiveRegistrationStatus(event);
  const isCancelled = event.status === "cancelled";
  const showRegistrationBadge = !isCancelled && !hideSignup && phase !== "ended";

  const hasRegistrationForm =
    event.status === "published" &&
    event.form_id != null &&
    event.form_type != null &&
    event.form_type !== "none";

  const renderPhaseBadge = () => {
    if (isCancelled) {
      return (
        <Badge variant="destructive">
          {t("eventDetail.status.cancelled")}
        </Badge>
      );
    }
    if (phase === "live") {
      return (
        <Badge
          variant="outline"
          className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
        >
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {t("eventDetail.status.live")}
        </Badge>
      );
    }
    if (phase === "upcoming") {
      return (
        <Badge
          variant="outline"
          className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
        >
          {t("eventDetail.status.upcoming")}
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        {t("eventDetail.status.ended")}
      </Badge>
    );
  };

  const renderRegistrationBadge = () => {
    if (!showRegistrationBadge) return null;
    switch (effectiveReg) {
      case "open":
        return (
          <Badge
            variant="outline"
            className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/60 dark:text-green-300"
          >
            {t("eventDetail.status.openShort")}
          </Badge>
        );
      case "not_open":
        return (
          <Badge
            variant="outline"
            className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
          >
            {t("eventSignup.opensSoon")}
          </Badge>
        );
      case "closed":
        return (
          <Badge variant="secondary">
            {t("eventDetail.status.registrationClosed")}
          </Badge>
        );
      case "none":
        return (
          <Badge
            variant="outline"
            className="border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-300"
          >
            {t("eventDetail.status.openToJoin")}
          </Badge>
        );
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          {renderPhaseBadge()}
          {renderRegistrationBadge()}
        </div>
        <CardTitle>
          <Link href={`/events/${event.id}`} className="hover:underline">
            {event.name}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-2 mt-3 min-h-10">
          {event.description}
        </CardDescription>
        <EventLevel level={event.level} className="mt-2" />
      </CardHeader>
      <CardContent className="flex-1">
        {event.image_url && (
          <div className="relative w-full h-[400px] flex items-center justify-center rounded-md overflow-hidden">
            <Image
              src={event.image_url}
              alt={event.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain"
            />
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-2">
        {!hideSignup && event.form_type === "none" ? (
          <Link href={`/events/${event.id}`} className="w-full">
            <Button variant="default" className="w-full">
              {t('eventCard.viewEvent')}
            </Button>
          </Link>
        ) : (
          <>
            <Link
              href={`/events/${event.id}`}
              className={hideSignup || !hasRegistrationForm ? "w-full" : "flex-1"}
            >
              <Button variant="outline" className="w-full cursor-pointer">
                {t('eventCard.viewDetails')}
              </Button>
            </Link>
            {!hideSignup && hasRegistrationForm && (
              <EventSignupButton event={event} className="flex-1" />
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}
