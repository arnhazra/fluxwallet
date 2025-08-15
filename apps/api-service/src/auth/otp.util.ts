import { createHmac, randomInt } from "crypto"
import { config } from "src/config"
const { OTP_HASHING_KEY } = config

function generateRandomOTP(): string {
  return randomInt(111111, 999999).toString()
}

export function generateOTP(email: string) {
  const otp = generateRandomOTP()
  const ttl = 5 * 60 * 1000
  const expires = Date.now() + ttl
  const data = `${email}.${otp}.${expires}`
  const hash = createHmac("sha256", OTP_HASHING_KEY).update(data).digest("hex")
  const fullHash = `${hash}.${expires}`
  return { fullHash, otp }
}

export function verifyOTP(email: string, hash: string, otp: string): boolean {
  let [hashValue, expires] = hash.split(".")
  let now = Date.now()
  if (now > parseInt(expires)) return false
  let data = `${email}.${otp}.${expires}`
  let newCalculatedHash = createHmac("sha256", OTP_HASHING_KEY)
    .update(data)
    .digest("hex")
  if (newCalculatedHash === hashValue) {
    return true
  }
  return false
}

export function generateOTPEmailSubject() {
  return `${config.APP_NAME} OTP`
}

export function generateOTPEmailBody(otp: string) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>${config.APP_NAME} OTP</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #ffffff;
        color: #000000;
      }

      .container {
        max-width: 600px;
        margin: auto;
        padding: 40px 20px;
        background-color: #f4f4f5;
        border-radius: 12px;
      }

      h1 {
        font-size: 1.8rem;
        color: #32cd32;
        margin-bottom: 10px;
        font-weight: 600;
        text-align: center;
      }

      p {
        font-size: 1rem;
        line-height: 1.6;
        margin: 12px 0;
        color: #000000;
      }

      .otp {
        font-size: 2rem;
        font-weight: 600;
        background-color: #32cd32;
        color: #18181b;
        padding: 12px 24px;
        border-radius: 8px;
        width: max-content;
        margin: 24px auto;
        letter-spacing: 0.25rem;
      }

      .footer {
        text-align: center;
        font-size: 0.85rem;
        color: #000000;
        margin-top: 40px;
        padding-top: 20px;
      }

      @media (max-width: 480px) {
        .otp {
          font-size: 1.6rem;
          padding: 10px 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>${config.APP_NAME}</h1>
      <p>Hello there,</p>
      <p>Use the key below as your <strong>${config.APP_NAME}</strong> OTP. Please do not share it with anyone.</p>
      <p>This OTP is valid for only 5 minutes.</p>
      <div class="otp">${otp}</div>
      <p>Warm regards,<br />The ${config.APP_NAME} Team</p>

      <div class="footer">
        <p>${config.APP_NAME}</p>
        <p>Worldwide</p>
      </div>
    </div>
  </body>
</html>
`
}
