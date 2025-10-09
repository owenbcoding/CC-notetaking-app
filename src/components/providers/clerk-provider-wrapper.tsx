'use client'

import dynamic from 'next/dynamic'

type Props = {
  enabled: boolean
  children: React.ReactNode
}

export default function ClerkProviderWrapper({ enabled, children }: Props) {
  if (!enabled) return <>{children}</>
  const ClerkProvider = dynamic(() => import('@clerk/nextjs').then(m => m.ClerkProvider), { ssr: false })
  return <ClerkProvider>{children}</ClerkProvider>
}


