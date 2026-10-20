import { LegalLink, LegalList, LegalSection } from "@/components/legal-page"
import { CLUB_EMAIL, CLUB_EMAIL_HREF } from "@/lib/club-contact"

/*
 * The privacy policy's text, Arabic first. It covers the website, the admin panel and the GDG Qassim app for
 * iPhone. The two versions say the same thing: change both together and update "privacy.lastUpdated" in
 * lib/translations.ts. Facts it states that come from the code (keep them true when the code changes):
 * - retention: notification rows 90 days, phones not seen for 180 days (Backend app/services/push/triggers.py);
 * - account deletion: what anonymize_member removes (Backend app/DB/members.py);
 * - public card: phone and email hidden unless the owner shows them (app/p/[uuid]/page.tsx defaults);
 * - error reports carry the account id and university ID (components/sentry-user-context.tsx).
 */

const email = <LegalLink href={CLUB_EMAIL_HREF}>{CLUB_EMAIL}</LegalLink>

export function PrivacyArabic() {
  return (
    <>
      <LegalSection id="who" title="من نحن">
        <p>
          نادي GDG القصيم (GDG on Campus Qassim University) نادٍ طلابي في جامعة القصيم يديره طلاب متطوعون. توضّح هذه
          السياسة ما نجمعه من بيانات عبر موقع النادي gdg-q.com، وتطبيق الأعضاء «GDG Qassim» على iPhone، ولوحة الإدارة
          التي يستخدمها منظمو النادي، ولماذا نجمعها، وكيف نحفظها ونحميها، وما حقوقك فيها.
        </p>
        <p>
          النادي مجموعة مستقلة، وأنشطته لا تمثّل شركة Google، وليست Google مسؤولة عن هذه الخدمات. للتواصل معنا بشأن
          بياناتك: {email}.
        </p>
      </LegalSection>

      <LegalSection id="collect" title="البيانات التي نجمعها">
        <LegalList>
          <li>
            <strong>الحساب:</strong> بريدك الإلكتروني واسمك، ورقمك الجامعي إذا دخلت ببريدك الجامعي، ومعرّف حسابك لدى
            Google أو Apple إذا دخلت بأحدهما. وإذا اخترت في Apple إخفاء بريدك، يصلنا عنوان بديل تديره Apple ويوصل رسائلنا
            إليك.
          </li>
          <li>
            <strong>الملف الشخصي:</strong> الاسم الرسمي، والاسم الذي يظهر للآخرين، والجنس، والحالة الدراسية، والمستوى،
            والكلية أو المدرسة أو الجهة، والبريد الشخصي، ورقم الجوال إن أضفته.
          </li>
          <li>
            <strong>النشاط:</strong> تسجيلك في الفعاليات وإجاباتك على نماذج التسجيل، وحالة قبولك، وتسجيلات حضورك،
            ونقاطك، وشهاداتك.
          </li>
          <li>
            <strong>بطاقة العضوية وصفحتك العامة:</strong> اسم البطاقة وتصميمها ورقمها، وما تضيفه إليها (النبذة، والتخصص،
            وروابط حساباتك)، وما تختار إظهاره منها.
          </li>
          <li>
            <strong>التطبيق:</strong> رمز الإشعارات الذي يصدره iPhone لجهازك إذا سمحت بالإشعارات، ونسخة التطبيق، ولغته،
            واختياراتك في مفاتيح الإشعارات. يستخدم التطبيق الكاميرا فقط لقراءة رمز QR الخاص بالفعالية حين تفتح شاشة المسح:
            لا يلتقط صورًا ولا يحفظها، ويرسل إلينا الرمز المقروء فقط. وإذا ضغطت زر اللصق يقرأ التطبيق النص المنسوخ مرة
            واحدة ليملأ به رمز الحضور.
          </li>
          <li>
            <strong>بيانات تقنية:</strong> سجلات الطلبات التي تصل خادمنا (مثل وقت الطلب وعنوان IP ونوع المتصفح أو نسخة
            التطبيق)، وتقارير الأخطاء من الموقع والخادم. قد يتضمن تقرير الخطأ معرّف حسابك ورقمك الجامعي لنتمكن من إصلاح
            مشكلة واجهتك.
          </li>
          <li>
            <strong>في الموقع فقط:</strong> إحصاءات الزيارات عبر Google Analytics (يستخدم ملفات تعريف الارتباط) وPlausible.
            لا يحتوي التطبيق على أدوات إحصاء أو إعلانات أو تتبّع.
          </li>
          <li>
            <strong>على جهازك:</strong> يحفظ التطبيق جلسة دخولك في التخزين الآمن في iPhone، وإعداداتك مثل اللغة والمظهر.
            تُمحى الجلسة عند تسجيل الخروج، وتُمحى الإعدادات بحذف التطبيق.
          </li>
        </LegalList>
        <p>
          <strong>كيف نحصل عليها:</strong> منك مباشرة حين تنشئ حسابك وتكمل ملفك وتسجّل في الفعاليات؛ ومن Google أو Apple
          حين تختار الدخول بأحدهما (الاسم والبريد)؛ ومن منظمي النادي حين يسجّلون حضورك أو نقاطك؛ وتلقائيًا من جهازك أو
          متصفحك (البيانات التقنية ورمز الإشعارات).
        </p>
      </LegalSection>

      <LegalSection id="use" title="لماذا نستخدمها">
        <LegalList>
          <li>إنشاء حسابك وتسجيل دخولك وحمايته.</li>
          <li>تنظيم الفعاليات: التسجيل والقبول وتسجيل الحضور واحتساب النقاط وإصدار الشهادات.</li>
          <li>التحقق من الأهلية للأنشطة المخصصة لطلاب الجامعة.</li>
          <li>عرض لوحة الصدارة وصفحتك العامة وبطاقة عضويتك.</li>
          <li>
            مراسلتك بالبريد بشأن تسجيلاتك وحسابك، وإرسال إشعارات التطبيق التي سمحت بها فقط (تذكير الفعاليات، والقبول،
            والنقاط الجديدة، وأخبار النادي).
          </li>
          <li>منع إساءة الاستخدام مثل الحضور الوهمي، وإصلاح الأخطاء، وتحسين خدماتنا.</li>
          <li>إحصاءات عامة عن نشاط النادي لا تُظهر أسماء.</li>
        </LegalList>
        <p>لا نبيع بياناتك، ولا نستخدمها للإعلانات، ولا نشاركها مع معلنين.</p>
      </LegalSection>

      <LegalSection id="public" title="ما الذي يراه الآخرون">
        <LegalList>
          <li>
            في لوحة الصدارة وصفحة العضو: اسمك الظاهر للآخرين، ونقاطك، وترتيبك، وسجل نقاطك (الأنشطة التي نلت عليها نقاطًا).
          </li>
          <li>
            في بطاقتك العامة، لمن لديه رابطها أو رمزها: اسم البطاقة وتصميمها، ومعلوماتك الدراسية ونبذتك وروابطك ما لم
            تخفها، وبريدك أو جوالك فقط إذا اخترت إظهارهما (مخفيان في الأصل).
          </li>
          <li>منظمو النادي المخوّلون يرون بيانات التسجيل والحضور التي تلزمهم لإدارة الفعاليات، كلٌّ حسب دوره.</li>
          <li>لا يظهر رقمك الجامعي للعامة أبدًا.</li>
        </LegalList>
      </LegalSection>

      <LegalSection id="providers" title="مقدمو الخدمات">
        <p>نستعين بمقدمي الخدمات التالية، ونشارك مع كل واحد منهم ما يلزمه لأداء خدمته فقط:</p>
        <LegalList>
          <li>
            <strong>Clerk:</strong> تسجيل الدخول وإدارة الحسابات وإرسال رموز التحقق.
          </li>
          <li>
            <strong>Apple:</strong> تسجيل الدخول عبر Apple، وإيصال إشعارات التطبيق، وبطاقات Apple Wallet.
          </li>
          <li>
            <strong>Google:</strong> تسجيل الدخول بحساب Google، ونماذج Google لبعض التسجيلات، وبطاقات Google Wallet،
            وGoogle Analytics في الموقع.
          </li>
          <li>
            <strong>Amazon Web Services:</strong> إرسال البريد الإلكتروني.
          </li>
          <li>
            <strong>Cloudflare:</strong> تخزين الصور والملفات.
          </li>
          <li>
            <strong>Sentry:</strong> تقارير الأخطاء.
          </li>
          <li>مزوّد الخادم الذي يستضيف موقعنا وقاعدة بياناتنا، وخادم يديره مطورو النادي لإحصاءات Plausible.</li>
        </LegalList>
        <p>وقد نفصح عن بيانات إذا طلبتها جهة رسمية مختصة وفق الأنظمة المعمول بها.</p>
      </LegalSection>

      <LegalSection id="where" title="أين تُحفظ بياناتك">
        <p>
          تُحفظ بياناتك في قاعدة بيانات النادي على خادمه، ولدى مقدمي الخدمات المذكورين أعلاه. يعالج عدد منهم البيانات
          خارج المملكة العربية السعودية (ومنها الولايات المتحدة)، وذلك لتقديم الخدمات الموضحة هنا فقط.
        </p>
      </LegalSection>

      <LegalSection id="retention" title="مدة الاحتفاظ والحذف">
        <LegalList>
          <li>بيانات حسابك ونشاطك: ما دام حسابك قائمًا.</li>
          <li>
            رمز الإشعارات: حتى تسجّل الخروج أو تحذف حسابك أو يبلغنا iPhone أنه لم يعد صالحًا، ونحذف الجهاز الذي لم يُفتح
            فيه التطبيق 180 يومًا.
          </li>
          <li>سجل الإشعارات المرسلة: 90 يومًا.</li>
          <li>سجلات الخادم وتقارير الأخطاء: مدة محدودة تلزم لإصلاح الأخطاء وحماية الخدمة.</li>
        </LegalList>
        <p>
          <strong>عند حذف حسابك</strong> نحذف حساب الدخول، واسمك، وبريدك، ورقم جوالك، ورقمك الجامعي، وكليتك ومستواك،
          وبطاقتك وصفحتك العامة، وإجاباتك على النماذج، وأجهزة الإشعارات. يبقى في سجل النادي سجل مجهول لا يحمل اسمك ولا
          وسيلة للتواصل معك، حتى تبقى مجاميع النقاط وأعداد الحضور السابقة صحيحة. وقد تبقى نسخ في النسخ الاحتياطية مدة
          محدودة قبل أن تُستبدل. أما بطاقات Apple Wallet أو Google Wallet المحفوظة في جهازك فتبقى فيه حتى تحذفها بنفسك.
        </p>
      </LegalSection>

      <LegalSection id="rights" title="حقوقك وخياراتك">
        <LegalList>
          <li>أن تعرف كيف نجمع بياناتك ولماذا: هذه الصفحة.</li>
          <li>
            أن تطّلع على بياناتك وتحصل على نسخة منها: معظمها ظاهر في صفحة حسابك في التطبيق والموقع، ولنسخة كاملة راسلنا.
          </li>
          <li>أن تصحّحها: عدّل ملفك من التطبيق أو الموقع، أو راسلنا لتصحيح ما لا يمكنك تعديله مثل الحضور أو النقاط.</li>
          <li>
            أن تطلب حذفها: احذف حسابك من التطبيق (حسابي ← الإعدادات ← حذف الحساب)، أو راسلنا. وإن كنت تدخل بحساب Apple
            فإن حذف الحساب من التطبيق يلغي ربط Apple أيضًا.
          </li>
          <li>
            أن تسحب موافقتك: أوقف الإشعارات من إعدادات التطبيق أو من إعدادات iPhone، وأخفِ ما تشاء من بطاقتك، أو احذف
            حسابك. ولمستخدمي Apple: يمكنك إيقاف استخدام Apple مع التطبيق من إعدادات iPhone (اسمك ← تسجيل الدخول والأمان
            ← تسجيل الدخول باستخدام Apple). سحب الموافقة لا يؤثر فيما تم قبله.
          </li>
        </LegalList>
        <p>
          لاستخدام أي من هذه الحقوق استعمل شاشات التطبيق، أو راسلنا على {email} من البريد المسجّل في حسابك. نرد خلال 30
          يومًا، وقد نطلب ما يثبت أن الحساب لك قبل أن ننفذ الطلب. إذا لم يرضك ردنا فيحق لك تقديم شكوى إلى الهيئة السعودية
          للبيانات والذكاء الاصطناعي (سدايا).
        </p>
      </LegalSection>

      <LegalSection id="security" title="حماية بياناتك">
        <p>
          يتصل الموقع والتطبيق بخادمنا عبر اتصال مشفّر (HTTPS)، ونقصر الوصول إلى بيانات الأعضاء على منظمي النادي
          المخوّلين حسب أدوارهم، ويحفظ التطبيق جلسة دخولك في التخزين الآمن في iPhone. لا يوجد نظام آمن تمامًا، وإذا وقع
          تسرّب يمس بياناتك فسنبلغك ونبلغ الجهة المختصة كما تقتضي الأنظمة.
        </p>
      </LegalSection>

      <LegalSection id="minors" title="الأعضاء دون 18 عامًا">
        <p>
          يمكن لطلاب المرحلة الثانوية المشاركة في أنشطة النادي، ونجمع منهم البيانات نفسها المذكورة أعلاه وللأغراض نفسها.
          إذا كان عمرك أقل من 18 عامًا فاقرأ هذه السياسة مع وليّ أمرك. ويمكن لوليّ الأمر أن يطلب الاطلاع على بيانات ابنه أو
          ابنته أو تصحيحها أو حذفها بمراسلتنا.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="التغييرات على هذه السياسة">
        <p>
          قد نحدّث هذه السياسة مع تطوّر خدماتنا، ونغيّر تاريخ «آخر تحديث» أعلى الصفحة. وإذا كان التغيير جوهريًا فسنعلنه
          في التطبيق أو الموقع قبل أن يسري.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="تواصل معنا">
        <p>
          للأسئلة عن بياناتك أو لتقديم طلب: {email}. وللمساعدة في استخدام الموقع أو التطبيق: صفحة{" "}
          <LegalLink href="/support">المساعدة والدعم</LegalLink>.
        </p>
      </LegalSection>
    </>
  )
}

