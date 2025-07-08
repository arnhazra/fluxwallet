"use client"
import type React from "react"
import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import {
  DollarSign,
  TrendingUp,
  CalendarIcon,
  Building,
  Coins,
} from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover"
import { Calendar } from "@/shared/components/ui/calendar"
import { format, set } from "date-fns"
import { cn } from "@/shared/lib/utils"
import ky from "ky"
import { FETCH_TIMEOUT } from "@/shared/lib/fetch-timeout"
import { AssetType, Portfolio, RecurringFrequency } from "@/shared/types"
import useQuery from "@/shared/hooks/use-query"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"

interface AssetFormData {
  portfolioId: string
  assetType: AssetType | ""
  assetName: string
  identifier: string
  startDate?: Date
  maturityDate?: Date
  amountInvested?: number
  expectedReturnRate?: number
  contributionAmount?: number
  contributionFrequency?: RecurringFrequency
  valuationOnPurchase?: number
  currentValuation?: number
  units?: number
  unitPurchasePrice?: number
}

const assetTypeLabels = {
  [AssetType.FD]: "Fixed Deposit",
  [AssetType.RD]: "Recurring Deposit",
  [AssetType.MUTUAL_FUND]: "Mutual Fund",
  [AssetType.SIP]: "SIP",
  [AssetType.LUMPSUM]: "Lumpsum Investment",
  [AssetType.METAL]: "Metals",
  [AssetType.PROPERTY]: "Property",
  [AssetType.BOND]: "Bonds",
  [AssetType.EPF]: "Employee Provident Fund",
  [AssetType.PPF]: "Public Provident Fund",
  [AssetType.CASH]: "Cash",
  [AssetType.EQUITY]: "Equity",
  [AssetType.CRYPTO]: "Crypto",
  [AssetType.OTHER]: "Other Assets",
}

const frequencyLabels = {
  [RecurringFrequency.MONTHLY]: "Monthly",
  [RecurringFrequency.QUARTERLY]: "Quarterly",
  [RecurringFrequency.HALF_YEARLY]: "Half Yearly",
  [RecurringFrequency.YEARLY]: "Yearly",
}

