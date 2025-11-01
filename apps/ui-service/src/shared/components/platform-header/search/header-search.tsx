import { Search } from "lucide-react"
import { Input } from "@/shared/components/ui/input"
import { cn } from "@/shared/lib/tw-class-util"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useCallback } from "react"
import { useUserContext } from "@/context/user.provider"
import { searchMapByUrl, getSearchLabel } from "./data"
import Show from "../../show"

export default function HeaderSearch() {
  const pathName = usePathname()
  const [, dispatch] = useUserContext()

  useEffect(() => {
    dispatch("setSearchKeyword", "")
    return () => {}
  }, [pathName])

  const debounceRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = window.setTimeout(() => {
        dispatch("setSearchKeyword", v)
        debounceRef.current = null
      }, 300)
    },
    [dispatch]
  )

  return (
    <Show
      condition={Object.keys(searchMapByUrl).some((path) =>
        pathName.startsWith(path)
      )}
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 w-full max-w-[15rem] sm:max-w-sm md:max-w-md lg:max-w-lg -translate-x-1/2 -translate-y-1/2 px-2 sm:px-6">
        <div className="mx-auto w-full">
          <label htmlFor="header-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-neutral-400" />
            </div>
            <Input
              id="header-search"
              name="q"
              type="search"
              placeholder={`What ${getSearchLabel(pathName) ?? ""} can I help you find?`}
              aria-label="Search"
              className={cn(
                "w-full rounded-full bg-neutral-800 py-2 pl-9 pr-3 text-sm text-white placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:ring-neutral-900",
                "pointer-events-auto",
                "border-border"
              )}
              autoComplete="off"
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </Show>
  )
}
