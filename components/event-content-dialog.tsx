'use client'

import { FolderUp, Link as LinkIcon, Presentation, Video } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { getTranslation, type Language } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import type { ApiEventContentLink } from '@/lib/api/types'

// Google's palette stays for what it means: slides carry Drive blue,
// recordings carry Meet red - the colors members already recognize on those
// two hosts. `other` is a neutral link: it can point anywhere, so no brand.
// Google blue #4285F4, Google red #EA4335.
const SLIDES_COLOR = '#4285F4'
const RECORDING_COLOR = '#EA4335'

function ItemIcon({ kind }: { kind: ApiEventContentLink['kind'] }) {
  const color = kind === 'recording' ? RECORDING_COLOR : kind === 'slides' ? SLIDES_COLOR : undefined
  const size = 'h-4 w-4 shrink-0'
  if (kind === 'recording') return <Video className={size} style={color ? { color } : undefined} />
  if (kind === 'slides') return <Presentation className={size} style={color ? { color } : undefined} />
  return <LinkIcon className={`${size} text-muted-foreground`} />
}

interface EventContentDialogProps {
  /** Already server-filtered to published rows whose URLs passed isSafeHttpUrl. */
  links: ApiEventContentLink[];
  lang: Language;
  className?: string;
}

function Section({ title, links }: { title: string; links: ApiEventContentLink[] }) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="grid min-w-0 gap-1.5">
        {links.map((link) => (
          <Button key={link.id} variant="outline" size="sm" asChild>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="min-w-0 justify-start gap-2 font-normal"
              dir="auto"
            >
              <ItemIcon kind={link.kind} />
              <span className="truncate">{link.label}</span>
            </a>
          </Button>
        ))}
      </div>
    </section>
  )
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
        {/* A darker Google green than the icon palette: white label text on
            #34A853 sits at ~3.0:1, under the 4.5:1 WCAG AA floor; #1e8e3e
            reads 4.5:1 while still being unmistakably Google green. */}
        <Button
          size="lg"
          className={cn('bg-[#1e8e3e] text-white hover:bg-[#187a33]', className)}
        >
          <FolderUp className="h-5 w-5" />
          {t('eventDetail.content')}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-h-[85vh] overflow-y-auto sm:max-w-md"
        aria-describedby={undefined}
      >
        {/* text-start keeps the Arabic title on the right, flush with the
            section labels under it; rtl:ps-12 keeps it clear of the close X,
            which sits at the physical top-right corner. The description is
            dropped (and aria-describedby silenced) rather than repeating the
            title to screen readers twice. */}
        <DialogHeader className="text-start sm:text-start rtl:ps-12">
          <DialogTitle>{t('eventDetail.content')}</DialogTitle>
        </DialogHeader>

        {slides.length > 0 && (
          <Section title={t('eventDetail.content.slides')} links={slides} />
        )}

        {recordings.length > 0 && (
          <Section title={t('eventDetail.content.recordings')} links={recordings} />
        )}
      </DialogContent>
    </Dialog>
  )
}
