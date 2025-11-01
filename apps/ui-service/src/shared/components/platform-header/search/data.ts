export const searchMapByUrl = {
  "/dashboard": "Products",
  "/products/wealthanalyzer/dashboard": "Institutions",
  "/products/wealthanalyzer/institution": "Assets",
  "/products/debttrack/dashboard": "Debts",
}

export function getSearchLabel(pathName: string) {
  // exact match
  if (searchMapByUrl[pathName as keyof typeof searchMapByUrl]) {
    return searchMapByUrl[pathName as keyof typeof searchMapByUrl]
  }

  // prefix match (handles dynamic ids like /products/wealthanalyzer/institution/68a...)
  const entry = Object.entries(searchMapByUrl).find(([k]) =>
    pathName.startsWith(k)
  )
  return entry ? entry[1] : ""
}
