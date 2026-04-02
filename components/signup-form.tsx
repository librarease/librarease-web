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
import { registerAction } from '@/lib/actions/register'
import Link from 'next/link'
import { localizePath, type Locale } from '@/lib/i18n'

const initialState = {
  error: '',
  name: '',
  email: '',
  password: '',
}

type SignupCopy = Awaited<
  ReturnType<typeof import('@/lib/i18n').getDictionary>
>['auth']['signup']

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  locale: Locale
  copy: SignupCopy
}) {
  const [state, action, isPending] = useActionState(
    registerAction,
    initialState,
    localizePath(props.locale, '/login')
  )
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="backdrop-blur-md bg-background/40">
        <CardHeader>
          <CardTitle className="text-2xl">{props.copy.title}</CardTitle>
          <CardDescription>{props.copy.description}</CardDescription>
          {state.error && (
            <div className="text-sm text-red-400">{state.error}</div>
          )}
        </CardHeader>
        <CardContent>
          <form action={action}>
            <input type="hidden" name="locale" value={props.locale} />
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">{props.copy.nameLabel}</Label>
                <Input
                  id="name"
                  type="name"
                  name="name"
                  placeholder={props.copy.namePlaceholder}
                  defaultValue={state.name}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{props.copy.emailLabel}</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder={props.copy.emailPlaceholder}
                  defaultValue={state.email}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">{props.copy.passwordLabel}</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={props.copy.passwordPlaceholder}
                  // defaultValue={state.password}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {props.copy.submit}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {props.copy.loginPrompt}{' '}
              <Link
                href={localizePath(props.locale, '/login')}
                className="underline underline-offset-4"
              >
                {props.copy.loginLink}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
