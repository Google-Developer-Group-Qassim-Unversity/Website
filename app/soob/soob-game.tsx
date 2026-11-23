'use client'

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { ArrowLeft, Check, Search, Sparkles } from 'lucide-react'
import confetti from 'canvas-confetti'
import { Button } from '@/components/ui/button'
import { useApi } from '@/hooks/use-api'
import styles from './soob.module.css'

type Tap = { x: number; y: number }
type Hitbox = Tap & { width: number; height: number }
type EntryStatus = { entered: boolean }
export type GameStatus = EntryStatus & { hitbox: Hitbox }
type Props = { status: GameStatus; signInUrl: null } | { status: null; signInUrl: string }
type EntryState = 'saving' | 'confirmed' | 'failed'

const SCENE = '/soob/picnic.webp'
const COLOR_MASCOT = '/soob/mascot-color.webp'
const INK_MASCOT = '/soob/mascot-ink.webp'

function percent(value: number) {
  return `${value * 100}%`
}

export function SoobGame({ status, signInUrl }: Props) {
  const api = useApi()
  const [playing, setPlaying] = useState(false)
  const [miss, setMiss] = useState<(Tap & { attempt: number }) | null>(null)
  const [entry, setEntry] = useState<EntryState | null>(status?.entered ? 'confirmed' : null)
  const [revealed, setRevealed] = useState(status?.entered ?? false)
  const winningTap = useRef<Tap | null>(null)
  const saving = useRef(false)
  const revealCanvas = useRef<HTMLCanvasElement>(null)
  const result = useRef<HTMLDivElement>(null)
  const hitbox = status?.hitbox
  const showBoard = playing && !!hitbox

  useEffect(() => {
    if (!status || status.entered) return
    for (const src of [SCENE, INK_MASCOT]) {
      const asset = new window.Image()
      asset.src = src
    }
  }, [status])

  useEffect(() => {
    if (!revealed || !winningTap.current || !revealCanvas.current) return
    const burst = confetti.create(revealCanvas.current, { resize: true, disableForReducedMotion: true })
    void burst({ particleCount: 42, spread: 80, startVelocity: 20, scalar: 0.75,
      origin: { x: 0.5, y: 0.56 }, colors: ['#6938ad', '#ffda55', '#c9a1ff'] })
    return () => burst.reset()
  }, [revealed])

  useEffect(() => {
    if (revealed && entry === 'confirmed' && winningTap.current) {
      result.current?.focus({ preventScroll: true })
    }
  }, [entry, revealed])

  async function saveEntry(tap: Tap) {
    if (saving.current) return
    saving.current = true
    setEntry('saving')
    try {
      const response = await api.post<EntryStatus>('/soob-draw/entry', tap)
      setEntry(response.entered === true ? 'confirmed' : 'failed')
    } catch {
      setEntry('failed')
    } finally {
      saving.current = false
    }
  }

  function win(tap: Tap) {
    if (winningTap.current) return
    winningTap.current = tap
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setRevealed(true)
    void saveEntry(tap)
  }

  function tapScene(event: MouseEvent<HTMLDivElement>) {
    if (!hitbox || winningTap.current) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const tap = {
      x: (event.clientX - bounds.left) / bounds.width,
      y: (event.clientY - bounds.top) / bounds.height,
    }
    if (tap.x >= hitbox.x && tap.x <= hitbox.x + hitbox.width &&
        tap.y >= hitbox.y && tap.y <= hitbox.y + hitbox.height) {
      win(tap)
    } else {
      setMiss(previous => ({ ...tap, attempt: (previous?.attempt ?? 0) + 1 }))
    }
  }

  const placement = hitbox && {
    '--target-x': percent(hitbox.x),
    '--target-y': percent(hitbox.y),
    '--target-width': percent(hitbox.width),
    '--target-height': percent(hitbox.height),
  } as CSSProperties

  const endMessage = revealed && entry && (
    <div className={styles.result} role="status" ref={result} tabIndex={-1}>
      {entry === 'confirmed' ? (
        <>
          <span className={styles.check} aria-hidden="true"><Check size={20} strokeWidth={3} /></span>
          <h1>مبروك! 🎉</h1>
          <p>دخلت على السحب!</p>
        </>
      ) : entry === 'failed' ? (
        <>
          <p>تعذّر تسجيل دخولك في السحب.</p>
          <Button className={styles.action} onClick={() => {
            if (winningTap.current) void saveEntry(winningTap.current)
          }}>إعادة المحاولة</Button>
        </>
      ) : <p>جاري تسجيل دخولك في السحب…</p>}
    </div>
  )

  return (
    <main className={styles.shell} lang="ar" dir="rtl">
      <div className={styles.game}>
        <div className={styles.partner}><span>نادي قوقل للطلبة المطوّرين</span><span aria-hidden="true">×</span><strong>صوب</strong></div>
        {!showBoard && !entry && (
          <section className={styles.welcome}>
            <div className={styles.hero}>
              <h1>ابحث عن</h1>
              <div className={styles.mascotStand}>
                <Sparkles className={styles.sparkleTop} aria-hidden="true" />
                <img src={COLOR_MASCOT} alt="شخصية صوب" width={506} height={640} fetchPriority="high" />
                <Sparkles className={styles.sparkleBottom} aria-hidden="true" />
              </div>
            </div>
            <div className={styles.welcomeBody}>
              <p className={styles.instruction}><Search size={21} aria-hidden="true" /><span><strong>مهمتك:</strong> ابحث عن الشخصية الموجودة في الصورة والمخفية بين الأشياء العشوائية!</span></p>
              {signInUrl ? (
                <>
                  <Button asChild className={styles.action}><a href={signInUrl}>ابدأ الآن <ArrowLeft aria-hidden="true" /></a></Button>
                  <p className={styles.signInHint}>سجّل الدخول للمشاركة في السحب</p>
                </>
              ) : (
                <Button className={styles.action} onClick={() => setPlaying(true)}>ابدأ الآن <ArrowLeft aria-hidden="true" /></Button>
              )}
            </div>
          </section>
        )}

        {showBoard && (
          <>
            <div className={styles.reminder}>
              <div>
                <h1>ابحث عن</h1>
                <p>اضغط على الشخصية لما تلاقيها</p>
              </div>
              <img src={COLOR_MASCOT} alt="شخصية صوب" width={506} height={640} />
            </div>
            <div className={styles.frame} data-entry={entry ?? undefined}>
              <div className={styles.scene} style={placement} onClick={tapScene} data-soob-scene>
                <img className={styles.picnic} src={SCENE} alt="رسمة لنزهة بين النخيل، تختبئ فيها شخصية صوب" width={1122} height={1402} draggable={false} />
                {!entry && (
                  <button className={styles.target} aria-label="شخصية صوب" onClick={event => {
                    if (event.detail !== 0) return
                    event.stopPropagation()
                    win({ x: hitbox.x + hitbox.width / 2, y: hitbox.y + hitbox.height / 2 })
                  }}>
                    <img src={INK_MASCOT} alt="" draggable={false} />
                  </button>
                )}
                {!entry && miss && <span key={miss.attempt} className={styles.miss} style={{ left: percent(miss.x), top: percent(miss.y) }} aria-hidden="true" />}
                {entry && (
                  <>
                    <div className={styles.wash} />
                    <div className={styles.flyingMascot} onAnimationEnd={event => {
                      if (event.target === event.currentTarget) setRevealed(true)
                    }}>
                      <img className={styles.flyingInk} src={INK_MASCOT} alt="" />
                      <img className={styles.flyingColor} src={COLOR_MASCOT} alt="شخصية صوب" />
                    </div>
                    <canvas className={styles.confetti} ref={revealCanvas} aria-hidden="true" />
                    {endMessage}
                  </>
                )}
              </div>
            </div>
            {!entry && (
              <p className={styles.feedback} role="status">
                {miss ? 'جرّب مكان ثاني' : ''}
              </p>
            )}
          </>
        )}

        {!showBoard && entry === 'confirmed' && (
          <div className={styles.returning}>
            <img src={COLOR_MASCOT} alt="شخصية صوب" width={506} height={640} />
            {endMessage}
          </div>
        )}
      </div>
    </main>
  )
}
