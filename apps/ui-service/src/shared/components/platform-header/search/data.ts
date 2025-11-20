export const searchMapByUrl = {
  "/dashboard": "app",
  "/apps/wealthanalyzer/space": "asset",
  "/apps/wealthanalyzer": "space",
  "/apps/debttrack": "debt",
  "/apps/discover": "news",
  "/apps/expensetrack": "expense",
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
