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
      expiresIn: "10m",
    })
  }

  if (tokenType === TokenType.RefreshToken) {
    return jwt.sign(tokenPayload, refreshTokenSecret, {
      algorithm: "HS512",
      expiresIn: "30d",
    })
  }
}

export function verifyToken(token: string, tokenType: TokenType) {
  if (tokenType === TokenType.AccessToken) {
    return jwt.verify(token, accessTokenSecret, {
      algorithms: ["HS512"],
    }) as any as TokenPayload
  }

  if (tokenType === TokenType.RefreshToken) {
    return jwt.verify(token, refreshTokenSecret, {
      algorithms: ["HS512"],
    }) as any as TokenPayload
  }
}
