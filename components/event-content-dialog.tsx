'use client'

import { FolderUp } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { getTranslation, type Language } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import type { ApiEventContentLink } from '@/lib/api/types'

// There is no Drive glyph in lucide, and the repo keeps brand icons as flat SVG
// components (icons/google-icon.tsx), so Google Drive's logo lives here - the
// official simple-icons path, recolored per section (slides in Google blue,
// recordings in Google red), which is what members recognize instead of the
// filename behind the link.
// Google blue: #4285F4 — the palette companion of recording red.
const SLIDES_COLOR = '#4285F4'
// Google red: a recording is "live" content, and red reads that way.
const RECORDING_COLOR = '#EA4335'

function DriveIcon({ color, ...props }: React.SVGProps<SVGSVGElement> & { color: string }) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        fill={color}
        d="M12.01 1.485c-2.082 0-3.754.02-3.743.047.01.02 1.708 3.001 3.774 6.62l3.76 6.574h3.76c2.081 0 3.753-.02 3.742-.047-.005-.02-1.708-3.001-3.775-6.62l-3.76-6.574zm-4.76 1.73a789.828 789.861 0 0 0-3.63 6.319L0 15.868l1.89 3.298 1.885 3.297 3.62-6.335 3.618-6.33-1.88-3.287C8.1 4.704 7.255 3.22 7.25 3.214zm2.259 12.653-.203.348c-.114.198-.96 1.672-1.88 3.287a423.93 423.948 0 0 1-1.698 2.97c-.01.026 3.24.042 7.222.042h7.244l1.796-3.157c.992-1.734 1.85-3.23 1.906-3.323l.104-.167h-7.249z"
      />
    </svg>
  )
}

function ItemIcon({ kind }: { kind: ApiEventContentLink['kind'] }) {
  return (
    <DriveIcon
      color={kind === 'recording' ? RECORDING_COLOR : SLIDES_COLOR}
      className="h-4 w-4 shrink-0"
    />
  )
}

interface EventContentDialogProps {
  /** Already server-filtered to published rows whose URLs passed isSafeHttpUrl. */
  links: ApiEventContentLink[];
  lang: Language;
  className?: string;
}

export function EventContentDialog({ links, lang, className }: EventContentDialogProps) {
  if (links.length === 0) return null

  const t = (key: string) => getTranslation(lang, key)
  // `other` rides under Slides & files, as on the admin's Content tab.
  const slides = links.filter((link) => link.kind !== 'recording')
  const recordings = links.filter((link) => link.kind === 'recording')

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Google green - Google's palette partner of the blue/red item icons,
            and distinct from the black "Join meeting" CTA next to it. */}
        <Button
          size="lg"
          className={cn('bg-[#34A853] text-white hover:bg-[#2d8f45]', className)}
        >
          <FolderUp className="h-5 w-5" />
          {t('eventDetail.content')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {/* text-start keeps the Arabic title on the right, flush with the
            section labels under it; rtl:ps-12 keeps it clear of the close X,
            which sits at the physical top-right corner. */}
        <DialogHeader className="text-start sm:text-start rtl:ps-12">
          <DialogTitle>{t('eventDetail.content')}</DialogTitle>
          <DialogDescription className="sr-only">{t('eventDetail.content')}</DialogDescription>
        </DialogHeader>

        {slides.length > 0 && (
          <section className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('eventDetail.content.slides')}
            </h3>
            <div className="grid gap-1.5">
              {slides.map((link) => (
                <Button key={link.url} variant="outline" size="sm" asChild>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="justify-start gap-2 font-normal"
                    dir="auto"
                  >
                    <ItemIcon kind={link.kind} />
                    {link.label}
                  </a>
                </Button>
              ))}
            </div>
          </section>
        )}

        {recordings.length > 0 && (
          <section className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('eventDetail.content.recordings')}
            </h3>
            <div className="grid gap-1.5">
              {recordings.map((link) => (
                <Button key={link.url} variant="outline" size="sm" asChild>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="justify-start gap-2 font-normal"
                    dir="auto"
                  >
                    <ItemIcon kind={link.kind} />
                    {link.label}
                  </a>
                </Button>
              ))}
            </div>
          </section>
        )}
      </DialogContent>
    </Dialog>
  )
}
