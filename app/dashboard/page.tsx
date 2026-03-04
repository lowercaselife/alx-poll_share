import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard - PollShare",
  description: "Manage your polls on PollShare.",
}

export default function DashboardPage() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6">
      <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
    </main>
  )
}
