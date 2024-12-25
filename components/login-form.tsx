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
import { useActionState } from 'react'
import { login } from '@/lib/actions/login'
import Link from 'next/link'

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & { email?: string; from: string }) {
  const initialState = {
    error: '',
    email: props.email ?? '',
    password: '',
    // to pass "from" to login form for redirecting after login
    from: props.from,
  }

  const [state, action, isPending] = useActionState(
    login,
    initialState,
    props.from
  )

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          {state.error && (
            <div className="text-sm text-red-400">{state.error}</div>
          )}
        </CardHeader>
        <CardContent>
          <form action={action}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  // placeholder="m@example.com"
                  defaultValue={state.email}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  // defaultValue={state.password}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                Login
              </Button>
              {/* <Button variant="outline" className="w-full">
                Login with Google
              </Button> */}
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="underline underline-offset-4"
                replace
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
