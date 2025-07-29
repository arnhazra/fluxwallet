import { Subscription, User } from "@/shared/types"

export type AppState = {
  user: User
  subscription: Subscription | null
  isSubscriptionActive: boolean
}

export type ActionsMap = {
  setUser: Partial<User>
  setSubscription: Subscription | null
  setSubscriptionActive: boolean
}

export type Actions = {
  [Key in keyof ActionsMap]: {
    type: Key
    payload: ActionsMap[Key]
  }
}[keyof ActionsMap]

export const AppReducer = (state: AppState, action: Actions): AppState => {
  switch (action.type) {
    case "setUser":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      }

    case "setSubscription":
      return {
        ...state,
        subscription: action.payload,
      }

    case "setSubscriptionActive":
      return {
        ...state,
        isSubscriptionActive: action.payload,
      }

    default:
      return state
  }
}
