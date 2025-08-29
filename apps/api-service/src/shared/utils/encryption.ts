function b64Strict(name: string, v: string, expectBytes: number) {
  if (!v) throw new Error(`${name} missing`)
  // kill quotes/newlines/spaces that sneak in from .env editors
  const clean = v
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\s+/g, "")
  const buf = Buffer.from(clean, "base64")
  if (buf.length !== expectBytes) {
    throw new Error(
      `${name} must decode to ${expectBytes} bytes, got ${buf.length}`
    )
  }
  return clean // return the cleaned base64 string
}

export const ENC32_B64 = b64Strict(
  "MONGOOSE_ENC_KEY (32B b64)",
  "UHR7KjG8Gvu07rKL9sG3UeHYZHVdMzFGC8ZSQavBYtA=",
  32
)
export const SIG64_B64 = b64Strict(
  "MONGOOSE_SIG_KEY (64B b64)",
  "Wn7lwldKI/7tXmE/wEefkIN4r2AaqTtxyGaVYZvAGZiLSs7m53F96pgK2aHz4nb6qNYZXFvlKlhpmX9qVagj1Q==",
  64
)
