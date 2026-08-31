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
import { useActionState, useEffect } from 'react'
import { loginAction } from '@/lib/actions/login'
import Link from 'next/link'
import { Route } from 'next'
import { localizePath, type Locale } from '@/lib/i18n'

type ForgotPasswordCopy = Awaited<
  ReturnType<typeof import('@/lib/i18n').getDictionary>
>['auth']['forgotPassword']

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  email?: string
  from: Route
  locale: Locale
  copy: ForgotPasswordCopy
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

  // clear session cookie
  useEffect(() => {
    const sessionName = process.env.SESSION_COOKIE_NAME as string
    document.cookie = `${sessionName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  }, [])

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{props.copy.title}</CardTitle>
          <CardDescription>{props.copy.description}</CardDescription>
          {state.error && (
            <div className="text-sm text-red-400">{state.error}</div>
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
              <Link
                href={localizePath(props.locale, '/login')}
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                {props.copy.backToLogin}
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {props.copy.submit}
            </Button>

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
