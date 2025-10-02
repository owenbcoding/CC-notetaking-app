import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { NotesList } from '@/components/notes/notes-list'

export default async function NotesPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/')
  }

  // Get or create user in database
  const dbUser = await prisma.user.upsert({
    where: { clerkId: user.id },
    update: {
      email: user.emailAddresses[0]?.emailAddress || '',
      name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || null,
      avatar: user.imageUrl,
    },
    create: {
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || null,
      avatar: user.imageUrl,
    },
  })

  // Get user's notes
  const notes = await prisma.note.findMany({
    where: { userId: dbUser.id },
    orderBy: { updatedAt: 'desc' },
    include: {
      notebook: true,
    },
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Notes</h1>
              <p className="text-muted-foreground">
                {notes.length} {notes.length === 1 ? 'note' : 'notes'} total
              </p>
            </div>
            <Button asChild>
              <Link href="/notes/new">
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Link>
            </Button>
          </div>
        </div>

        {/* Notes List */}
        <NotesList initialNotes={notes} />
      </div>
    </div>
  )
}
