"use client"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import useQuery from "@/shared/hooks/use-query"
import { FindNewsResponse } from "@/shared/constants/types"
import { EntityCard } from "@/shared/components/entity-card"
import { EntityType } from "@/shared/components/entity-card/data"
import { useUserContext } from "@/context/user.provider"

export default function Page() {
  const [{ searchKeyword }] = useUserContext()
  const { data } = useQuery<FindNewsResponse>({
    queryKey: ["finance-news"],
    queryUrl: `${endPoints.financeNews}`,
    method: HTTPMethods.GET,
  })

  const renderArticles = () => {
    if (!data?.articles) return null

    const searchPattern = new RegExp(searchKeyword, "i")
    return data.articles
      .filter(
        (article) =>
          (article.author && searchPattern.test(article.author)) ||
          (article.content && searchPattern.test(article.content)) ||
          (article.description && searchPattern.test(article.description))
      )
      .map((article, index) => (
        <EntityCard entityType={EntityType.NEWS} entity={article} key={index} />
      ))
  }

  return (
    <div className="mx-auto grid w-full items-start gap-6">
      <section className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4 pb-4">
        {renderArticles()}
      </section>
    </div>
  )
}
