'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useActionState, useEffect, useState } from 'react'
import { loginAction } from '@/lib/actions/login'
import Link from 'next/link'
import { Checkbox } from './ui/checkbox'
import { Route } from 'next'
import { Spinner } from './ui/spinner'
import { localizePath, type Locale } from '@/lib/i18n'

type LoginCopy = Awaited<
  ReturnType<typeof import('@/lib/i18n').getDictionary>
>['auth']['login']

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  email?: string
  from: Route
  locale: Locale
  copy: LoginCopy
}) {
  const initialState = {
    error: '',
    email: props.email ?? '',
    password: '',
    // to pass "from" to login form for redirecting after login
    from: props.from,
  }

  const [state, action, isPending] = useActionState(
    loginAction,
    initialState,
    props.from
  )

  const [showPassword, setShowPassword] = useState(false)
  const toggleShowPassword = setShowPassword.bind(null, !showPassword)

  // clear session cookie
  useEffect(() => {
    const sessionName = process.env.SESSION_COOKIE_NAME as string
    document.cookie = `${sessionName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  }, [])

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="backdrop-blur-md bg-background/40">
        <CardHeader>
          <CardTitle className="text-2xl">{props.copy.title}</CardTitle>
          <CardDescription>{props.copy.description}</CardDescription>
          {state.error && (
            <div className="text-sm text-destructive">{state.error}</div>
          )}
        </CardHeader>
        <CardContent>
          <form action={action}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">{props.copy.emailLabel}</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder={props.copy.emailPlaceholder}
                  autoFocus
                  defaultValue={state.email}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">{props.copy.passwordLabel}</Label>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={props.copy.passwordPlaceholder}
                  defaultValue={state.password}
                  required
                />
              </div>

              <div className="flex items-center">
                <Checkbox
                  id="show-password"
                  checked={showPassword}
                  onCheckedChange={toggleShowPassword}
                />
                <Label htmlFor="show-password" className="ml-2">
                  {props.copy.showPassword}
                </Label>
                <Link
                  href={localizePath(props.locale, '/forgot-password')}
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  {props.copy.forgotPassword}
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Spinner />}
                {props.copy.submit}
              </Button>
              {/* <Button variant="outline" className="w-full">
                Login with Google
              </Button> */}
            </div>
            <div className="mt-4 text-center text-sm">
              {props.copy.signupPrompt}{' '}
              <Link
                href={localizePath(props.locale, '/signup')}
                className="underline underline-offset-4"
              >
                {props.copy.signupLink}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
