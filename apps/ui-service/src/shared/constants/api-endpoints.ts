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
  // Core Service
  activityTrends: `${apiHost}/activity/trends`,
  getSubscriptionPricing: `${apiHost}/subscription/pricing`,
  createCheckoutSession: `${apiHost}/subscription/checkout`,
  getProductConfig: `${apiHost}/config/products`,
  getSolutionConfig: `${apiHost}/config/solutions`,
  // Products Service
  asset: `${apiHost}/asset`,
  getTotalWealth: `${apiHost}/valuation/wealth`,
  intelligence: `${apiHost}/intelligence`,
  advisorX: `${apiHost}/advisorx`,
  institution: `${apiHost}/institution`,
}
