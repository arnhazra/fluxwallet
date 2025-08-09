"use client"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/shared/components/ui/card"
import { useRouter } from "nextjs-toploader/app"

export default function Error({ error }: { error?: Error }) {
  const router = useRouter()

  return (
    <div className="fixed inset-0 overflow-y-auto flex justify-center items-center">
      <Card className="mx-auto max-w-sm bg-background border-border text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Error</CardTitle>
          <CardDescription className="text-white break-all">
            {error?.message ?? "Seems like an error occured here, click retry"}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            size="lg"
            className="w-full bg-primary hover:bg-primary"
            onClick={(): void => router.push("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
