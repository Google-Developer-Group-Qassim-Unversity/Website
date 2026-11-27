import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, TrendingUp, Users } from "lucide-react"
import { fetchMemberById } from "@/lib/api/api"
import { NotFoundError } from "@/lib/api/errors"
import { notFound } from "next/navigation"
import { getTranslation } from "@/lib/server-i18n"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { PointsHistoryList } from "@/components/points-history-list"
import type { Language } from "@/lib/translations"

export async function MemberDetailContent({ id, lang }: { id: string; lang: Language }) {
  const t = (key: string) => getTranslation(lang, key)

  let memberData
  try {
    memberData = await fetchMemberById(id)
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound()
    }
    throw error
  }

  return (
    <>
      <PageBreadcrumb
        className="mb-6"
        items={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.members"), href: "/members" },
          { label: memberData.member.member_name },
        ]}
      />
      {/* Header */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{memberData.member.member_name}</h1>
            <p className="text-gray-600 dark:text-gray-300">{t("memberDetail.detailedLog")}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Member Info */}
        <div className="lg:col-span-1">
          <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-600" />
                {t("memberDetail.memberProfile")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{memberData.member.member_name}</h2>
                <p className="text-gray-500">{t("memberDetail.member")}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{t("memberDetail.totalPoints")}</span>
                  <span className="font-bold text-blue-600 text-lg">{memberData.member.total_points ?? 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Points History */}
        <div className="lg:col-span-2">
          <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                {t("memberDetail.pointsHistory")}
              </CardTitle>
              <CardDescription>{t("memberDetail.detailedLog")}</CardDescription>
            </CardHeader>
            <CardContent>
              <PointsHistoryList
                history={memberData.history}
                events={memberData.events}
                lang={lang}
                emptyText={t("memberDetail.noHistory")}
                pointsLabel={t("memberDetail.points")}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
