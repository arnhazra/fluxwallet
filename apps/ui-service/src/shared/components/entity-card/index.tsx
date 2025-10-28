import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import {
  Article,
  Asset,
  Debt,
  Goal,
  Institution,
} from "@/shared/constants/types"
import {
  Banknote,
  Building,
  CreditCard,
  ExternalLink,
  Eye,
  GoalIcon,
  Newspaper,
  OctagonAlert,
  Plus,
} from "lucide-react"
import Link from "next/link"
import MaskText from "../mask"
import { formatCurrency } from "@/shared/lib/format-currency"
import { useUserContext } from "@/context/user.provider"
import Show from "../show"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import IconContainer from "../icon-container"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/shared/components/ui/button"
import { imageUrls } from "@/shared/constants/global-constants"
import Summarizer from "../entity-summarizer"
import { useEffect, useState } from "react"
import { formatDate } from "@/shared/lib/format-date"
import { EntityDetails } from "../entity-details"
import { useRouter } from "nextjs-toploader/app"

export enum EntityType {
  ASSET = "asset",
  INSTITUTION = "institution",
  DEBT = "debt",
  GOAL = "goal",
  NEWS = "news",
}

export type EntityMap = {
  [EntityType.ASSET]: Asset
  [EntityType.INSTITUTION]: Institution
  [EntityType.DEBT]: Debt
  [EntityType.GOAL]: Goal
  [EntityType.NEWS]: Article
}

const entityImageMap = {
  [EntityType.ASSET]: imageUrls.asset,
  [EntityType.INSTITUTION]: imageUrls.institution,
  [EntityType.DEBT]: imageUrls.debt,
  [EntityType.GOAL]: imageUrls.goal,
  [EntityType.NEWS]: imageUrls.newsFallback,
}

const entityIconMap = {
  [EntityType.ASSET]: <Banknote className="h-4 w-4" />,
  [EntityType.INSTITUTION]: <Building className="h-4 w-4" />,
  [EntityType.DEBT]: <CreditCard className="h-4 w-4" />,
  [EntityType.GOAL]: <GoalIcon className="h-4 w-4" />,
  [EntityType.NEWS]: <Newspaper className="h-4 w-4" />,
}

const createEntityUrlMap = {
  [EntityType.ASSET]: `/products/wealthanalyzer/create/asset`,
  [EntityType.DEBT]: `/products/debttrack/createdebt`,
  [EntityType.INSTITUTION]: `/products/wealthanalyzer/create/institution`,
  [EntityType.GOAL]: `/products/wealthgoal/creategoal`,
  [EntityType.NEWS]: `/products/finnews`,
}

type EntityCardProps<T extends keyof EntityMap> = {
  entityType: T
  entity: EntityMap[T]
}

