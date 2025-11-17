export const searchMapByUrl = {
  "/dashboard": "product",
  "/products/wealthanalyzer/dashboard": "space",
  "/products/wealthanalyzer/space": "asset",
  "/products/debttrack/dashboard": "debt",
  "/products/discover": "news",
  "/products/expensetrack/dashboard": "expense",
}

export function getSearchLabel(pathName: string) {
  if (searchMapByUrl[pathName as keyof typeof searchMapByUrl]) {
    return searchMapByUrl[pathName as keyof typeof searchMapByUrl]
  }

  const entry = Object.entries(searchMapByUrl).find(([k]) =>
    pathName.startsWith(k)
  )
  return entry ? entry[1] : ""
}
