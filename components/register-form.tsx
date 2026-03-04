"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, BarChart3 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface FieldErrors {
  email?: string
  password?: string
  confirmPassword?: string
}

function validateEmail(email: string): string | undefined {
  if (!email) return "Please enter a valid email address."
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return "Please enter a valid email address."
  return undefined
}

function validatePassword(password: string): string | undefined {
  if (!password) return "Password must be at least 8 characters."
  if (password.length < 8) return "Password must be at least 8 characters."
  return undefined
}

function validateConfirmPassword(
  password: string,
  confirmPassword: string
): string | undefined {
  if (!confirmPassword) return "Please confirm your password."
  if (password !== confirmPassword) return "Passwords do not match."
  return undefined
}

export function RegisterForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const router = useRouter()

  function validateField(field: string, value?: string) {
    const errors = { ...fieldErrors }

    switch (field) {
      case "email":
        errors.email = validateEmail(value ?? email)
        break
      case "password":
        errors.password = validatePassword(value ?? password)
        if (touched.confirmPassword && confirmPassword) {
          errors.confirmPassword = validateConfirmPassword(
            value ?? password,
            confirmPassword
          )
        }
        break
      case "confirmPassword":
        errors.confirmPassword = validateConfirmPassword(
          password,
          value ?? confirmPassword
        )
        break
    }

    setFieldErrors(errors)
  }

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }))
    validateField(field)
  }

  function handleChange(field: string, value: string) {
    switch (field) {
      case "email":
        setEmail(value)
        break
      case "password":
        setPassword(value)
        break
      case "confirmPassword":
        setConfirmPassword(value)
        break
    }

    if (touched[field]) {
      validateField(field, value)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError(null)

    setTouched({ email: true, password: true, confirmPassword: true })

    const errors: FieldErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    }

    setFieldErrors(errors)

    if (errors.email || errors.password || errors.confirmPassword) {
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/dashboard`,
        },
      })

      if (error) throw error

      router.push("/dashboard")
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-sm border-border/60">
      <CardContent className="px-8 pt-10 pb-8">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-foreground">
              PollShare
            </span>
          </div>

          {/* Heading */}
          <div className="flex flex-col items-center gap-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your details to get started.
            </p>
          </div>

          {/* Server error */}
          {serverError && (
            <div className="flex w-full items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {serverError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                aria-invalid={!!fieldErrors.email && touched.email}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
                className={
                  fieldErrors.email && touched.email
                    ? "border-destructive bg-destructive/5 focus-visible:ring-destructive"
                    : ""
                }
              />
              {fieldErrors.email && touched.email && (
                <p
                  id="email-error"
                  className="flex items-center gap-1.5 text-sm text-destructive"
                  role="alert"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                aria-invalid={!!fieldErrors.password && touched.password}
                aria-describedby={
                  fieldErrors.password ? "password-error" : undefined
                }
                className={
                  fieldErrors.password && touched.password
                    ? "border-destructive bg-destructive/5 focus-visible:ring-destructive"
                    : ""
                }
              />
              {fieldErrors.password && touched.password && (
                <p
                  id="password-error"
                  className="flex items-center gap-1.5 text-sm text-destructive"
                  role="alert"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="confirm-password"
                className="text-sm font-medium text-foreground"
              >
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                onBlur={() => handleBlur("confirmPassword")}
                aria-invalid={
                  !!fieldErrors.confirmPassword && touched.confirmPassword
                }
                aria-describedby={
                  fieldErrors.confirmPassword
                    ? "confirm-password-error"
                    : undefined
                }
                className={
                  fieldErrors.confirmPassword && touched.confirmPassword
                    ? "border-destructive bg-destructive/5 focus-visible:ring-destructive"
                    : ""
                }
              />
              {fieldErrors.confirmPassword && touched.confirmPassword && (
                <p
                  id="confirm-password-error"
                  className="flex items-center gap-1.5 text-sm text-destructive"
                  role="alert"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-1"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          {/* Login link */}
          <p className="text-sm text-muted-foreground">
            {"Already have an account? "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