export function EntityCard<T extends keyof EntityMap>({
  entityType,
  entity,
}: EntityCardProps<T>) {
  const [{ user }] = useUserContext()
  const router = useRouter()
  const [entityBadgeText, setEnytityBadgeText] = useState("")
  const [enityTitle, setEntityTitle] = useState("")
  const [entityDescription, setEntityDescription] = useState<string | null>(
    null
  )
  const [identifier, setIdentifier] = useState("")
  const [formattedDate, setFormattedDate] = useState("")
  const [valuation, setValuation] = useState<{
    valuationHeader: string
    valuationAmount: number | null | undefined
  }>({
    valuationHeader: "",
    valuationAmount: 0,
  })

  useEffect(() => {
    if (entityType === EntityType.NEWS) {
      const date = (entity as Article).publishedAt
        ? formatDistanceToNow(new Date((entity as Article).publishedAt ?? ""), {
            addSuffix: true,
          })
        : null
      setFormattedDate(date ?? "")
    } else {
      const date = formatDistanceToNow(new Date((entity as Asset).createdAt), {
        addSuffix: true,
      })
      setFormattedDate(date)
    }
  }, [entity])

  useEffect(() => {
    switch (entityType) {
      case EntityType.ASSET:
        setEnytityBadgeText((entity as Asset).assetType.replace("_", " "))
        setEntityTitle((entity as Asset).assetName)
        setIdentifier((entity as Asset).identifier)
        setValuation({
          valuationHeader: "Present Valuation",
          valuationAmount: (entity as Asset).presentValuation,
        })
        break
      case EntityType.INSTITUTION:
        setEnytityBadgeText((entity as Institution).institutionType)
        setEntityTitle((entity as Institution).institutionName)
        setIdentifier((entity as Institution)._id)
        setValuation({
          valuationHeader: "Present Valuation",
          valuationAmount: (entity as Institution).presentValuation,
        })
        break
      case EntityType.DEBT:
        setEnytityBadgeText("DEBT")
        setEntityTitle((entity as Debt).debtPurpose)
        setIdentifier((entity as Debt).identifier)
        setValuation({
          valuationHeader: "EMI",
          valuationAmount: (entity as Debt).emi,
        })
        break
      case EntityType.GOAL:
        setEnytityBadgeText("GOAL")
        setEntityTitle(formatDate((entity as Goal).goalDate))
        setIdentifier((entity as Goal)._id)
        setValuation({
          valuationHeader: "Goal",
          valuationAmount: (entity as Goal).goalAmount,
        })
        break
      case EntityType.NEWS:
        setEnytityBadgeText((entity as Article).source?.name || "NEWS")
        setEntityTitle((entity as Article).title ?? "")
        setEntityDescription((entity as Article).description || null)
        setIdentifier((entity as Goal)._id)
        setValuation({
          valuationHeader: "Goal",
          valuationAmount: (entity as Goal).goalAmount,
        })
        break
      default:
        break
    }
  }, [entityType, entity])

  return (
    <Card className="w-full max-w-xs mx-auto h-[22rem] flex flex-col relative hover:shadow-md transition-shadow bg-background border-border text-white">
      <div className="relative aspect-video overflow-hidden bg-muted rounded-t-3xl">
        <img
          src={entityImageMap[entityType]}
          alt={entityType}
          className="object-cover w-full h-full transition-transform duration-300 rounded-t-3xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-background/60" />
        <Badge className="absolute top-2 left-2 bg-primary/90 hover:bg-primary text-black">
          {entityBadgeText}
        </Badge>
        <div className="absolute top-2 right-2">
          <IconContainer>{entityIconMap[entityType]}</IconContainer>
        </div>
      </div>
      <CardHeader className="flex-grow">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold truncate text-white">
            {enityTitle}
          </CardTitle>
          <div className="flex items-center justify-between">
            <Show
              condition={
                (entityType === EntityType.ASSET &&
                  (entity as Asset).isMatured) ||
                (entityType === EntityType.DEBT && (entity as Debt).isMatured)
              }
            >
              <Tooltip>
                <TooltipTrigger>
                  <OctagonAlert className="h-4 w-4 text-secondary" />
                </TooltipTrigger>
                <TooltipContent className="bg-background text-white border-border">
                  This {entityType} is matured
                </TooltipContent>
              </Tooltip>
            </Show>
            <Show
              condition={
                (entityType === EntityType.ASSET &&
                  (entity as Asset).isMaturityApproaching) ||
                (entityType === EntityType.DEBT &&
                  (entity as Debt).isMaturityApproaching)
              }
            >
              <Tooltip>
                <TooltipTrigger>
                  <OctagonAlert className="h-4 w-4 text-amber-400" />
                </TooltipTrigger>
                <TooltipContent className="bg-background text-white border-border">
                  This {entityType} is about to mature
                </TooltipContent>
              </Tooltip>
            </Show>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Show condition={!!entityDescription}>
          <p className="text-sm line-clamp-3 mt-2 text-neutral-300">
            {entityDescription || "No description available"}
          </p>
        </Show>
        <Show condition={!entityDescription}>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-300">Identifier</span>
              <span className="text-sm font-medium">
                <MaskText value={identifier} />
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-300">
                {valuation.valuationHeader}
              </span>
              <span className="text-lg font-bold text-white">
                {formatCurrency(
                  valuation.valuationAmount ?? 0,
                  user.baseCurrency
                )}
              </span>
            </div>
          </div>
        </Show>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            {formattedDate && <span>{formattedDate}</span>}
          </div>
          <Show
            condition={entityType === EntityType.NEWS}
            fallback={
              <Summarizer
                entityType={entityType}
                entityId={(entity as Asset | Debt | Institution | Goal)._id}
              />
            }
          >
            <Summarizer
              key={(entity as Article).title}
              entityId={(entity as Article).url || "news-article"}
              entityType={EntityType.NEWS}
              newsTitle={(entity as Article).title}
              newsContent={(entity as Article).content}
              newsDescription={(entity as Article).description}
            />
          </Show>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Show condition={entityType === EntityType.NEWS}>
          {(entity as Article).url && (
            <Button
              variant="default"
              asChild
              className="w-full gap-2 bg-border hover:bg-border"
            >
              <Link
                href={(entity as Article).url ?? ""}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read full article
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </Show>
        <Show condition={entityType === EntityType.INSTITUTION}>
          <Button
            variant="default"
            className="w-full gap-2 bg-border hover:bg-border"
            onClick={(): void =>
              router.push(
                `/products/wealthanalyzer/institution/${(entity as Institution)._id}`
              )
            }
          >
            View Assets
            <Eye className="h-4 w-4" />
          </Button>
        </Show>
        <Show
          condition={
            entityType === EntityType.ASSET ||
            entityType === EntityType.DEBT ||
            entityType === EntityType.GOAL
          }
        >
          <EntityDetails entityType={entityType} entity={entity}>
            <Button
              variant="default"
              className="w-full gap-2 bg-border hover:bg-border"
            >
              View Details
              <Eye className="h-4 w-4" />
            </Button>
          </EntityDetails>
        </Show>
      </CardFooter>
    </Card>
  )
}

export function AddEntityCard({ entityType }: { entityType: EntityType }) {
  return (
    <Link href={createEntityUrlMap[entityType]}>
      <Card className="w-full max-w-sm h-[22rem] flex items-center justify-center bg-background border border-border text-white hover:shadow-md hover:shadow-primary/20 duration-400">
        <Plus className="w-20 h-20 text-primary" />
      </Card>
    </Link>
  )
}
