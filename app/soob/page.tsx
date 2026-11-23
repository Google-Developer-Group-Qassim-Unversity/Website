import type { Metadata } from 'next'
import { auth } from '@clerk/nextjs/server'
import { Button } from '@/components/ui/button'
import { serverApi } from '@/lib/api/server'
import { config } from '@/lib/config'
import { withRedirectParam } from '@/lib/redirect-config'
import { SoobGame, type GameStatus } from './soob-game'
import styles from './soob.module.css'

export const metadata: Metadata = {
  title: 'ابحث عن شخصية صوب',
  robots: { index: false, follow: false },
}

export default async function SoobPage() {
  const { userId } = await auth()
  if (!userId) {
    const signInUrl = withRedirectParam('/sign-in?lang=ar', new URL('/soob', config.thisAppUrl).href)
    return <SoobGame status={null} signInUrl={signInUrl} />
  }

  let status: GameStatus
  try {
    status = await serverApi.get<GameStatus>('/soob-draw/entry', { revalidate: false })
  } catch {
    return (
      <main className={styles.shell} lang="ar" dir="rtl">
        <div className={styles.unavailable}>
          <h1>تحدّي صوب</h1>
          <p>تعذّر تحميل اللعبة. حاول مرة ثانية.</p>
          <Button asChild className={styles.action}><a href="/soob">إعادة المحاولة</a></Button>
        </div>
      </main>
    )
  }

  return <SoobGame status={status} signInUrl={null} />
}
