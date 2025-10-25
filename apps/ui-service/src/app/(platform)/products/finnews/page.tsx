"use client"
import { NewsCard } from "@/shared/components/articlecard"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import useQuery from "@/shared/hooks/use-query"
import { FindNewsResponse } from "@/shared/constants/types"
import { appName } from "@/shared/constants/global-constants"

export default function Page() {
  const news = useQuery<FindNewsResponse>({
    queryKey: ["finnews"],
    queryUrl: `${endPoints.finNews}`,
    method: HTTPMethods.GET,
  })

  const renderArticles = news?.data?.articles?.map((article, index) => {
    return <NewsCard article={article} key={index} />
  })

  return (
    <div className="mx-auto grid w-full items-start gap-6">
      <section className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4 pb-4">
        {renderArticles}
      </section>
    </div>
  )
}
