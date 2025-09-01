import { appName } from "./global-constants"

const apiHost =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : `https://api-${appName.toLowerCase()}.vercel.app`

export const endPoints = {
  // Auth Service
  requestOTP: `${apiHost}/auth/requestotp`,
  validateOTP: `${apiHost}/auth/validateotp`,
  googleOAuthLogin: `${apiHost}/auth/googleoauth`,
  userDetails: `${apiHost}/auth/userdetails`,
  activateTrial: `${apiHost}/auth/activatetrial`,
  signOut: `${apiHost}/auth/signout`,
  updateAttribute: `${apiHost}/auth/attribute`,
  // Platform Service
  activityTrends: `${apiHost}/activity/trends`,
  createCheckoutSession: `${apiHost}/subscription/checkout`,
  getProductConfig: `${apiHost}/config/products`,
  getSolutionConfig: `${apiHost}/config/solutions`,
  getSubscriptionConfig: `${apiHost}/config/subscription`,
  // Products Service
  asset: `${apiHost}/asset`,
  debt: `${apiHost}/debt`,
  goal: `${apiHost}/goal`,
  intelligence: `${apiHost}/intelligence`,
  taxAdvisor: `${apiHost}/taxadvisor`,
  institution: `${apiHost}/institution`,
}
