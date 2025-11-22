export const streamResponseText = (
  fullText: string,
  callback: (chunk: string) => void,
  chunkSize = 3,
  delay = 25
) => {
  let i = 0
  const interval = setInterval(() => {
    if (i < fullText.length) {
      callback(fullText.slice(0, i + chunkSize))
      i += chunkSize
    } else {
      clearInterval(interval)
    }
  }, delay)
}
