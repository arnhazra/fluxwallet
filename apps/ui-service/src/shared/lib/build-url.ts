export function buildQueryUrl(
  baseUrl: string,
  params: Record<string, string | undefined | null>
) {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value && value !== "" && value.trim() !== "") {
      searchParams.append(key, value)
    }
  })

  const queryString = searchParams.toString()
  console.log(queryString)
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}
