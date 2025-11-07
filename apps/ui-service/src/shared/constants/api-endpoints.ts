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
  createCheckoutSession: `${apiHost}/subscription/checkout`,
  subscribe: `${apiHost}/subscription/subscribe`,
  getProductConfig: `${apiHost}/config/product-config`,
  getSolutionConfig: `${apiHost}/config/solution-config`,
  getSubscriptionConfig: `${apiHost}/config/subscription-config`,
  intelligence: `${apiHost}/intelligence`,
  // Products Service
  space: `${apiHost}/space`,
  asset: `${apiHost}/asset`,
  debt: `${apiHost}/debt`,
  goal: `${apiHost}/goal`,
  news: `${apiHost}/news`,
}
