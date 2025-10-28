"use client"
import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ExternalLink } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Article } from "@/shared/constants/types"
import { imageUrls } from "@/shared/constants/global-constants"
import Summarizer from "../entity-summarizer"
import { EntityType } from "../entity-card"

export function NewsCard({ article }: { article: Article }) {
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  const formattedDate = article.publishedAt
    ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
    : null

  return (
    <Card className="w-full max-w-xs mx-auto h-[22rem] flex flex-col relative hover:shadow-md transition-shadow bg-background border-border text-white">
      <div className="relative aspect-video overflow-hidden bg-muted rounded-t-3xl">
        {article.urlToImage && !imageError ? (
          <img
            src={article.urlToImage}
            alt={article.title || "News image"}
            className="object-cover w-full h-full transition-transform duration-300 rounded-t-3xl"
            onError={handleImageError}
          />
        ) : (
          <img
            src={imageUrls.newsFallback}
            alt={article.title || "News image"}
            className="object-cover w-full h-full transition-transform duration-300 rounded-t-3xl"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-background/60" />
        {article.source?.name && (
          <Badge className="absolute top-2 left-2 bg-primary/80 hover:bg-primary text-black">
            {article.source.name}
          </Badge>
        )}
      </div>
      <CardHeader className="flex-grow">
        <CardTitle className="line-clamp-2 text-xl">
          {article.title || "Untitled"}
        </CardTitle>
        <CardDescription className="line-clamp-3 mt-2 text-neutral-300">
          {article.description || "No description available"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          {formattedDate && <span>{formattedDate}</span>}
        </div>
        <Summarizer
          key={article.title}
          entityId={article.url || "news-article"}
          entityType={EntityType.NEWS}
          newsTitle={article.title}
          newsContent={article.content}
          newsDescription={article.description}
        />
      </CardContent>
      <CardFooter className="pt-0">
        {article.url && (
          <Button
            variant="default"
            asChild
            className="w-full gap-2 bg-border hover:bg-border"
          >
            <Link href={article.url} target="_blank" rel="noopener noreferrer">
              Read full article
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
