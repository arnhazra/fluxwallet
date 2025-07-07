import { config as envConfig } from "dotenv"
envConfig({ path: "./.env.development" })

export const config = {
  NODE_ENV: process.env.NODE_ENV,
  BRAND_NAME: process.env.BRAND_NAME,
  PRIMARY_DATABASE_URI: process.env.PRIMARY_DATABASE_URI,
  REPLICA_DATABASE_URI: process.env.REPLICA_DATABASE_URI,
  REDIS_URI: process.env.REDIS_URI,
  AZURE_API_KEY: process.env.AZURE_API_KEY,
  AZURE_DEPLOYMENT_URI: process.env.AZURE_DEPLOYMENT_URI,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  OTP_HASHING_KEY: process.env.OTP_HASHING_KEY,
  JWT_SECRET: process.env.JWT_SECRET,  
  SUBSCRIPTION_PRICE: process.env.SUBSCRIPTION_PRICE,
  GCLOUD_REDIRECT_URI: process.env.GCLOUD_REDIRECT_URI,
  GCLOUD_CLIENT_ID: process.env.GCLOUD_CLIENT_ID,
  GCLOUD_CLIENT_SECRET: process.env.GCLOUD_CLIENT_SECRET,
  GCLOUD_REFRESH_TOKEN: process.env.GCLOUD_REFRESH_TOKEN,
  MAILER_EMAIL: process.env.MAILER_EMAIL,
}
