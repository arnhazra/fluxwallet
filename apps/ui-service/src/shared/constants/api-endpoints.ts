import { appName } from "./global-constants"

const apiHost =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : `https://api-${appName.toLowerCase()}.vercel.app`

export const endPoints = {
  activityTrends: `${apiHost}/activity/trends`,
  asset: `${apiHost}/asset`,
  getTotalWealth: `${apiHost}/valuation/wealth`,
  pairpilot: `${apiHost}/pairpilot`,
  institution: `${apiHost}/institution`,
  getSubscriptionPricing: `${apiHost}/subscription/pricing`,
  createCheckoutSession: `${apiHost}/subscription/checkout`,
  generateOTP: `${apiHost}/user/generateotp`,
  validateOTP: `${apiHost}/user/validateotp`,
  userDetails: `${apiHost}/user/userdetails`,
  activateTrial: `${apiHost}/user/activatetrial`,
  signOut: `${apiHost}/user/signout`,
  updateAttribute: `${apiHost}/user/attribute`,
}
