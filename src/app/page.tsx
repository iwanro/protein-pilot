'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Loader2, 
  Camera, 
  Target, 
  TrendingUp, 
  Calendar, 
  Utensils, 
  ChefHat,
  Plus,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import FoodPhotoUpload from '@/components/food-photo-upload'
import PersonalizedMealPlanner from '@/components/personalized-meal-planner'

export default function Home() {
  const [dailyGoal, setDailyGoal] = useState(150)
  const [currentProtein, setCurrentProtein] = useState(85)
  const [meals, setMeals] = useState([
    { id: 1, name: 'Greek Yogurt with Berries', protein: 20, time: '08:30', calories: 180 },
    { id: 2, name: 'Grilled Chicken Salad', protein: 35, time: '12:45', calories: 320 },
    { id: 3, name: 'Protein Shake', protein: 25, time: '15:30', calories: 150 },
  ])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showMealDialog, setShowMealDialog] = useState(false)
  const [newMealName, setNewMealName] = useState('')
  const [newMealProtein, setNewMealProtein] = useState('')
  const [analysisResult, setAnalysisResult] = useState<any>(null)

  const progressPercentage = (currentProtein / dailyGoal) * 100

  const handleAddMeal = () => {
    if (newMealName && newMealProtein) {
      const newMeal = {
        id: meals.length + 1,
        name: newMealName,
        protein: parseInt(newMealProtein),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        calories: Math.round(parseInt(newMealProtein) * 4) // Rough estimate
      }
      setMeals([...meals, newMeal])
      setCurrentProtein(currentProtein + parseInt(newMealProtein))
      setNewMealName('')
      setNewMealProtein('')
      setShowMealDialog(false)
    }
  }

  const handleAddPhotoMeal = (meal: any) => {
    setMeals([...meals, meal])
    setCurrentProtein(currentProtein + meal.protein)
  }

  const handleAnalysisComplete = (result: any) => {
    // Handle analysis completion if needed
    console.log('Analysis complete:', result)
  }

  const handleAnalyzeFood = async () => {
    setIsAnalyzing(true)
    setAnalysisResult(null)
    
    // Simulate AI food analysis
    setTimeout(() => {
      setAnalysisResult({
        foodName: 'Grilled Salmon with Quinoa',
        protein: 42,
        calories: 380,
        confidence: 95,
        suggestions: [
          'Add extra salmon fillet for +20g protein',
          'Include protein-rich side like edamame',
          'Consider whey protein supplement if still under goal'
        ]
      })
      setIsAnalyzing(false)
    }, 2000)
  }

  const getMotivationalMessage = () => {
    const percentage = progressPercentage
    if (percentage >= 100) return "🎉 Goal achieved! You're crushing it!"
    if (percentage >= 80) return "💪 Almost there! Keep pushing!"
    if (percentage >= 60) return "👍 Great progress! You're over halfway!"
    if (percentage >= 40) return "🚀 Good start! Keep it up!"
    return "🌟 Every gram counts! Let's get started!"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <ChefHat className="h-10 w-10 text-green-600" />
              <Target className="h-4 w-4 text-blue-600 absolute -bottom-1 -right-1" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              ProteinPilot
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            AI-powered nutrition tracking that makes hitting your protein goals effortless. 
            Just snap a photo and let AI do the work.
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="track" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Track Meal
            </TabsTrigger>
            <TabsTrigger value="plan" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Meal Plan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Daily Progress */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Today's Protein Goal
                  </CardTitle>
                  <CardDescription>
                    Track your daily protein intake and progress
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-green-600">
                        {currentProtein}g
                      </span>
                      <span className="text-gray-500">of {dailyGoal}g goal</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{Math.round(progressPercentage)}%</span>
                      </div>
                      <Progress value={progressPercentage} className="w-full h-3" />
                    </div>

                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="font-medium text-green-700 dark:text-green-300">
                        {getMotivationalMessage()}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-blue-600">
                          {meals.length}
                        </div>
                        <div className="text-sm text-gray-500">Meals Logged</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-600">
                          {Math.round(meals.reduce((sum, meal) => sum + meal.calories, 0))}
                        </div>
                        <div className="text-sm text-gray-500">Calories</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-orange-600">
                          {Math.round(currentProtein / meals.length) || 0}g
                        </div>
                        <div className="text-sm text-gray-500">Avg/Meal</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Dialog open={showMealDialog} onOpenChange={setShowMealDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Utensils className="mr-2 h-4 w-4" />
                        Log Meal Manually
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Log Your Meal</DialogTitle>
                        <DialogDescription>
                          Enter the details of your meal to track protein intake.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="meal-name">Meal Name</Label>
                          <Input
                            id="meal-name"
                            value={newMealName}
                            onChange={(e) => setNewMealName(e.target.value)}
                            placeholder="e.g., Grilled Chicken Breast"
                          />
                        </div>
                        <div>
                          <Label htmlFor="protein-amount">Protein (grams)</Label>
                          <Input
                            id="protein-amount"
                            type="number"
                            value={newMealProtein}
                            onChange={(e) => setNewMealProtein(e.target.value)}
                            placeholder="e.g., 30"
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" onClick={() => setShowMealDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddMeal} disabled={!newMealName || !newMealProtein}>
                            Add Meal
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" className="w-full" onClick={() => {
                    setDailyGoal(200)
                    setCurrentProtein(120)
                  }}>
                    <Target className="mr-2 h-4 w-4" />
                    Update Goal
                  </Button>

                  <Button variant="outline" className="w-full">
                    <Calendar className="mr-2 h-4 w-4" />
                    View History
                  </Button>
                </CardContent>
              </Card>

              {/* Today's Meals */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="h-5 w-5" />
                    Today's Meals
                  </CardTitle>
                  <CardDescription>
                    Your logged meals and protein intake
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {meals.map((meal) => (
                      <div key={meal.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium">{meal.name}</div>
                            <div className="text-sm text-gray-500">{meal.time} • {meal.calories} calories</div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-green-700 bg-green-100">
                          {meal.protein}g protein
                        </Badge>
                      </div>
                    ))}
                    
                    {meals.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Utensils className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No meals logged yet. Start tracking your protein intake!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="track">
            <div className="max-w-4xl mx-auto">
              <FoodPhotoUpload 
                onAnalysisComplete={handleAnalysisComplete}
                onAddToLog={handleAddPhotoMeal}
              />
            </div>
          </TabsContent>

          <TabsContent value="plan">
            <PersonalizedMealPlanner />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}