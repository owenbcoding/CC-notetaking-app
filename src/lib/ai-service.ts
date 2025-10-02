export interface GenerateNoteRequest {
  prompt: string
  type?: 'general' | 'meeting' | 'study' | 'idea' | 'journal'
}

export interface GenerateNoteResponse {
  success: boolean
  generatedText: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  error?: string
}

export class AIService {
  static async generateNote(request: GenerateNoteRequest): Promise<GenerateNoteResponse> {
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate note')
      }

      return data
    } catch (error) {
      console.error('AI Service error:', error)
      return {
        success: false,
        generatedText: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  static getNoteTypeSuggestions(type: string): string[] {
    const suggestions = {
      general: [
        'Write a summary about...',
        'Create notes about...',
        'Explain the concept of...',
        'List the key points of...'
      ],
      meeting: [
        'Meeting notes for [topic]',
        'Summarize the discussion about...',
        'Key decisions from [meeting name]',
        'Action items from the meeting on...'
      ],
      study: [
        'Study notes for [subject]',
        'Key concepts in [topic]',
        'Summary of [chapter/topic]',
        'Important points about...'
      ],
      idea: [
        'Develop an idea about...',
        'Brainstorm solutions for...',
        'Explore the concept of...',
        'Expand on the idea of...'
      ],
      journal: [
        'Reflect on...',
        'Write about my thoughts on...',
        'Journal entry about...',
        'Personal insights on...'
      ]
    }

    return suggestions[type as keyof typeof suggestions] || suggestions.general
  }
}
