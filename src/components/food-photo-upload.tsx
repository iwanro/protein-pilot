'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Camera, 
  Upload, 
  X, 
  CheckCircle, 
  Loader2,
  Plus,
  Zap
} from 'lucide-react'

interface FoodPhotoUploadProps {
  onAnalysisComplete: (result: any) => void
  onAddToLog: (meal: any) => void
}

export default function FoodPhotoUpload({ onAnalysisComplete, onAddToLog }: FoodPhotoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setAnalysisResult(null)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setAnalysisResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + Math.random() * 30
      })
    }, 300)

    try {
      // Simulate API call to analyze food
      setTimeout(() => {
        const mockResult = {
          foodName: 'Grilled Chicken Breast with Quinoa',
          protein: 42,
          calories: 380,
          carbs: 35,
          fats: 12,
          confidence: 95,
          suggestions: [
            { type: 'protein_boost', text: 'Add extra chicken breast for +20g protein', confidence: 90 },
            { type: 'complement', text: 'Include protein-rich side like edamame', confidence: 85 },
            { type: 'alternative', text: 'Consider whey protein supplement if still under goal', confidence: 75 }
          ],
          portionSize: '1 large serving',
          ingredients: ['Chicken breast', 'Quinoa', 'Bell peppers', 'Olive oil', 'Spices']
        }
        
        setAnalysisResult(mockResult)
        setAnalysisProgress(100)
        setIsAnalyzing(false)
        onAnalysisComplete(mockResult)
      }, 2500)
    } catch (error) {
      console.error('Analysis failed:', error)
      setIsAnalyzing(false)
    }
  }

  const handleAddToLog = () => {
    if (analysisResult) {
      const meal = {
        id: Date.now(),
        name: analysisResult.foodName,
        protein: analysisResult.protein,
        calories: analysisResult.calories,
        carbs: analysisResult.carbs,
        fats: analysisResult.fats,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        imageUrl: previewUrl,
        confidence: analysisResult.confidence
      }
      onAddToLog(meal)
      handleRemoveFile()
    }
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'protein_boost':
        return <Zap className="h-4 w-4 text-yellow-500" />
      case 'complement':
        return <Plus className="h-4 w-4 text-blue-500" />
      case 'alternative':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Plus className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          AI Food Analysis
        </CardTitle>
        <CardDescription>
          Upload a photo of your meal for instant nutritional analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!previewUrl ? (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <Camera className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">Take or Upload a Photo</p>
            <p className="text-gray-500 mb-4">
              Our AI will identify your food and calculate nutritional content
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
              id="food-photo-upload"
            />
            <Button onClick={() => fileInputRef.current?.click()} size="lg">
              <Upload className="mr-2 h-4 w-4" />
              Choose Photo
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={previewUrl}
                alt="Food to analyze"
                className="w-full h-64 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemoveFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {!analysisResult ? (
              <div className="space-y-4">
                <Button 
                  onClick={handleAnalyze} 
                  disabled={isAnalyzing}
                  className="w-full"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Analyze Food
                    </>
                  )}
                </Button>

                {isAnalyzing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Analysis Progress</span>
                      <span>{Math.round(analysisProgress)}%</span>
                    </div>
                    <Progress value={analysisProgress} className="w-full" />
                    <p className="text-sm text-gray-500 text-center">
                      AI is analyzing your food image...
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Analysis Complete!</strong> AI identified your meal with {analysisResult.confidence}% confidence.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-xl font-bold text-green-600">
                        {analysisResult.protein}g
                      </div>
                      <div className="text-sm text-gray-500">Protein</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-xl font-bold text-blue-600">
                        {analysisResult.calories}
                      </div>
                      <div className="text-sm text-gray-500">Calories</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-xl font-bold text-orange-600">
                        {analysisResult.carbs}g
                      </div>
                      <div className="text-sm text-gray-500">Carbs</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-xl font-bold text-purple-600">
                        {analysisResult.fats}g
                      </div>
                      <div className="text-sm text-gray-500">Fats</div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Identified Food</h4>
                  <p className="text-lg font-medium">{analysisResult.foodName}</p>
                  <p className="text-sm text-gray-500">Portion: {analysisResult.portionSize}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Ingredients Detected</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.ingredients.map((ingredient: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Smart Suggestions</h4>
                  <div className="space-y-2">
                    {analysisResult.suggestions.map((suggestion: any, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        {getSuggestionIcon(suggestion.type)}
                        <div className="flex-1">
                          <p className="text-sm">{suggestion.text}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {suggestion.type.replace('_', ' ')}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {suggestion.confidence}% confidence
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={handleAddToLog}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Add to Food Log
                  </Button>
                  <Button variant="outline" onClick={handleRemoveFile}>
                    <X className="mr-2 h-4 w-4" />
                    Discard
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}