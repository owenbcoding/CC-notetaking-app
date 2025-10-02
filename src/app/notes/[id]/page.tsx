import { currentUser } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { NoteView } from '@/components/notes/note-view'

interface NotePageProps {
  params: {
    id: string
  }
}

export default async function NotePage({ params }: NotePageProps) {
  const user = await currentUser()
  
  if (!user) {
    redirect('/')
  }

  // Get user from database
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  })

  if (!dbUser) {
    redirect('/')
  }

  // Get the note
  const note = await prisma.note.findFirst({
    where: {
      id: params.id,
      userId: dbUser.id,
    },
    include: {
      notebook: true,
    },
  })

  if (!note) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <NoteView note={note} />
        </div>
      </div>
    </div>
  )
}
