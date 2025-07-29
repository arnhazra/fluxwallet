"use client"
import { ReactNode, createContext, useContext, useReducer } from "react"
import { AppState, Actions, ActionsMap, AppReducer } from "./appstate.reducer"
import { Currency } from "@/shared/types"

export type Dispatcher = <Type extends keyof ActionsMap>(
  type: Type,
  payload: ActionsMap[Type]
) => void

type AppContextInterface = readonly [AppState, Dispatcher]

const initialState: AppState = {
  user: {
    _id: "",
    activityLog: true,
    createdAt: "",
    email: "",
    name: "",
    baseCurrency: Currency.USD,
    portfolioGoal: null,
    reduceCarbonEmissions: true,
    role: "",
    currentLiabilities: 0,
  },
  subscription: null,
  isSubscriptionActive: false,
}

const AppContext = createContext<AppContextInterface>([
  initialState,
  (): void => undefined,
])

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, _dispatch] = useReducer(AppReducer, initialState)
  const dispatch: Dispatcher = (type, ...payload) => {
    _dispatch({ type, payload: payload[0] } as Actions)
  }
  const values: AppContextInterface = [state, dispatch]
  return <AppContext.Provider value={values}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error("useAppContext must be used within a AppProvider")
  }

  return context
}
