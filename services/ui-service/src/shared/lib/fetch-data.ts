import ky from "ky"
import HTTPMethods from "../constants/http-methods"
import { FETCH_TIMEOUT } from "./fetch-timeout"

export async function fetchData(
  url: string,
  method: HTTPMethods,
  requestBody: any
) {
  return await ky(url, {
    method,
    json: requestBody,
    timeout: FETCH_TIMEOUT,
  }).json()
}
