import { notFound } from "next/navigation";
import Image from "next/image";
import { fetchEvents } from "@/lib/api/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  Calendar,
  CalendarPlus,
  Clock,
  MapPin,
  Globe,
  Info,
  Video,
} from "lucide-react";
import type { ApiEventItem } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";
import { getTranslation } from "@/lib/server-i18n";
import { EventSignupButton } from "@/components/event-signup-button";
import { AcceptedMeetingLinkButton } from "@/components/accepted-meeting-link-button";
import { EventContentDialog } from "@/components/event-content-dialog";
import {
  isSameDayOrOvernight,
  getEventDayCount,
  getEffectiveEndDate,
  buildGoogleCalendarUrl,
  getEventPhase,
  getEffectiveRegistrationStatus,
  isPublicEventLocation,
} from "@/lib/event-utils";
import type { Language } from "@/lib/translations";

// Draft events stay hidden (404); cancelled events are accessible directly with a clear notice.
const VISIBLE_STATUSES: ApiEventItem["status"][] = ["published", "cancelled"];

function isSafeHttpUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

function linkify(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;

  const parts = text.split(urlRegex);

  return parts
    .filter(Boolean)
    .map((part, i) => {
      const isUrl =
        /^https?:\/\//i.test(part) || /^www\./i.test(part);

      if (!isUrl) return <span key={i}>{part}</span>;

      const href = /^https?:\/\//i.test(part) ? part : `https://${part}`;

      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          {part}
        </a>
      );
    });
}

