import { prisma } from './prisma'

export async function createOrUpdateUser(clerkUser: {
  id: string
  emailAddresses: Array<{ emailAddress: string }>
  firstName?: string | null
  lastName?: string | null
  imageUrl?: string
}) {
  const email = clerkUser.emailAddresses[0]?.emailAddress
  if (!email) {
    throw new Error('No email address found for user')
  }

  const name = [clerkUser.firstName, clerkUser.lastName]
    .filter(Boolean)
    .join(' ')

  return await prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {
      email,
      name: name || null,
      avatar: clerkUser.imageUrl || null,
    },
    create: {
      clerkId: clerkUser.id,
      email,
      name: name || null,
      avatar: clerkUser.imageUrl || null,
    },
  })
}

export async function deleteUser(clerkId: string) {
  return await prisma.user.delete({
    where: { clerkId },
  })
}

export async function getUserByClerkId(clerkId: string) {
  return await prisma.user.findUnique({
    where: { clerkId },
  })
}
