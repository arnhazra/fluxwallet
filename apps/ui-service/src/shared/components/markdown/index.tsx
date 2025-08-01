import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"

const MarkdownRenderer = ({ markdown }: { markdown: string }) => {
  return (
    <div className="gap-4 whitespace-pre-wrap text-sm">
      <div className="block">
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          components={{
            code({ className, children, ...props }) {
              const isInline = !className
              return isInline ? (
                <code className="bg-neutral-800 p-1 rounded">{children}</code>
              ) : (
                <pre className="bg-neutral-800 text-white p-4 rounded overflow-auto">
                  <code {...props} className={className}>
                    {children}
                  </code>
                </pre>
              )
            },
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default MarkdownRenderer
