"use client"
import { ReactNode, createContext, useContext, useReducer } from "react"
import { UserState, Actions, ActionsMap, UserReducer } from "./user.reducer"
import { Currency } from "@/shared/constants/types"

export type Dispatcher = <Type extends keyof ActionsMap>(
  type: Type,
  payload: ActionsMap[Type]
) => void

type UserContextInterface = readonly [UserState, Dispatcher]

const initialState: UserState = {
  user: {
    _id: "",
    activityLog: true,
    createdAt: "",
    email: "",
    name: "",
    baseCurrency: Currency.USD,
    reduceCarbonEmissions: true,
    role: "",
    hasTrial: false,
    avatar: null,
  },
  subscription: null,
}

const UserContext = createContext<UserContextInterface>([
  initialState,
  (): void => undefined,
])

export function UserStateProvider({ children }: { children: ReactNode }) {
  const [state, _dispatch] = useReducer(UserReducer, initialState)
  const dispatch: Dispatcher = (type, ...payload) => {
    _dispatch({ type, payload: payload[0] } as Actions)
  }
  const values: UserContextInterface = [state, dispatch]
  return <UserContext.Provider value={values}>{children}</UserContext.Provider>
}

export const useUserContext = () => {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error("useUserContext must be used within a UserStateProvider")
  }

  return context
}
