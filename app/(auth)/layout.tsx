import { requireUnAuth } from '@/features/auth/actions'
import React from 'react'

export default async function AuthLayout({children}: {children: React.ReactNode}) {
  await requireUnAuth();
  return (
    <div>{children}</div>
  )
}
