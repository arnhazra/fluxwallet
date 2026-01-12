"use client"
import MarkdownRenderer from "@/shared/components/markdown"
import { Button } from "@/shared/components/ui/button"
import { endPoints } from "@/shared/constants/api-endpoints"
import { useState } from "react"

export default function Page() {
  const baseImages = ["/images/base1.png"]
  const actualImages = ["/images/actual1.png"]
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleUpload = async () => {
    setUploading(true)
    setMessage(null)
    try {
      // Fetch the images as blobs
      const baseResponse = await fetch(baseImages[0])
      const actualResponse = await fetch(actualImages[0])
      const baseBlob = await baseResponse.blob()
      const actualBlob = await actualResponse.blob()

      const formData = new FormData()
      formData.append("base", baseBlob, "base1.png")
      formData.append("actual", actualBlob, "actual1.png")

      const res = await fetch(endPoints.sscompare, {
        method: "POST",
        body: formData,
      })
      if (res.ok) {
        const data = await res.json()
        setMessage(data.response)
      } else {
        setMessage("Upload failed.")
      }
    } catch (err) {
      setMessage("Upload error.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Comparison Table</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "2rem",
          color: "#fff",
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              Base Design Screenshot
            </th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              Actual App Screenshot
            </th>
          </tr>
        </thead>
        <tbody>
          {[0].map((rowIdx: number) => (
            <tr key={rowIdx}>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                <img
                  src={baseImages[rowIdx]}
                  alt={`Base Design Screenshot ${rowIdx + 1}`}
                  style={{
                    maxWidth: "200px",
                    maxHeight: "120px",
                    borderRadius: "8px",
                  }}
                />
              </td>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                <img
                  src={actualImages[rowIdx]}
                  alt={`Actual App Screenshot ${rowIdx + 1}`}
                  style={{
                    maxWidth: "200px",
                    maxHeight: "120px",
                    borderRadius: "8px",
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button
        variant="default"
        onClick={handleUpload}
        disabled={uploading}
        className="text-black"
      >
        {uploading ? "Uploading..." : "Upload"}
      </Button>
      {message && (
        <div style={{ marginTop: "1rem", color: "#fff" }}>
          <MarkdownRenderer markdown={message} />
        </div>
      )}
    </div>
  )
}
