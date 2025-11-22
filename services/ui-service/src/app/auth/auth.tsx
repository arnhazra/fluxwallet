"use client"
import { platformName, uiConstants } from "@/shared/constants/global-constants"
import ky from "ky"
import { useState } from "react"
import Show from "@/shared/components/show"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import LoaderIcon from "@/shared/components/loader-icon"
import { FETCH_TIMEOUT } from "@/shared/lib/fetch-timeout"
import { endPoints } from "@/shared/constants/api-endpoints"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import MarketingHeader from "@/shared/components/marketing-header"
import notify from "@/shared/hooks/use-notify"
import GoogleOAuth from "./google-oauth"

interface AuthProviderProps {
  onAuthorized: (isAuthorized: boolean) => void
}

export default function AuthenticationPage({
  onAuthorized,
}: AuthProviderProps) {
  const [isAuthLoading, setAuthLoading] = useState<boolean>(false)
  const [authStep, setAuthStep] = useState(1)
  const [state, setState] = useState({ email: "", otp: "" })
  const [alert, setAlert] = useState("")
  const [newUser, setNewUser] = useState(false)
  const [name, setName] = useState("")

  const requestOTP = async (event: any) => {
    event.preventDefault()
    setAlert(uiConstants.authVerificationMessage)
    setAuthLoading(true)

    try {
      const response: any = await ky
        .post(endPoints.requestOTP, { json: state, timeout: FETCH_TIMEOUT })
        .json()
      setNewUser(response.newUser)
      setAuthStep(2)
    } catch (error) {
      notify(uiConstants.connectionErrorMessage, "error")
    } finally {
      setAuthLoading(false)
    }
  }

  const validateOTP = async (event: any) => {
    event.preventDefault()
    setAlert(uiConstants.authVerificationMessage)
    setAuthLoading(true)

    try {
      const response: any = await ky
        .post(endPoints.validateOTP, {
          json: { ...state, name },
          timeout: FETCH_TIMEOUT,
        })
        .json()
      localStorage.setItem("accessToken", response.accessToken)
      localStorage.setItem("refreshToken", response.refreshToken)
      onAuthorized(true)
    } catch (error: any) {
      notify(uiConstants.invalidOTP, "error")
      onAuthorized(false)
    } finally {
      setAuthLoading(false)
    }
  }

  const googleOAuthLogin = (userData: any) => {
    setAuthLoading(true)

    try {
      localStorage.setItem("accessToken", userData.accessToken)
      localStorage.setItem("refreshToken", userData.refreshToken)
      onAuthorized(true)
    } catch (error: any) {
      notify(uiConstants.invalidOTP, "error")
      onAuthorized(false)
    } finally {
      setAuthLoading(false)
    }
  }

  return (
    <>
      <MarketingHeader />
      <div className="fixed inset-0 overflow-y-auto flex justify-center items-center auth-landing">
        <Card className="mx-auto max-w-sm bg-background border-border text-white">
          <CardHeader>
            <CardTitle className="text-2xl">{platformName}</CardTitle>
            <CardDescription className="text-primary">
              <Show
                condition={authStep === 1}
                fallback="Enter the OTP we sent to your email"
              >
                Enter your email to get started
              </Show>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Show condition={authStep === 1}>
                <form onSubmit={requestOTP}>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      className="h-12 bg-background border-border text-white"
                      type="email"
                      placeholder="someone@example.com"
                      required
                      disabled={isAuthLoading}
                      onChange={(e) =>
                        setState({ ...state, email: e.target.value })
                      }
                      autoComplete={"off"}
                      minLength={4}
                      maxLength={40}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 mt-4 bg-primary hover:bg-primary text-black rounded-full"
                    disabled={isAuthLoading}
                  >
                    <Show
                      condition={!isAuthLoading}
                      fallback={
                        <>
                          <LoaderIcon inverse /> {alert}
                        </>
                      }
                    >
                      Continue with Email
                    </Show>
                  </Button>
                </form>
                <div className="relative text-center text-sm">
                  <div className="relative z-0 flex items-center">
                    <div className="flex-grow border-t border-border"></div>
                    <span className="bg-card text-muted-foreground px-2 z-10">
                      Or continue with
                    </span>
                    <div className="flex-grow border-t border-border"></div>
                  </div>
                </div>
                <GoogleOAuth handleSuccess={googleOAuthLogin} />
              </Show>
              <Show condition={authStep === 2}>
                <form onSubmit={validateOTP}>
                  <div className="grid gap-4">
                    <Show condition={newUser}>
                      <div className="grid gap-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          className="h-11 bg-background border-border text-white"
                          type="text"
                          placeholder="Your Name"
                          required
                          disabled={isAuthLoading}
                          onChange={(e) => setName(e.target.value)}
                          autoComplete={"off"}
                          maxLength={40}
                        />
                      </div>
                    </Show>
                    <div className="grid gap-2">
                      <Label htmlFor="otp">One Time Password</Label>
                      <Input
                        className="h-11 bg-background border-border text-white"
                        type="password"
                        placeholder="Enter OTP sent to your email"
                        required
                        disabled={isAuthLoading}
                        onChange={(e) =>
                          setState({ ...state, otp: e.target.value })
                        }
                        autoComplete="off"
                        minLength={6}
                        maxLength={6}
                      />
                    </div>
                    <Button
                      variant="default"
                      type="submit"
                      disabled={isAuthLoading}
                      className="w-full h-12 mt-2 bg-primary hover:bg-primary text-black rounded-full"
                    >
                      <Show
                        condition={!isAuthLoading}
                        fallback={
                          <>
                            <LoaderIcon inverse /> {alert}
                          </>
                        }
                      >
                        <Show condition={newUser} fallback="Login">
                          Create new account
                        </Show>
                      </Show>
                    </Button>
                  </div>
                </form>
              </Show>
            </div>
            <div className="mt-4 text-sm text-neutral-300">
              {uiConstants.privacyPolicyStatement}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
