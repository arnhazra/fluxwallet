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
  Cashflow,
  Debt,
  Goal,
  Space,
} from "@/shared/constants/types"
import {
  Banknote,
  Building,
  CreditCard,
  ExternalLink,
  Eye,
  EyeIcon,
  GoalIcon,
  HistoryIcon,
  Newspaper,
  OctagonAlert,
  Plus,
  Workflow,
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
import { useEffect, useState } from "react"
import { formatDate } from "@/shared/lib/format-date"
import { EntityDetails } from "../entity-details"
import { useRouter } from "nextjs-toploader/app"
import { EntityTypeForDetailModal } from "../entity-details/data"
import {
  createEntityUrlMap,
  entityImageMap,
  EntityMap,
  EntityType,
} from "./data"
import EntitySummarizer from "../entity-summarizer"

const entityIconMap = {
  [EntityType.ASSET]: <Banknote className="h-4 w-4" />,
  [EntityType.SPACE]: <Building className="h-4 w-4" />,
  [EntityType.DEBT]: <CreditCard className="h-4 w-4" />,
  [EntityType.GOAL]: <GoalIcon className="h-4 w-4" />,
  [EntityType.NEWS]: <Newspaper className="h-4 w-4" />,
  [EntityType.CASHFLOW]: <Workflow className="h-4 w-4" />,
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
  const [articleImageError, setArticleImageError] = useState(false)
  const [enityTitle, setEntityTitle] = useState("")
  const [entityDescription, setEntityDescription] = useState<string | null>(
    null
  )
  const [identifier, setIdentifier] = useState("")
  const [subHeader, setSubHeader] = useState("")
  const [valuation, setValuation] = useState<{
    valuationHeader: string
    valuationAmount: number | null | undefined
  }>({
    valuationHeader: "",
    valuationAmount: 0,
  })

  const handleArticleImageError = () => {
    setArticleImageError(true)
  }

  useEffect(() => {
    switch (entityType) {
      case EntityType.SPACE:
        setEnytityBadgeText("SPACE")
        setEntityTitle((entity as Space).spaceName)
        setIdentifier((entity as Space)._id)
        setValuation({
          valuationHeader: "Present Valuation",
          valuationAmount: (entity as Space).presentValuation,
        })
        const spaceCreatedAt = (entity as Space).createdAt
          ? formatDistanceToNow(new Date((entity as Space).createdAt ?? ""), {
              addSuffix: true,
            })
          : null
        setSubHeader(spaceCreatedAt ?? "")
        break
      case EntityType.ASSET:
        setEnytityBadgeText((entity as Asset).assetType.replace("_", " "))
        setEntityTitle((entity as Asset).assetName)
        setIdentifier((entity as Asset).identifier)
        setValuation({
          valuationHeader: "Present Valuation",
          valuationAmount: (entity as Asset).presentValuation,
        })
        const assetCreatedAt = (entity as Asset).createdAt
          ? formatDistanceToNow(new Date((entity as Asset).createdAt ?? ""), {
              addSuffix: true,
            })
          : null
        setSubHeader(assetCreatedAt ?? "")
        break
      case EntityType.DEBT:
        setEnytityBadgeText("DEBT")
        setEntityTitle((entity as Debt).debtPurpose)
        setIdentifier((entity as Debt).identifier)
        setValuation({
          valuationHeader: "EMI",
          valuationAmount: (entity as Debt).emi,
        })
        const debtCreatedAt = (entity as Debt).createdAt
          ? formatDistanceToNow(new Date((entity as Debt).createdAt ?? ""), {
              addSuffix: true,
            })
          : null
        setSubHeader(debtCreatedAt ?? "")
        break
      case EntityType.GOAL:
        setEnytityBadgeText("GOAL")
        setEntityTitle(formatDate((entity as Goal).goalDate, false))
        setIdentifier((entity as Goal)._id)
        setValuation({
          valuationHeader: "Goal",
          valuationAmount: (entity as Goal).goalAmount,
        })
        const goalCreatedAt = (entity as Goal).createdAt
          ? formatDistanceToNow(new Date((entity as Goal).createdAt ?? ""), {
              addSuffix: true,
            })
          : null
        setSubHeader(goalCreatedAt ?? "")
        break
      case EntityType.CASHFLOW:
        setEnytityBadgeText("CASHFLOW")
        setEntityTitle((entity as Cashflow).description)
        setIdentifier((entity as Cashflow)._id)
        setValuation({
          valuationHeader: "Cashflow Amount",
          valuationAmount: (entity as Cashflow).amount,
        })
        const cashflowCreatedAt = (entity as Cashflow).createdAt
          ? formatDistanceToNow(
              new Date((entity as Cashflow).createdAt ?? ""),
              {
                addSuffix: true,
              }
            )
          : null
        setSubHeader(cashflowCreatedAt ?? "")
        break
      case EntityType.NEWS:
        setEnytityBadgeText((entity as Article).source?.name || "NEWS")
        setEntityTitle((entity as Article).title ?? "")
        setEntityDescription((entity as Article).description || null)
        const newsPublishedAt = (entity as Article).publishedAt
          ? formatDistanceToNow(
              new Date((entity as Article).publishedAt ?? ""),
              {
                addSuffix: true,
              }
            )
          : null
        setSubHeader(newsPublishedAt ?? "")
        break
      default:
        break
    }
  }, [entityType, entity])

  return (
    <Card className="w-full max-w-xs mx-auto h-[22rem] flex flex-col relative hover:shadow-md transition-shadow bg-background border-border text-white pt-0 overflow-hidden">
      <div className="relative aspect-video overflow-hidden bg-muted rounded-t-3xl">
        <Show condition={entityType === EntityType.NEWS}>
          <Show
            condition={!!(entity as Article).urlToImage && !articleImageError}
            fallback={
              <img
                src={entityImageMap[EntityType.NEWS]}
                alt="News image"
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105 rounded-t-3xl"
              />
            }
          >
            <img
              src={
                (entity as Article).urlToImage ??
                entityImageMap[EntityType.NEWS]
              }
              alt={(entity as Article).title || "News image"}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105 rounded-t-3xl"
              onError={handleArticleImageError}
            />
          </Show>
        </Show>
        <Show condition={!(entityType === EntityType.NEWS)}>
          <img
            src={entityImageMap[entityType]}
            alt={entityType}
            className="object-cover w-full h-full transition-transform duration-300 rounded-t-3xl"
          />
        </Show>
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
          <CardTitle className="text-xl font-semibold text-white truncate max-w-full">
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
        <Show condition={entityType === EntityType.NEWS}>
          <p className="text-sm line-clamp-3 mt-2 text-neutral-300">
            {entityDescription || "No description available"}
          </p>
        </Show>
        <Show condition={!(entityType === EntityType.NEWS)}>
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
            {subHeader && (
              <span className="flex gap-2">
                <HistoryIcon className="h-3 w-3 mt-1" />
                {subHeader}
              </span>
            )}
          </div>
          <EntitySummarizer
            entityDetails={JSON.stringify(entity)}
            entityType={entityType}
          />
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Show condition={entityType === EntityType.NEWS}>
          {(entity as Article).url && (
            <Button
              variant="default"
              asChild
              className="w-full gap-2 bg-border hover:bg-border bg-neutral-800 hover:bg-neutral-800/90"
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
        <Show condition={entityType === EntityType.SPACE}>
          <Button
            variant="default"
            className="w-full gap-2 bg-border hover:bg-border bg-neutral-800 hover:bg-neutral-800/90"
            onClick={(): void =>
              router.push(`/apps/wealthanalyzer/space/${(entity as Space)._id}`)
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
            entityType === EntityType.GOAL ||
            entityType === EntityType.CASHFLOW
          }
        >
          <EntityDetails
            entityType={entityType as unknown as EntityTypeForDetailModal}
            entity={entity as unknown as Asset | Debt | Goal | Cashflow}
          >
            <Button
              variant="default"
              className="w-full gap-2 bg-border hover:bg-border bg-neutral-800 hover:bg-neutral-800/90"
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
      <Card className="w-full max-w-xs mx-auto h-[22rem] flex flex-row items-center justify-center gap-1 bg-background border border-border text-white hover:shadow-md hover:shadow-primary/20 duration-400">
        <IconContainer>
          <Plus className="w-4 h-4" />
        </IconContainer>
        <p className="ms-2 text-lg font-medium capitalize">Add {entityType}</p>
      </Card>
    </Link>
  )
}
