import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Institution } from "@/shared/types"
import { Building, Plus } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/shared/lib/format-currency"
import { useAppContext } from "@/context/appstate.provider"
import IconContainer from "../icon-container"

export function InstitutionCard({ institution }: { institution: Institution }) {
  const [{ user }] = useAppContext()

  return (
    <Link href={`/institution/${institution._id}`}>
      <Card className="w-full max-w-sm bg-background border-none text-white hover:shadow-md hover:shadow-primary/20 duration-400">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold truncate text-white">
              {institution.institutionName}
            </CardTitle>
            <IconContainer>
              <Building className="h-4 w-4" />
            </IconContainer>
          </div>
          <Badge
            variant="default"
            className="w-fit bg-neutral-800 hover:bg-neutral-800 text-primary"
          >
            {institution.institutionType}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">
                Present Valuation
              </span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(
                  institution?.presentValuation ?? 0,
                  user.baseCurrency
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export function AddInstitutionCard() {
  return (
    <Link href="/create/institution">
      <Card className="w-full max-w-sm h-[147px] flex items-center justify-center hover:shadow-md hover:shadow-primary/20 duration-400 bg-background border-none text-white">
        <Plus className="w-20 h-20 text-primary" />
      </Card>
    </Link>
  )
}