export function PrivacyEnglish() {
  return (
    <>
      <LegalSection id="who" title="Who we are">
        <p>
          GDG Qassim (GDG on Campus Qassim University) is a student club at Qassim University run by student volunteers.
          This policy explains what data we collect through the club&apos;s website gdg-q.com, the members&apos; app
          &quot;GDG Qassim&quot; for iPhone, and the admin panel our organizers use; why we collect it; how we keep and
          protect it; and your rights over it.
        </p>
        <p>
          The club is an independent group. Its activities do not represent Google, and Google is not responsible for
          these services. To contact us about your data: {email}.
        </p>
      </LegalSection>

      <LegalSection id="collect" title="What we collect">
        <LegalList>
          <li>
            <strong>Account:</strong> your email address and name; your university ID if you sign in with your
            university email; and your Google or Apple account identifier if you sign in with one of them. If you choose
            to hide your email with Apple, we receive a relay address that Apple manages and that forwards our messages
            to you.
          </li>
          <li>
            <strong>Profile:</strong> your official name, the name others see, gender, study status, level, college,
            school or institution, personal email, and your phone number if you add it.
          </li>
          <li>
            <strong>Activity:</strong> your event registrations and registration form answers, whether you were
            accepted, your attendance check-ins, your points and your certificates.
          </li>
          <li>
            <strong>Membership card and public page:</strong> the card name, design and number, what you add to it
            (bio, major, links to your accounts) and what you choose to show.
          </li>
          <li>
            <strong>The app:</strong> the notification token your iPhone issues for the app if you allow notifications,
            the app version, its language, and your notification switches. The app uses the camera only to read the
            event&apos;s QR code while the scan screen is open: it takes and keeps no photos and sends us only the code
            it read. If you tap the paste button, the app reads the copied text once to fill in the check-in code.
          </li>
          <li>
            <strong>Technical data:</strong> logs of the requests that reach our server (such as the time, IP address,
            browser type or app version), and error reports from the website and the server. An error report may include
            your account ID and university ID so we can fix a problem that affected you.
          </li>
          <li>
            <strong>On the website only:</strong> visit statistics through Google Analytics (which uses cookies) and
            Plausible. The app has no analytics, advertising or tracking tools.
          </li>
          <li>
            <strong>On your phone:</strong> the app keeps your sign-in session in the iPhone&apos;s secure storage, and
            your settings such as language and theme. The session is erased when you sign out; the settings when you
            delete the app.
          </li>
        </LegalList>
        <p>
          <strong>How we get it:</strong> from you, when you create your account, complete your profile and register for
          events; from Google or Apple when you choose to sign in with them (name and email); from club organizers when
          they record your attendance or points; and automatically from your device or browser (technical data and the
          notification token).
        </p>
      </LegalSection>

      <LegalSection id="use" title="Why we use it">
        <LegalList>
          <li>To create your account, sign you in and keep it secure.</li>
          <li>To run events: registration, acceptance, attendance, points and certificates.</li>
          <li>To check eligibility for activities reserved for university students.</li>
          <li>To show the leaderboard, your public page and your membership card.</li>
          <li>
            To email you about your registrations and your account, and to send only the app notifications you allowed
            (event reminders, acceptance, new points and club news).
          </li>
          <li>To prevent abuse such as false check-ins, fix errors and improve our services.</li>
          <li>For overall statistics about the club&apos;s activity that show no names.</li>
        </LegalList>
        <p>We do not sell your data, use it for advertising, or share it with advertisers.</p>
      </LegalSection>

      <LegalSection id="public" title="What others can see">
        <LegalList>
          <li>
            On the leaderboard and member pages: the name others see, your points, your rank and your points history
            (the activities you earned points for).
          </li>
          <li>
            On your public card, to anyone with its link or code: the card name and design; your study details, bio and
            links unless you hide them; and your email or phone only if you choose to show them (both are hidden by
            default).
          </li>
          <li>
            Authorized club organizers see the registration and attendance data they need to run events, each according
            to their role.
          </li>
          <li>Your university ID is never shown publicly.</li>
        </LegalList>
      </LegalSection>

      <LegalSection id="providers" title="Service providers">
        <p>We rely on the following providers, and share with each only what it needs to provide its service:</p>
        <LegalList>
          <li>
            <strong>Clerk:</strong> sign-in, account management and verification codes.
          </li>
          <li>
            <strong>Apple:</strong> Sign in with Apple, delivering app notifications, and Apple Wallet passes.
          </li>
          <li>
            <strong>Google:</strong> Google sign-in, Google Forms for some registrations, Google Wallet passes, and Google
            Analytics on the website.
          </li>
          <li>
            <strong>Amazon Web Services:</strong> sending email.
          </li>
          <li>
            <strong>Cloudflare:</strong> storing images and files.
          </li>
          <li>
            <strong>Sentry:</strong> error reports.
          </li>
          <li>
            The host of our server, which runs the website and the database, and a server run by the club&apos;s
            developers for Plausible statistics.
          </li>
        </LegalList>
        <p>We may also disclose data when a competent authority requests it under the applicable regulations.</p>
      </LegalSection>

      <LegalSection id="where" title="Where your data is kept">
        <p>
          Your data is kept in the club&apos;s database on its server and with the providers above. Several of them
          process data outside the Kingdom of Saudi Arabia (including in the United States), only to provide the services
          described here.
        </p>
      </LegalSection>

      <LegalSection id="retention" title="How long we keep it, and deletion">
        <LegalList>
          <li>Your account and activity data: as long as your account exists.</li>
          <li>
            The notification token: until you sign out, delete your account, or your iPhone tells us it is no longer
            valid. A phone that has not opened the app for 180 days is removed.
          </li>
          <li>The log of notifications sent: 90 days.</li>
          <li>Server logs and error reports: a limited time, as needed to fix errors and protect the service.</li>
        </LegalList>
        <p>
          <strong>When you delete your account</strong> we delete your sign-in account, name, email, phone number,
          university ID, college and level, your card and public page, your form answers and your notification devices.
          An anonymous record with no name and no way to contact you stays in the club&apos;s records so that past points
          totals and attendance counts stay correct. Copies may remain in backups for a limited time until they are
          replaced. Apple Wallet or Google Wallet passes saved on your phone stay there until you remove them.
        </p>
      </LegalSection>

      <LegalSection id="rights" title="Your rights and choices">
        <LegalList>
          <li>To know how and why we collect your data: this page.</li>
          <li>
            To see your data and get a copy: most of it is on your account page in the app and on the website; email us
            for a full copy.
          </li>
          <li>
            To correct it: edit your profile in the app or on the website, or email us to correct what you cannot edit,
            such as attendance or points.
          </li>
          <li>
            To have it deleted: delete your account in the app (Profile → Settings → Delete account), or email us. If you
            sign in with Apple, deleting your account in the app also removes the link with Apple.
          </li>
          <li>
            To withdraw your consent: turn notifications off in the app&apos;s settings or in iPhone Settings, hide what
            you want on your card, or delete your account. Apple users can also stop using Apple with the app in iPhone
            Settings (your name → Sign-In &amp; Security → Sign in with Apple). Withdrawing consent does not affect what
            was done before.
          </li>
        </LegalList>
        <p>
          To use any of these rights, use the app&apos;s screens or email us at {email} from the address on your account.
          We answer within 30 days and may ask you to show the account is yours before we act. If you are not satisfied
          with our answer, you may complain to the Saudi Data &amp; AI Authority (SDAIA).
        </p>
      </LegalSection>

      <LegalSection id="security" title="How we protect your data">
        <p>
          The website and the app reach our server over an encrypted connection (HTTPS); access to members&apos; data is
          limited to authorized club organizers according to their roles; and the app keeps your sign-in session in the
          iPhone&apos;s secure storage. No system is perfectly secure: if a breach affects your data, we will tell you and
          notify the competent authority as the regulations require.
        </p>
      </LegalSection>

      <LegalSection id="minors" title="Members under 18">
        <p>
          High-school students may take part in club activities. We collect the same data from them as described above,
          for the same purposes. If you are under 18, read this policy with your parent or guardian. A parent or guardian
          can ask us to see, correct or delete their child&apos;s data by emailing us.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="Changes to this policy">
        <p>
          We may update this policy as our services change, and we update the &quot;Last updated&quot; date at the top.
          If a change is significant, we will announce it in the app or on the website before it takes effect.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact us">
        <p>
          Questions about your data, or a request: {email}. For help using the website or the app, see{" "}
          <LegalLink href="/support">Help &amp; Support</LegalLink>.
        </p>
      </LegalSection>
    </>
  )
}
