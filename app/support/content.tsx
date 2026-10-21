import { Instagram, Mail, Send, Twitter } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { LegalLink, LegalList, LegalSection } from "@/components/legal-page"
import { CLUB_EMAIL, clubEmailHref } from "@/lib/club-contact"

/*
 * The support page's text, Arabic first. Both versions say the same thing: change them together. The app paths it
 * names ("Profile → Settings → Delete account", the version under Profile) are the GDG Qassim app's own labels.
 */

const SOCIAL: readonly { href: string; icon: LucideIcon; ar: string; en: string }[] = [
  { href: "https://t.me/+2UZ1nUuGh29iYjM0", icon: Send, ar: "مجموعة التلقرام", en: "Telegram group" },
  { href: "https://www.instagram.com/gdg_qu", icon: Instagram, ar: "انستقرام", en: "Instagram" },
  { href: "https://x.com/gdg_qu", icon: Twitter, ar: "X", en: "X" },
]

function ContactCard({ lang, subject, lead }: { lang: "ar" | "en"; subject: string; lead: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
      <p className="text-slate-700">{lead}</p>
      <a
        href={clubEmailHref(subject)}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
      >
        <Mail className="h-4 w-4 shrink-0" />
        <span dir="ltr">{CLUB_EMAIL}</span>
      </a>
      <ul className="flex flex-wrap gap-2">
        {SOCIAL.map(({ href, icon: Icon, ar, en }) => (
          <li key={href}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:text-slate-900 hover:border-slate-300 transition-colors"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {lang === "ar" ? ar : en}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SupportArabic() {
  return (
    <>
      <LegalSection id="contact" title="تواصل معنا">
        <ContactCard
          lang="ar"
          subject="طلب مساعدة"
          lead="تحتاج مساعدة في موقع النادي أو تطبيق GDG Qassim؟ راسلنا بالبريد، أو تواصل معنا في حسابات النادي. يرد عليك فريق النادي المتطوع في أقرب وقت."
        />
      </LegalSection>

      <LegalSection id="what-to-include" title="ماذا تكتب في رسالتك">
        <LegalList>
          <li>اسمك والبريد المسجّل في حسابك أو رقمك الجامعي، لنجد حسابك.</li>
          <li>
            هل المشكلة في الموقع أم في التطبيق، ونسخة التطبيق (تجدها أسفل صفحة «حسابي»)، ونوع جهازك ونسخة iOS (الإعدادات
            ← عام ← حول).
          </li>
          <li>ماذا حدث وماذا كنت تتوقع، وصورة للشاشة إن أمكن.</li>
          <li>اسم الفعالية وتاريخها إذا كانت المشكلة في التسجيل أو الحضور أو النقاط.</li>
        </LegalList>
        <p>
          <strong>لا ترسل أبدًا كلمة مرورك أو رمز التحقق.</strong> فريق النادي لن يطلبهما منك.
        </p>
      </LegalSection>

      <LegalSection id="sign-in" title="تسجيل الدخول">
        <p>
          ادخل بالطريقة نفسها في الموقع والتطبيق لتبقى نقاطك في حساب واحد: الرقم الجامعي (نرسل رمز تحقق إلى بريدك
          الجامعي)، أو حساب Google، أو حساب Apple في تطبيق iPhone. لم يصلك الرمز؟ افحص مجلد الرسائل غير المرغوب فيها،
          وانتظر دقيقة ثم اطلب رمزًا جديدًا.
        </p>
      </LegalSection>

      <LegalSection id="check-in" title="تسجيل الحضور">
        <p>
          في يوم الفعالية افتح صفحتها في التطبيق، أو «يحدث الآن» في الرئيسية، واضغط زر مسح رمز الحضور ووجّه الكاميرا نحو
          رمز QR الذي يعرضه المنظمون، ثم أكّد حضورك. ويمكنك أيضًا مسح الرمز بكاميرا الجوال لتفتح صفحة الحضور في الموقع، أو
          عرض بطاقة عضويتك ليمسحها المنظمون.
        </p>
      </LegalSection>

      <LegalSection id="points" title="النقاط لم تظهر">
        <p>
          تُحتسب النقاط من حضورك المسجّل ومن المشاركات التي يعتمدها المنظمون، وقد تظهر بعد انتهاء الفعالية. إذا لم تظهر
          نقاط فعالية حضرتها فراسل منظميها أو راسلنا مع اسم الفعالية وتاريخها.
        </p>
      </LegalSection>

      <LegalSection id="certificates" title="الشهادات">
        <p>
          تتوفر شهادة الحضور بعد حضور كل أيام الفعالية. تجدها في التطبيق في «حسابي» ← «فعالياتي وشهاداتي»، ويمكنك حفظها
          بالعربية أو بالإنجليزية.
        </p>
      </LegalSection>

      <LegalSection id="notifications" title="الإشعارات لا تصل">
        <LegalList>
          <li>فعّل الإشعارات في التطبيق: «حسابي» ← «الإعدادات».</li>
          <li>وتأكد أنها مسموحة في iPhone: الإعدادات ← الإشعارات ← GDG Qassim، وأن وضع التركيز لا يحجبها.</li>
          <li>يصل التذكير قبل الفعاليات التي قُبلت فيها فقط، ولا نرسل إشعارات غير ضرورية في ساعات الليل.</li>
        </LegalList>
      </LegalSection>

      <LegalSection id="delete-account" title="حذف الحساب">
        <p>
          <strong>من التطبيق:</strong> «حسابي» ← «الإعدادات» ← «حذف الحساب»، ثم اكتب «احذف حسابي» للتأكيد. نحذف حساب
          الدخول وبياناتك الشخصية فورًا، وتبقى نقاطك السابقة في سجل النادي بلا اسم. إذا كنت تدخل بحساب Apple فسيطلب منك
          التطبيق تأكيدًا من Apple لإلغاء الربط.
        </p>
        <p>
          <strong>بالبريد:</strong> إذا لم تستطع استخدام التطبيق، راسلنا من البريد المسجّل في حسابك{" "}
          <LegalLink href={clubEmailHref("طلب حذف الحساب")}>بعنوان «طلب حذف الحساب»</LegalLink>، ونحذفه خلال 30 يومًا.
        </p>
        <p>
          إذا كان لك دور حالي في فريق النادي فلا يمكن حذف الحساب من التطبيق؛ راسلنا لنزيل الدور أولًا. وبطاقات المحفظة
          المحفوظة في جوالك تحذفها أنت من Apple Wallet أو Google Wallet. تفاصيل ما نحذفه وما يبقى في{" "}
          <LegalLink href="/privacy#retention">سياسة الخصوصية</LegalLink>.
        </p>
      </LegalSection>

      <LegalSection id="app-version" title="نسخة التطبيق">
        <p>
          التطبيق متاح حاليًا لـ iPhone، ويمكن لمستخدمي Android استخدام موقع النادي gdg-q.com. حدّث التطبيق إلى آخر نسخة
          قبل أن تراسلنا، فكثير من المشكلات يحلها التحديث. ترى رقم نسختك أسفل صفحة «حسابي».
        </p>
      </LegalSection>

      <LegalSection id="policies" title="السياسات">
        <p>
          <LegalLink href="/privacy">سياسة الخصوصية</LegalLink> · <LegalLink href="/terms">شروط الخدمة</LegalLink>
        </p>
      </LegalSection>
    </>
  )
}

export function SupportEnglish() {
  return (
    <>
      <LegalSection id="contact" title="Contact us">
        <ContactCard
          lang="en"
          subject="Help request"
          lead="Need help with the club's website or the GDG Qassim app? Email us, or reach us on the club's accounts. The club's volunteer team will get back to you as soon as they can."
        />
      </LegalSection>

      <LegalSection id="what-to-include" title="What to include in your message">
        <LegalList>
          <li>Your name and the email on your account, or your university ID, so we can find your account.</li>
          <li>
            Whether the problem is on the website or in the app, the app version (at the bottom of the Profile tab), and
            your device and iOS version (Settings → General → About).
          </li>
          <li>What happened and what you expected, with a screenshot if you can.</li>
          <li>The event&apos;s name and date if the problem is with a registration, a check-in or points.</li>
        </LegalList>
        <p>
          <strong>Never send your password or a verification code.</strong> The club&apos;s team will never ask for them.
        </p>
      </LegalSection>

      <LegalSection id="sign-in" title="Signing in">
        <p>
          Sign in the same way on the website and in the app so your points stay in one account: your university ID (we
          send a code to your university email), your Google account, or your Apple account in the iPhone app. No code?
          Check your spam folder, wait a minute, then ask for a new one.
        </p>
      </LegalSection>

      <LegalSection id="check-in" title="Checking in at events">
        <p>
          On the event&apos;s day, open it in the app, or Happening now on Home, tap the scan button and point the camera
          at the QR code the organizers show, then confirm. You can also scan the code with your phone&apos;s camera to
          open the check-in page on the website, or show your membership card for the organizers to scan.
        </p>
      </LegalSection>

      <LegalSection id="points" title="Missing points">
        <p>
          Points come from your recorded attendance and from contributions the organizers approve, and may appear after
          the event ends. If points for an event you attended do not appear, contact its organizers or email us with the
          event&apos;s name and date.
        </p>
      </LegalSection>

      <LegalSection id="certificates" title="Certificates">
        <p>
          A certificate of attendance is available once you have attended every day of the event. Find it in the app
          under Profile → My events &amp; certificates, and save it in Arabic or English.
        </p>
      </LegalSection>

      <LegalSection id="notifications" title="Notifications not arriving">
        <LegalList>
          <li>Turn notifications on in the app: Profile → Settings.</li>
          <li>
            Check that your iPhone allows them: Settings → Notifications → GDG Qassim, and that a Focus mode is not
            silencing them.
          </li>
          <li>Reminders come only for events you were accepted to, and we hold non-urgent alerts during the night.</li>
        </LegalList>
      </LegalSection>

      <LegalSection id="delete-account" title="Deleting your account">
        <p>
          <strong>In the app:</strong> Profile → Settings → Delete account, then type &quot;delete my account&quot; to
          confirm. We delete your sign-in account and personal data right away; your past points stay in the club&apos;s
          records with no name. If you sign in with Apple, the app asks Apple to confirm so it can remove the link.
        </p>
        <p>
          <strong>By email:</strong> if you cannot use the app, email us from the address on your account{" "}
          <LegalLink href={clubEmailHref("Account deletion request")}>
            with the subject &quot;Account deletion request&quot;
          </LegalLink>
          , and we will delete it within 30 days.
        </p>
        <p>
          If you currently hold a role on the club&apos;s team, the account cannot be deleted in the app; email us so we
          can remove the role first. Wallet passes saved on your phone are yours to remove from Apple Wallet or Google
          Wallet. What we delete and what stays is in the <LegalLink href="/privacy#retention">Privacy Policy</LegalLink>.
        </p>
      </LegalSection>

      <LegalSection id="app-version" title="App version">
        <p>
          The app is available for iPhone for now; Android users can use the club&apos;s website, gdg-q.com. Update the
          app to the latest version before you contact us: an update fixes many problems. Your version is shown at the
          bottom of the Profile tab.
        </p>
      </LegalSection>

      <LegalSection id="policies" title="Policies">
        <p>
          <LegalLink href="/privacy">Privacy Policy</LegalLink> · <LegalLink href="/terms">Terms of Service</LegalLink>
        </p>
      </LegalSection>
    </>
  )
}
