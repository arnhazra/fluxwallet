"use client"
import ky from "ky"
import {
  useSuspenseQuery,
  useQuery as useReactQuery,
} from "@tanstack/react-query"
import HTTPMethods from "@/shared/constants/http-methods"
import { FETCH_TIMEOUT } from "@/shared/lib/fetch-timeout"
import { useAppContext } from "@/context/appstate.provider"

interface QueryType<T> {
  queryKey: string[]
  queryUrl: string
  method: HTTPMethods
  requestBody?: object
  suspense?: boolean
  enabled?: boolean
  staleTime?: number
}

export default function useQuery<T>({
  queryKey,
  queryUrl,
  method,
  requestBody,
  suspense = true,
  enabled = true,
  staleTime,
}: QueryType<T>) {
  const [{ user }] = useAppContext()

  const queryFn = async () => {
    const data: any = await ky(queryUrl, {
      method,
      json: requestBody,
      timeout: FETCH_TIMEOUT,
    }).json()
    return data
  }

  if (suspense) {
    return useSuspenseQuery<T, Error>({
      queryKey,
      queryFn,
      refetchOnWindowFocus: !user.reduceCarbonEmissions,
      refetchInterval: user.reduceCarbonEmissions ? 0 : 30000,
    })
  }

  return useReactQuery<T, Error>({
    queryKey,
    queryFn,
    refetchOnWindowFocus: !user.reduceCarbonEmissions,
    refetchInterval: user.reduceCarbonEmissions ? 0 : 30000,
    enabled,
  })
}
