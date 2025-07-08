"use client"
import { Button } from "@/shared/components/ui/button"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import useQuery from "@/shared/hooks/use-query"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Filter, SortAsc } from "lucide-react"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { BaseModelCard } from "@/shared/components/modelcard"
import { BaseModel, FilterAndSortOptions } from "@/shared/types"
import { AppContext } from "@/context/appstate.provider"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import Show from "@/shared/components/show"
import ErrorPage from "@/app/error"

export interface FindModelRequestState {
  selectedFilter: string
  selectedSortOption: string
  offset: number
}

export default function Page() {
  return null
}