export async function EventDetailContent({ id, lang }: { id: string; lang: Language }) {
  const t = (key: string) => getTranslation(lang, key);

  const events = await fetchEvents();
  const visibleEvents = events.filter((e) => VISIBLE_STATUSES.includes(e.status));
  const event = visibleEvents.find((e) => e.id === parseInt(id, 10));

  if (!event) {
    notFound();
  }

  const isCancelled = event.status === "cancelled";
  const isPublished = event.status === "published";
  const phase = getEventPhase(event);
  const effectiveReg = getEffectiveRegistrationStatus(event);

  // Image URL is now returned as full URL from the API
  const imageUrl = event.image_url;

  // Get location icon based on location type
  const LocationIcon = event.location_type === "online" ? Globe : MapPin;

  // Format date with proper localization
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = lang === "ar" ? "ar-SA" : "en-US";
    return date.toLocaleDateString(locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      numberingSystem: "latn", // Use Western numerals
    });
  };

  // Format time with proper localization and Arabic AM/PM
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const locale = lang === "ar" ? "ar-SA" : "en-US";
    let timeString = date.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      numberingSystem: "latn", // Use Western numerals
    });

    // Replace English AM/PM with Arabic equivalents
    if (lang === "ar") {
      timeString = timeString.replace(/AM/gi, "صباحاً").replace(/PM/gi, "مساءً");
    }

    return timeString;
  };

  const startDate = formatDate(event.start_datetime);
  const start = new Date(event.start_datetime);
  const end = new Date(event.end_datetime);
  const isSameDay = isSameDayOrOvernight(start, end);
  const effectiveEndDate = getEffectiveEndDate(start, end);
  const endDate = isSameDay ? startDate : formatDate(effectiveEndDate.toISOString());
  const diffDays = getEventDayCount(start, end);
  const dailyStartTime = formatTime(event.start_datetime);
  const dailyEndTime = formatTime(event.end_datetime);

  // Get translated location type label
  const getLocationTypeLabel = () => {
    switch (event.location_type) {
      case "online":
        return t("eventDetail.locationType.online");
      case "on-site":
        return t("eventDetail.locationType.onsite");
      case "none":
      case "hidden":
        return t("eventDetail.locationType.none");
      default:
        return event.location_type;
    }
  };

  const renderStatusBadges = () => {
    if (isCancelled) {
      return (
        <Badge variant="destructive" className="text-sm px-3 py-1">
          {t("eventDetail.status.cancelled")}
        </Badge>
      );
    }

    const phaseBadge =
      phase === "live" ? (
        <Badge
          variant="outline"
          className="text-sm px-3 py-1 border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
        >
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          {t("eventDetail.status.live")}
        </Badge>
      ) : phase === "upcoming" ? (
        <Badge
          variant="outline"
          className="text-sm px-3 py-1 border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
        >
          {t("eventDetail.status.upcoming")}
        </Badge>
      ) : (
        <Badge variant="secondary" className="text-sm px-3 py-1">
          {t("eventDetail.status.ended")}
        </Badge>
      );

    if (phase === "ended") {
      return phaseBadge;
    }

    let regBadge: React.ReactNode = null;
    if (effectiveReg === "open") {
      regBadge = (
        <Badge
          variant="outline"
          className="text-sm px-3 py-1 border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/60 dark:text-green-300"
        >
          {t("eventDetail.status.open")}
        </Badge>
      );
    } else if (effectiveReg === "not_open") {
      regBadge = (
        <Badge
          variant="outline"
          className="text-sm px-3 py-1 border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
        >
          {t("eventDetail.status.opensSoon")}
        </Badge>
      );
    } else if (effectiveReg === "closed") {
      regBadge = (
        <Badge variant="secondary" className="text-sm px-3 py-1">
          {t("eventDetail.status.registrationClosed")}
        </Badge>
      );
    } else if (event.form_type === "none") {
      regBadge = (
        <Badge
          variant="outline"
          className="text-sm px-3 py-1 border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-300"
        >
          {t("eventDetail.status.openToJoin")}
        </Badge>
      );
    }

    return (
      <>
        {phaseBadge}
        {regBadge}
      </>
    );
  };

  // No registration required for this event: safe to offer adding it to Google Calendar
  const showAddToCalendar =
    isPublished && phase !== "ended" && event.form_type === "none";
  const showMeetingLink =
    isPublished &&
    phase !== "ended" &&
    !!event.meeting_url &&
    isSafeHttpUrl(event.meeting_url);
  const showAcceptedMeetingLink =
    isPublished &&
    phase !== "ended" &&
    !showMeetingLink &&
    event.location_type === "online" &&
    event.meeting_url_visibility === "accepted" &&
    event.form_id != null;
  const showSignup =
    isPublished &&
    phase !== "ended" &&
    event.form_id != null &&
    event.form_type != null &&
    event.form_type !== "none";

  // The backend ships published rows only; the safety guard skips anything
  // unsafe at the last moment, silently.
  const contentLinks = isCancelled
    ? []
    : (event.content_links ?? []).filter(
        (link) => link.published && isSafeHttpUrl(link.url)
      );

  return (
    <>
      <PageBreadcrumb
        className="mb-6"
        items={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.events"), href: "/events" },
          { label: event.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 items-start">
        {/* Event Image - Left Side */}
        <div className="flex justify-center lg:justify-start">
          {imageUrl ? (
            <ImageZoom zoomMargin={20}>
              <Image
                src={imageUrl}
                alt={event.name}
                width={600}
                height={200}
                className="rounded-xl border border-border shadow-lg max-w-full lg:max-w-md xl:max-w-lg h-auto max-h-150 object-contain"
                priority
              />
            </ImageZoom>
          ) : (
            <div className="flex items-center justify-center w-64 h-64 bg-muted rounded-xl text-muted-foreground">
              <div className="text-center">
                <Calendar className="h-16 w-16 mx-auto mb-2 opacity-50" />
                <span className="text-sm">{t("eventDetail.noImage")}</span>
              </div>
            </div>
          )}
        </div>

        {/* Event Info - Right Side */}
        <div className="space-y-6 min-w-0">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold" dir="auto">
            {event.name}
          </h1>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {renderStatusBadges()}
          </div>

          {isCancelled && (
            <Alert variant="destructive" dir={lang === "ar" ? "rtl" : "ltr"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t("eventDetail.cancelledNoticeTitle")}</AlertTitle>
              <AlertDescription>
                {t("eventDetail.cancelledNoticeDescription")}
              </AlertDescription>
            </Alert>
          )}

          {/* Date & Time */}
          <div className="space-y-3">
            <div className="flex items-start gap-2 text-muted-foreground">
              <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="flex-1" dir="auto">
                {isSameDay ? (
                  <span className="font-medium text-foreground text-base sm:text-lg">
                    {startDate}
                  </span>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-1 sm:gap-2">
                    <span className="font-medium text-foreground text-base sm:text-lg">
                      {startDate}
                    </span>
                    <span className="hidden sm:inline">—</span>
                    <span className="font-medium text-foreground text-base sm:text-lg">
                      {endDate}
                    </span>
                    {diffDays > 1 && (
                      <span className="text-sm text-muted-foreground font-normal">
                        ({diffDays} {t("eventDetail.days")})
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-5 w-5 text-primary shrink-0" />
              <span className="font-medium text-foreground" dir="auto">
                {dailyStartTime} - {dailyEndTime}
              </span>
              {!isSameDay && (
                <span className="text-sm text-muted-foreground">({t("eventDetail.daily")})</span>
              )}
            </div>
          </div>

          {/* Location */}
          {isPublicEventLocation(event.location_type) && (
            <div className="flex items-start gap-2 text-muted-foreground">
              <LocationIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="text-sm">{getLocationTypeLabel()}</span>
                <p className="font-medium text-foreground">{event.location}</p>
              </div>
            </div>
          )}

          <Separator />
          {(showMeetingLink || showAddToCalendar) && (
            <div className="flex flex-col sm:flex-row gap-2">
              {showMeetingLink && (
                <Button
                  asChild
                  size="lg"
                  className={cn("w-full", showAddToCalendar && "sm:flex-1")}
                >
                  <a href={event.meeting_url!} target="_blank" rel="noopener noreferrer nofollow">
                    <Video className="h-5 w-5" />
                    {phase === "live"
                      ? t("eventDetail.joinMeeting")
                      : t("eventDetail.meetingLink")}
                  </a>
                </Button>
              )}
              {showAddToCalendar && (
                <Button
                  asChild
                  variant="secondary"
                  size="lg"
                  className={cn("w-full", showMeetingLink && "sm:w-auto sm:shrink-0")}
                >
                  <a
                    href={buildGoogleCalendarUrl(event)}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                  >
                    <CalendarPlus className="h-5 w-5" />
                    {t("eventDetail.addToCalendar")}
                  </a>
                </Button>
              )}
            </div>
          )}
          {showAcceptedMeetingLink && (
            <AcceptedMeetingLinkButton
              formId={event.form_id!}
              phase={phase}
              joinLabel={t("eventDetail.joinMeeting")}
              linkLabel={t("eventDetail.meetingLink")}
            />
          )}
          {showSignup && (
            <EventSignupButton event={event} className="w-full" />
          )}
          {contentLinks.length > 0 && (
            <EventContentDialog links={contentLinks} lang={lang} className="w-full" />
          )}

          {/* Description Section */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 py-4">
              <Info className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-xl font-semibold">
                {t("eventDetail.description")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              {event.description ? (
                <p
                  className="text-muted-foreground leading-relaxed whitespace-pre-wrap"
                  dir="auto"
                >
                  {linkify(event.description)}
                </p>
              ) : (
                <p className="text-muted-foreground italic">
                  {t("eventDetail.noDescription")}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
