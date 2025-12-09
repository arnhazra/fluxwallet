"use client"
import { Button } from "@/shared/components/ui/button"
import { endPoints } from "@/shared/constants/api-endpoints"
import notify from "@/shared/hooks/use-notify"
import api from "@/shared/lib/ky-api"
import { useGoogleLogin } from "@react-oauth/google"
import Image from "next/image"

interface GoogleOAuthProps {
  handleSuccess: (userData: any) => void
}

export default function GoogleOAuth({ handleSuccess }: GoogleOAuthProps) {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const response = await api.post(endPoints.googleOAuthLogin, {
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
