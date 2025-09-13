import { Subscription, User } from "@/shared/constants/types"

export type UserState = {
  user: User
  subscription: Subscription | null
}

export type ActionsMap = {
  setUser: Partial<User>
  setSubscription: Subscription | null
}

export type Actions = {
  [Key in keyof ActionsMap]: {
    type: Key
    payload: ActionsMap[Key]
  }
}[keyof ActionsMap]

export const UserReducer = (state: UserState, action: Actions): UserState => {
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

    default:
      return state
  }
}
