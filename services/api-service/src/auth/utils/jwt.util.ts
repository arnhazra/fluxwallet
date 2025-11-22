import { config } from "@/config"
import * as jwt from "jsonwebtoken"

const accessTokenSecret = config.JWT_SECRET_ACCESS_TOKEN
const refreshTokenSecret = config.JWT_SECRET_REFRESH_TOKEN

interface TokenPayload {
  id: string
  email: string
  iss: string
}

export enum TokenType {
  AccessToken = "AccessToken",
  RefreshToken = "RefreshToken",
}

export function generateToken(
  tokenPayload: TokenPayload,
  tokenType: TokenType
) {
  if (tokenType === TokenType.AccessToken) {
    return jwt.sign(tokenPayload, accessTokenSecret, {
      algorithm: "HS512",
      expiresIn: "5m",
    })
  }

  if (tokenType === TokenType.RefreshToken) {
    return jwt.sign(tokenPayload, refreshTokenSecret, {
      algorithm: "HS512",
    })
  }
}

export function decodeAccessToken(accessToken: string) {
  const decodedAccessToken = jwt.decode(accessToken)
  return decodedAccessToken as any as TokenPayload
}

export function verifyAccessToken(accessToken: string) {
  const decodedAccessToken = jwt.verify(accessToken, accessTokenSecret, {
    algorithms: ["HS512"],
  })
  return decodedAccessToken as any as TokenPayload
}
