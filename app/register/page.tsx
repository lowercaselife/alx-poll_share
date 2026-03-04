import { RegisterForm } from "@/components/register-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create an account - PollShare",
  description: "Sign up for PollShare to create and share polls.",
}

export default function RegisterPage() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <RegisterForm />
    </main>
  )
}
