const apiHost = process.env.NEXT_PUBLIC_API_URL!

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
  subscribe: `${apiHost}/subscription/subscribe`,
  getProductConfig: `${apiHost}/config/product-config`,
  getSolutionConfig: `${apiHost}/config/solution-config`,
  getSubscriptionConfig: `${apiHost}/config/subscription-config`,
  getModelConfig: `${apiHost}/config/model-config`,
  // Products Service
  institution: `${apiHost}/institution`,
  asset: `${apiHost}/asset`,
  debt: `${apiHost}/debt`,
  goal: `${apiHost}/goal`,
  intelligence: `${apiHost}/intelligence`,
  taxAdvisor: `${apiHost}/taxadvisor`,
  finNews: `${apiHost}/finnews`,
}
