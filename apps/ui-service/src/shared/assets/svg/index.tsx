export function OverviewVector() {
  return (
    <>
      <div className="flex gap-8 mb-8 justify-center">
        <div className="w-16 h-16 bg-white rounded-full" />
        <div className="w-16 h-16 bg-primary rounded-full" />
      </div>
      <div className="flex gap-8 mb-8 justify-center">
        <div className="w-16 h-16 bg-primary rounded-full" />
        <div className="w-16 h-16 bg-white rounded-full" />
      </div>
    </>
  )
}

export function IntelligenceVector() {
  return (
    <div className="flex justify-center mb-8">
      <div className="w-64 h-32 relative">
        <div className="left-4 w-48 h-4 bg-neutral-500" />
        <div className="mt-2 left-4 w-36 h-4 bg-neutral-700" />
        <div className="mt-2 left-4 w-24 h-4 bg-primary" />
      </div>
    </div>
  )
}

export function ControlVector() {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8 max-w-[200px] mx-auto">
      <div className="space-y-4">
        <div className="w-16 h-16">
          <div className="w-16 h-8 bg-neutral-400 rounded-t-full" />
          <div className="w-16 h-8 bg-neutral-500 rounded-b-full" />
        </div>
        <div className="w-16 h-16">
          <div className="w-16 h-8 bg-neutral-500 rounded-t-full" />
          <div className="w-16 h-8 bg-neutral-400 rounded-b-full" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="w-16 h-16">
          <div className="w-16 h-8 bg-neutral-400 rounded-t-full" />
          <div className="w-16 h-8 bg-neutral-500 rounded-b-full" />
        </div>
        <div className="w-16 h-16 relative">
          <div className="w-16 h-8 bg-neutral-500 rounded-t-full" />
          <div className="w-16 h-8 bg-neutral-400 rounded-b-full" />
        </div>
      </div>
    </div>
  )
}
