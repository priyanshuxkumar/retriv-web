import AgentDashboard from "@/components/agent/AgentDashboard"
import { AgentSkeleton } from "@/components/agent/AgentSkeleton"
import { Suspense } from "react"

export default function Page() {
  return (
    <div className="container my-6 px-6">
      <Suspense fallback={<AgentSkeleton />}>
        <AgentDashboard />
      </Suspense>
    </div>
  )
}
