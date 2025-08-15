import { appName } from "./global-constants"

const apiHost =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : `https://api-${appName.toLowerCase()}.vercel.app`

export const endPoints = {
  activityTrends: `${apiHost}/activity/trends`,
  asset: `${apiHost}/asset`,
  getTotalWealth: `${apiHost}/valuation/wealth`,
  intelligence: `${apiHost}/intelligence`,
  institution: `${apiHost}/institution`,
  getSubscriptionPricing: `${apiHost}/subscription/pricing`,
  createCheckoutSession: `${apiHost}/subscription/checkout`,
  requestOTP: `${apiHost}/auth/requestotp`,
  validateOTP: `${apiHost}/auth/validateotp`,
  googleOAuthLogin: `${apiHost}/auth/googleoauth`,
  userDetails: `${apiHost}/auth/userdetails`,
  activateTrial: `${apiHost}/auth/activatetrial`,
  signOut: `${apiHost}/auth/signout`,
  updateAttribute: `${apiHost}/auth/attribute`,
}
