export const searchMapByUrl = {
  "/dashboard": "product",
  "/products/wealthanalyzer/dashboard": "space",
  "/products/wealthanalyzer/space": "asset",
  "/products/debttrack/dashboard": "debt",
}

export function getSearchLabel(pathName: string) {
  // exact match
  if (searchMapByUrl[pathName as keyof typeof searchMapByUrl]) {
    return searchMapByUrl[pathName as keyof typeof searchMapByUrl]
  }

  // prefix match (handles dynamic ids like /products/wealthanalyzer/space/68a...)
  const entry = Object.entries(searchMapByUrl).find(([k]) =>
    pathName.startsWith(k)
  )
  return entry ? entry[1] : ""
}
