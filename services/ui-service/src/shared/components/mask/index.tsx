"use client"

export default function MaskText({ value }: { value: string }) {
  if (!value || value.length <= 8) {
    return <span>{value}</span>
  }
  return `${value?.substring(0, 3)}...${value?.substring(value?.length - 3)}`
}
