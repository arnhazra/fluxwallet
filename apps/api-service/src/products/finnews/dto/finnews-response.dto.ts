interface Article {
  source?: {
    id?: string | null
    name?: string | null
  } | null
  author?: string | null
  title?: string | null
  description?: string | null
  url?: string | null
  urlToImage?: string | null
  publishedAt?: Date | null
  content?: string | null
}

export class FinNewsResponseDto {
  status?: string | null
  totalResults?: number | null
  articles?: Article[] | null
}