export default function AssetForm() {
  const [formData, setFormData] = useState<AssetFormData>({
    portfolioId: "",
    assetType: "",
    assetName: "",
    identifier: "",
  })
  const [message, setMessage] = useState<string>("")

  const portfolios = useQuery<Portfolio[]>({
    queryKey: ["get-portfolios-build-asset"],
    queryUrl: endPoints.portfolio,
    method: HTTPMethods.GET,
  })

  const handleInputChange = (field: keyof AssetFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault()
      await ky.post("http://localhost:8000/asset", {
        timeout: FETCH_TIMEOUT,
        json: formData,
      })
      setMessage("Asset added successfully!")
    } catch (error) {
      setMessage("Failed to add asset. Please try again.")
    }
  }

  // Field visibility logic based on asset type
  const showDateFields =
    formData.assetType &&
    [
      AssetType.FD,
      AssetType.RD,
      AssetType.MUTUAL_FUND,
      AssetType.SIP,
      AssetType.LUMPSUM,
    ].includes(formData.assetType as AssetType)

  const showAmountInvested =
    formData.assetType &&
    [AssetType.FD, AssetType.MUTUAL_FUND, AssetType.LUMPSUM].includes(
      formData.assetType as AssetType
    )

  const showExpectedReturn =
    formData.assetType &&
    [
      AssetType.FD,
      AssetType.RD,
      AssetType.MUTUAL_FUND,
      AssetType.SIP,
      AssetType.LUMPSUM,
    ].includes(formData.assetType as AssetType)

  const showRecurringFields =
    formData.assetType &&
    [AssetType.RD, AssetType.SIP].includes(formData.assetType as AssetType)

  const showValuationOnPurchase =
    formData.assetType &&
    [
      AssetType.PROPERTY,
      AssetType.BOND,
      AssetType.METAL,
      AssetType.OTHER,
    ].includes(formData.assetType as AssetType)

  const showCurrentValuation =
    formData.assetType &&
    [AssetType.EPF, AssetType.PPF, AssetType.CASH].includes(
      formData.assetType as AssetType
    )

  const showEquityFields =
    formData.assetType &&
    [AssetType.EQUITY, AssetType.CRYPTO].includes(
      formData.assetType as AssetType
    )

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6" />
            Add New Asset
          </CardTitle>
          <CardDescription>
            Fill in the details for your new asset. Fields will appear based on
            the asset type you select.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Common Fields */}

            <div className="space-y-2">
              <Label htmlFor="assetType">Select Portfolio</Label>
              <Select
                value={formData.portfolioId}
                onValueChange={(value) =>
                  handleInputChange("portfolioId", value)
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Portfolio" />
                </SelectTrigger>
                <SelectContent>
                  {portfolios.data?.map((portfolio) => (
                    <SelectItem key={portfolio._id} value={portfolio._id}>
                      {portfolio.portfolioName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assetType">Asset Type</Label>
              <Select
                value={formData.assetType}
                onValueChange={(value) => handleInputChange("assetType", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(assetTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex items-center gap-2">{label}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assetName">Asset Name</Label>
                <Input
                  id="assetName"
                  value={formData.assetName}
                  onChange={(e) =>
                    handleInputChange("assetName", e.target.value)
                  }
                  placeholder="Enter asset name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="identifier">Identifier</Label>
                <Input
                  id="identifier"
                  value={formData.identifier}
                  onChange={(e) =>
                    handleInputChange("identifier", e.target.value)
                  }
                  placeholder="Enter unique identifier"
                  required
                />
              </div>
            </div>

            {/* Conditional Fields */}
            {showDateFields && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Date Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate
                            ? format(formData.startDate, "PPP")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.startDate}
                          captionLayout="dropdown"
                          startMonth={new Date(2000, 0)}
                          endMonth={new Date()}
                          disabled={(date) => date > new Date()}
                          onSelect={(date) =>
                            handleInputChange("startDate", date)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Maturity Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.maturityDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.maturityDate
                            ? format(formData.maturityDate, "PPP")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.maturityDate}
                          captionLayout={
                            formData.startDate ? "dropdown" : "label"
                          }
                          startMonth={new Date(formData.startDate ?? 2000)}
                          endMonth={new Date(2100, 0)}
                          disabled={(date) =>
                            formData.startDate
                              ? date < formData.startDate
                              : false
                          }
                          onSelect={(date) =>
                            handleInputChange("maturityDate", date)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            )}

            {(showAmountInvested || showExpectedReturn) && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Investment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {showAmountInvested && (
                    <div className="space-y-2">
                      <Label htmlFor="amountInvested">Amount Invested</Label>
                      <Input
                        id="amountInvested"
                        type="number"
                        step="0.01"
                        value={formData.amountInvested || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "amountInvested",
                            Number.parseFloat(e.target.value)
                          )
                        }
                        placeholder="0.00"
                      />
                    </div>
                  )}
                  {showExpectedReturn && (
                    <div className="space-y-2">
                      <Label htmlFor="expectedReturnRate">
                        Expected Return Rate (%)
                      </Label>
                      <Input
                        id="expectedReturnRate"
                        type="number"
                        step="0.01"
                        value={formData.expectedReturnRate || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "expectedReturnRate",
                            Number.parseFloat(e.target.value)
                          )
                        }
                        placeholder="0.00"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {showRecurringFields && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Recurring Contribution
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contributionAmount">
                      Contribution Amount
                    </Label>
                    <Input
                      id="contributionAmount"
                      type="number"
                      step="0.01"
                      value={formData.contributionAmount || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "contributionAmount",
                          Number.parseFloat(e.target.value)
                        )
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contributionFrequency">
                      Contribution Frequency
                    </Label>
                    <Select
                      value={formData.contributionFrequency || ""}
                      onValueChange={(value) =>
                        handleInputChange("contributionFrequency", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(frequencyLabels).map(
                          ([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {showValuationOnPurchase && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Valuation</h3>
                <div className="space-y-2">
                  <Label htmlFor="valuationOnPurchase">
                    Valuation on Purchase
                  </Label>
                  <Input
                    id="valuationOnPurchase"
                    type="number"
                    step="0.01"
                    value={formData.valuationOnPurchase || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "valuationOnPurchase",
                        Number.parseFloat(e.target.value)
                      )
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>
            )}

            {showCurrentValuation && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Current Value</h3>
                <div className="space-y-2">
                  <Label htmlFor="currentValuation">Current Valuation</Label>
                  <Input
                    id="currentValuation"
                    type="number"
                    step="0.01"
                    value={formData.currentValuation || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "currentValuation",
                        Number.parseFloat(e.target.value)
                      )
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>
            )}

            {showEquityFields && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Equity Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="units">Number of Units</Label>
                    <Input
                      id="units"
                      type="number"
                      value={formData.units || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "units",
                          Number.parseInt(e.target.value)
                        )
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unitPurchasePrice">
                      Unit Purchase Price
                    </Label>
                    <Input
                      id="unitPurchasePrice"
                      type="number"
                      step="0.01"
                      value={formData.unitPurchasePrice || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "unitPurchasePrice",
                          Number.parseFloat(e.target.value)
                        )
                      }
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-6">
              <Button type="submit" className="flex-1">
                Add Asset
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </form>
          {message && (
            <div className="mt-4 text-sm text-green-600">{message}</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
