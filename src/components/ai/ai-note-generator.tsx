'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Wand2, Loader2, Copy, Check } from 'lucide-react'
import { AIService } from '@/lib/ai-service'

interface AINoteGeneratorProps {
  onGeneratedContent?: (content: string) => void
  className?: string
}

export function AINoteGenerator({ onGeneratedContent, className }: AINoteGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [noteType, setNoteType] = useState<'general' | 'meeting' | 'study' | 'idea' | 'journal'>('general')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setGeneratedContent('')

    try {
      const result = await AIService.generateNote({
        prompt: prompt.trim(),
        type: noteType
      })

      if (result.success) {
        setGeneratedContent(result.generatedText)
        if (onGeneratedContent) {
          onGeneratedContent(result.generatedText)
        }
      } else {
        console.error('Generation failed:', result.error)
      }
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    if (generatedContent) {
      await navigator.clipboard.writeText(generatedContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const suggestions = AIService.getNoteTypeSuggestions(noteType)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          AI Note Generator
        </CardTitle>
        <CardDescription>
          Generate well-structured notes using AI. Just describe what you want to write about.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Note Type</label>
          <Select value={noteType} onValueChange={(value: 'general' | 'meeting' | 'study' | 'idea' | 'journal') => setNoteType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Notes</SelectItem>
              <SelectItem value="meeting">Meeting Notes</SelectItem>
              <SelectItem value="study">Study Notes</SelectItem>
              <SelectItem value="idea">Ideas & Brainstorming</SelectItem>
              <SelectItem value="journal">Journal Entry</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">What would you like to write about?</label>
          <Textarea
            placeholder={`Try: "${suggestions[0]}"`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <div className="text-xs text-muted-foreground">
            Suggestions: {suggestions.slice(0, 2).map(s => `"${s}"`).join(', ')}
          </div>
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={!prompt.trim() || isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Note
            </>
          )}
        </Button>

        {generatedContent && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Generated Content</label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="h-8"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="p-3 bg-muted rounded-md">
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {generatedContent}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
