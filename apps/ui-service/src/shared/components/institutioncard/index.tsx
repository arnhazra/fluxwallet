import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Institution } from "@/shared/constants/types"
import { Building, Link2Icon, Plus } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/shared/lib/format-currency"
import { useUserContext } from "@/context/user.provider"
import IconContainer from "../icon-container"
import { formatDistanceToNow } from "date-fns"
import { imageUrls } from "@/shared/constants/global-constants"
import Summarizer from "../summarizer/asset-summarizer"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

export function AddInstitutionCard() {
  return (
    <Link href="/products/wealthanalyzer/create/institution">
      <Card className="w-full max-w-sm h-[22rem] flex items-center border border-border justify-center hover:shadow-md hover:shadow-primary/20 duration-400 bg-background text-white">
        <Plus className="w-20 h-20 text-primary" />
      </Card>
    </Link>
  )
}

export function InstitutionCard({ institution }: { institution: Institution }) {
  const [{ user }] = useUserContext()
  const router = useRouter()

  const formattedDate = institution.createdAt
    ? formatDistanceToNow(new Date(institution.createdAt), { addSuffix: true })
    : null

  return (
    <Card className="w-full max-w-xs mx-auto h-[22rem] flex flex-col relative hover:shadow-md transition-shadow bg-background border-border text-white">
      <div className="relative aspect-video overflow-hidden bg-muted rounded-t-3xl">
        <img
          src={imageUrls.institution}
          alt={institution.institutionName}
          className="object-cover w-full h-full transition-transform duration-300 rounded-t-3xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-background/60" />
        <Badge className="absolute top-2 left-2 bg-primary/90 hover:bg-primary text-black">
          {institution.institutionType}
        </Badge>
        <div className="absolute top-2 right-2">
          <IconContainer>
            <Building className="h-4 w-4" />
          </IconContainer>
        </div>
      </div>
      <CardHeader className="flex-grow">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold truncate text-white">
            {institution.institutionName}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-300">Present Valuation</span>
            <span className="text-lg font-bold text-white">
              {formatCurrency(
                institution?.presentValuation ?? 0,
                user.baseCurrency
              )}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              {formattedDate && <span>{formattedDate}</span>}
            </div>
            <Summarizer entityType="institution" entityId={institution._id} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          variant="default"
          className="w-full gap-2 bg-border hover:bg-border"
          onClick={(): void =>
            router.push(
              `/products/wealthanalyzer/institution/${institution._id}`
            )
          }
        >
          View Assets
          <Link2Icon className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
