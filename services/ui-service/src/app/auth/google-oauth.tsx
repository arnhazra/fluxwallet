"use client"
import { Button } from "@/shared/components/ui/button"
import { endPoints } from "@/shared/constants/api-endpoints"
import notify from "@/shared/hooks/use-notify"
import { FETCH_TIMEOUT } from "@/shared/lib/fetch-timeout"
import { useGoogleLogin } from "@react-oauth/google"
import ky from "ky"
import Image from "next/image"

interface GoogleOAuthProps {
  handleSuccess: (userData: any) => void
}

export default function GoogleOAuth({ handleSuccess }: GoogleOAuthProps) {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const response = await ky.post(endPoints.googleOAuthLogin, {
        timeout: FETCH_TIMEOUT,
        json: { token: tokenResponse.access_token },
      })
      handleSuccess(await response.json())
    },
    onError: () => {
      notify("Login Failed", "error")
    },
  })

  return (
    <Button
      variant="secondary"
      className="w-full h-12 mt-2 border-border text-white bg-neutral-800 hover:bg-neutral-800 rounded-full"
      onClick={() => login()}
    >
      Continue with Google
      <Image src="/google-logo.ico" alt="Google" width={20} height={20} />
    </Button>
  )
}
