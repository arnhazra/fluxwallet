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
import { TrendingUp, CalendarIcon, BadgeDollarSign } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover"
import { Calendar } from "@/shared/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/shared/lib/tw-class-util"
import ky from "ky"
import { FETCH_TIMEOUT } from "@/shared/lib/fetch-timeout"
import { AssetType, Institution, RecurringFrequency } from "@/shared/types"
import useQuery from "@/shared/hooks/use-query"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"

interface AssetFormData {
  institutionId: string
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
  [AssetType.SIP]: "SIP",
  [AssetType.LUMPSUM]: "Lumpsum Investment",
  [AssetType.METAL]: "Metals",
  [AssetType.PROPERTY]: "Property",
  [AssetType.BOND]: "Bonds",
  [AssetType.EPF]: "Employee Provident Fund",
  [AssetType.PPF]: "Public Provident Fund",
  [AssetType.CASH]: "Cash",
  [AssetType.SAVINGS]: "Savings Account",
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

type MessageType = "success" | "error"

export default function Page() {
  const [formData, setFormData] = useState<AssetFormData>({
    institutionId: "",
    assetType: "",
    assetName: "",
    identifier: "",
  })

  const [message, setMessage] = useState<{ msg: string; type: MessageType }>({
    msg: "",
    type: "success",
  })

  const institutions = useQuery<Institution[]>({
    queryKey: ["get-institutions-build-asset"],
    queryUrl: endPoints.institution,
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
      await ky.post(endPoints.asset, {
        timeout: FETCH_TIMEOUT,
        json: formData,
      })
      setMessage({ msg: "Asset added successfully!", type: "success" })
    } catch (error) {
      setMessage({
        msg: "Failed to add asset. Please try again.",
        type: "error",
      })
    }
  }

  const showDateFields =
    formData.assetType &&
    [AssetType.FD, AssetType.RD, AssetType.SIP, AssetType.LUMPSUM].includes(
      formData.assetType as AssetType
    )

  const showAmountInvested =
    formData.assetType &&
    [AssetType.FD, AssetType.LUMPSUM].includes(formData.assetType as AssetType)

  const showExpectedReturn =
    formData.assetType &&
    [AssetType.FD, AssetType.RD, AssetType.SIP, AssetType.LUMPSUM].includes(
      formData.assetType as AssetType
    )

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
    [
      AssetType.EPF,
      AssetType.PPF,
      AssetType.CASH,
      AssetType.SAVINGS,
      AssetType.PROPERTY,
      AssetType.BOND,
      AssetType.METAL,
      AssetType.OTHER,
    ].includes(formData.assetType as AssetType)

  const showEquityFields =
    formData.assetType &&
    [AssetType.EQUITY, AssetType.CRYPTO].includes(
      formData.assetType as AssetType
    )

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-background border-border">
          <CardHeader className="border-b border-neutral-800">
            <CardTitle className="flex items-center gap-2 text-neutral-100">
              <BadgeDollarSign className="h-6 w-6 text-primary" />
              Add New Asset
            </CardTitle>
            <CardDescription className="text-primary">
              Fill in the details for your new asset. Fields will appear based
              on the asset type you select.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="assetType" className="text-neutral-200">
                  Select Holding Institution
                </Label>
                <Select
                  value={formData.institutionId}
                  onValueChange={(value) =>
                    handleInputChange("institutionId", value)
                  }
                  required
                >
                  <SelectTrigger className="bg-neutral-800 border-neutral-700 text-neutral-100 focus:border-neutral-600">
                    <SelectValue placeholder="Select Holding Institution" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 border-neutral-700">
                    {institutions.data?.map((institution) => (
                      <SelectItem
                        key={institution._id}
                        value={institution._id}
                        className="text-neutral-100 focus:bg-neutral-700"
                      >
                        {institution.institutionName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assetType" className="text-neutral-200">
                  Asset Type
                </Label>
                <Select
                  value={formData.assetType}
                  onValueChange={(value) =>
                    handleInputChange("assetType", value)
                  }
                  required
                >
                  <SelectTrigger className="bg-neutral-800 border-neutral-700 text-neutral-100 focus:border-neutral-600">
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 border-neutral-700">
                    {Object.entries(assetTypeLabels).map(([value, label]) => (
                      <SelectItem
                        key={value}
                        value={value}
                        className="text-neutral-100 focus:bg-neutral-700"
                      >
                        <div className="flex items-center gap-2">{label}</div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assetName" className="text-neutral-200">
                    Asset Name
                  </Label>
                  <Input
                    id="assetName"
                    value={formData.assetName}
                    onChange={(e) =>
                      handleInputChange("assetName", e.target.value)
                    }
                    placeholder="Enter asset name"
                    className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-600"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="identifier" className="text-neutral-200">
                    Identifier
                  </Label>
                  <Input
                    id="identifier"
                    value={formData.identifier}
                    onChange={(e) =>
                      handleInputChange("identifier", e.target.value)
                    }
                    placeholder="Enter unique identifier"
                    className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-600"
                    required
                  />
                </div>
              </div>

              {/* Conditional Fields */}
              {showDateFields && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-neutral-100">
                    <CalendarIcon className="h-5 w-5 text-neutral-400" />
                    Date Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-neutral-200">Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-neutral-800 border-neutral-700 text-neutral-100 hover:bg-neutral-700",
                              !formData.startDate && "text-neutral-500"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.startDate
                              ? format(formData.startDate, "PPP")
                              : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-neutral-800 border-neutral-700">
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
                            className="bg-neutral-800 text-neutral-100"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-neutral-200">Maturity Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-neutral-800 border-neutral-700 text-neutral-100 hover:bg-neutral-700",
                              !formData.maturityDate && "text-neutral-500"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.maturityDate
                              ? format(formData.maturityDate, "PPP")
                              : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-neutral-800 border-neutral-700">
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
                            className="bg-neutral-800 text-neutral-100"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              )}

              {(showAmountInvested || showExpectedReturn) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-neutral-100">
                    <TrendingUp className="h-5 w-5 text-neutral-400" />
                    Investment Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {showAmountInvested && (
                      <div className="space-y-2">
                        <Label
                          htmlFor="amountInvested"
                          className="text-neutral-200"
                        >
                          Amount Invested
                        </Label>
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
                          className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-600"
                        />
                      </div>
                    )}
                    {showExpectedReturn && (
                      <div className="space-y-2">
                        <Label
                          htmlFor="expectedReturnRate"
                          className="text-neutral-200"
                        >
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
                          className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-600"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {showRecurringFields && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-neutral-100">
                    Recurring Contribution
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="contributionAmount"
                        className="text-neutral-200"
                      >
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
                        className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="contributionFrequency"
                        className="text-neutral-200"
                      >
                        Contribution Frequency
                      </Label>
                      <Select
                        value={formData.contributionFrequency || ""}
                        onValueChange={(value) =>
                          handleInputChange("contributionFrequency", value)
                        }
                      >
                        <SelectTrigger className="bg-neutral-800 border-neutral-700 text-neutral-100 focus:border-neutral-600">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-800 border-neutral-700">
                          {Object.entries(frequencyLabels).map(
                            ([value, label]) => (
                              <SelectItem
                                key={value}
                                value={value}
                                className="text-neutral-100 focus:bg-neutral-700"
                              >
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
                  <h3 className="text-lg font-semibold text-neutral-100">
                    Valuation
                  </h3>
                  <div className="space-y-2">
                    <Label
                      htmlFor="valuationOnPurchase"
                      className="text-neutral-200"
                    >
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
                      className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-600"
                    />
                  </div>
                </div>
              )}

              {showCurrentValuation && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-neutral-100">
                    Current Value
                  </h3>
                  <div className="space-y-2">
                    <Label
                      htmlFor="currentValuation"
                      className="text-neutral-200"
                    >
                      Current Valuation
                    </Label>
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
                      className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-600"
                    />
                  </div>
                </div>
              )}

              {showEquityFields && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-neutral-100">
                    Equity Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="units" className="text-neutral-200">
                        Number of Units
                      </Label>
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
                        className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="unitPurchasePrice"
                        className="text-neutral-200"
                      >
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
                        className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-500 focus:border-neutral-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex">
                <Button
                  type="submit"
                  variant="default"
                  className="bg-primary hover:bg-primary ml-auto text-black"
                >
                  Add Asset
                </Button>
              </div>
            </form>

            {message.msg && (
              <div
                className={`mt-4 text-sm ${message.type === "success" ? "text-primary" : "text-secondary"}`}
              >
                {message.msg}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
