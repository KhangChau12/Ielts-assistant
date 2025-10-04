'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react'
import Link from 'next/link'
import type { VocabularyItem } from '@/types/vocabulary'

export default function FlashcardsPage({ params }: { params: { essayId: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const vocabType = searchParams.get('type') || 'paraphrase'

  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchVocabulary()
  }, [params.essayId, vocabType])

  const fetchVocabulary = async () => {
    try {
      const response = await fetch(`/api/vocabulary/${params.essayId}?type=${vocabType}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch vocabulary')
      }

      if (!data.vocabulary || data.vocabulary.length === 0) {
        setError('No vocabulary found for this essay')
      } else {
        setVocabulary(data.vocabulary)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load vocabulary')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    if (currentIndex < vocabulary.length - 1) {
      setIsFlipped(false)
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1)
      }, 200)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setIsFlipped(false)
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1)
      }, 200)
    }
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const progress = vocabulary.length > 0 ? ((currentIndex + 1) / vocabulary.length) * 100 : 0
  const currentCard = vocabulary[currentIndex]

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-96">
          <div className="text-ocean-600">Loading flashcards...</div>
        </div>
      </div>
    )
  }

  if (error || vocabulary.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <Link href={`/vocabulary/${params.essayId}`}>
          <Button variant="ghost" className="mb-4 text-ocean-600 hover:text-ocean-800 hover:bg-ocean-50">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vocabulary
          </Button>
        </Link>
        <Card className="border-ocean-200 shadow-lg">
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-ocean-600">{error || 'No vocabulary available'}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link href={`/vocabulary/${params.essayId}`}>
          <Button variant="ghost" className="mb-4 text-ocean-600 hover:text-ocean-800 hover:bg-ocean-50">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vocabulary
          </Button>
        </Link>
        <h1 className="text-4xl font-bold text-ocean-800 mb-2">Flashcards</h1>
        <p className="text-ocean-600 capitalize">{vocabType} Vocabulary</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-ocean-600 font-medium">
            Card {currentIndex + 1} of {vocabulary.length}
          </span>
          <span className="text-sm text-ocean-600 font-medium">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Flashcard Container */}
      <div className="relative mb-8 h-[450px]" style={{ perspective: '1500px' }}>
        <div
          className="relative w-full h-full transition-transform duration-500 ease-in-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front of card - Definition */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <Card className="w-full h-full border-2 border-ocean-300 shadow-xl cursor-pointer hover:border-ocean-400 transition-colors"
              onClick={handleFlip}
            >
              <CardContent className="flex flex-col items-center justify-center h-full p-12 bg-gradient-to-br from-ocean-50 to-cyan-50">
                <div className="text-center space-y-6 max-w-2xl">
                  <p className="text-xs uppercase tracking-wider text-ocean-500 font-semibold">Definition</p>
                  <p className="text-2xl text-ocean-800 font-medium leading-relaxed">
                    {currentCard.definition}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-ocean-400 mt-8">
                    <RotateCw className="h-5 w-5" />
                    <p className="text-sm">Click to reveal word</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Back of card - Word */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <Card className="w-full h-full border-2 border-cyan-400 shadow-xl cursor-pointer hover:border-cyan-500 transition-colors"
              onClick={handleFlip}
            >
              <CardContent className="flex flex-col items-center justify-center h-full p-12 bg-gradient-to-br from-cyan-500 to-ocean-600">
                <div className="text-center space-y-6 max-w-2xl">
                  {currentCard.original_word && (
                    <div className="mb-4">
                      <p className="text-xs uppercase tracking-wider text-cyan-100 font-semibold">Original</p>
                      <p className="text-xl text-white/90 font-medium mt-1">
                        {currentCard.original_word}
                      </p>
                    </div>
                  )}
                  <p className="text-xs uppercase tracking-wider text-cyan-100 font-semibold">
                    {currentCard.original_word ? 'Suggested Word' : 'Word'}
                  </p>
                  <p className="text-5xl text-white font-bold leading-relaxed">
                    {currentCard.suggested_word}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-cyan-100 mt-8">
                    <RotateCw className="h-5 w-5" />
                    <p className="text-sm">Click to see definition</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center gap-4">
        <Button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          variant="outline"
          size="lg"
          className="border-ocean-300 text-ocean-700 hover:bg-ocean-50 disabled:opacity-50"
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Previous
        </Button>

        <Button
          onClick={handleFlip}
          size="lg"
          className="bg-gradient-to-r from-ocean-600 to-cyan-600 hover:from-ocean-700 hover:to-cyan-700 text-white px-8"
        >
          <RotateCw className="mr-2 h-5 w-5" />
          Flip Card
        </Button>

        <Button
          onClick={handleNext}
          disabled={currentIndex === vocabulary.length - 1}
          variant="outline"
          size="lg"
          className="border-ocean-300 text-ocean-700 hover:bg-ocean-50 disabled:opacity-50"
        >
          Next
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="mt-6 p-3 bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg">
        <p className="text-sm text-ocean-700 text-center">
          <strong>Tip:</strong> Click the card or press the Flip button to reveal the answer
        </p>
      </div>

      {/* Study Tips */}
      <div className="mt-6 p-4 bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg">
        <h3 className="font-semibold text-ocean-800 mb-2">Study Tips</h3>
        <ul className="text-sm text-ocean-700 space-y-1">
          <li className="flex items-start">
            <span className="text-cyan-600 mr-2">•</span>
            <span>Try to recall the word before flipping the card</span>
          </li>
          <li className="flex items-start">
            <span className="text-cyan-600 mr-2">•</span>
            <span>Review flashcards multiple times for better retention</span>
          </li>
          <li className="flex items-start">
            <span className="text-cyan-600 mr-2">•</span>
            <span>Use the word in a sentence to reinforce learning</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
