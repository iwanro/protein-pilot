'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ChefHat, 
  Calendar, 
  Target, 
  Plus, 
  Edit,
  Trash2,
  Clock,
  Zap,
  CheckCircle,
  TrendingUp
} from 'lucide-react'

interface MealPlan {
  id: string
  name: string
  description?: string
  targetProtein: number
  targetCalories: number
  isActive: boolean
  meals: PlanMeal[]
}

interface PlanMeal {
  id: string
  name: string
  protein: number
  calories: number
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
}

interface PersonalizedMealPlannerProps {
  userPreferences?: {
    dietaryRestrictions?: string[]
    fitnessGoal?: string
    favoriteFoods?: string[]
    activityLevel?: string
  }
}

export default function PersonalizedMealPlanner({ userPreferences }: PersonalizedMealPlannerProps) {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newPlanName, setNewPlanName] = useState('')
  const [newPlanDescription, setNewPlanDescription] = useState('')
  const [targetProtein, setTargetProtein] = useState(150)
  const [targetCalories, setTargetCalories] = useState(2000)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    // Load mock meal plans
    const mockPlans: MealPlan[] = [
      {
        id: '1',
        name: 'Muscle Building Plan',
        description: 'High-protein meal plan for muscle gain',
        targetProtein: 180,
        targetCalories: 2500,
        isActive: true,
        meals: [
          { id: '1-1', name: 'Protein Oatmeal with Berries', protein: 25, calories: 350, mealType: 'breakfast' },
          { id: '1-2', name: 'Grilled Chicken with Sweet Potato', protein: 45, calories: 500, mealType: 'lunch' },
          { id: '1-3', name: 'Salmon with Quinoa and Vegetables', protein: 40, calories: 450, mealType: 'dinner' },
          { id: '1-4', name: 'Protein Shake with Banana', protein: 30, calories: 250, mealType: 'snack' }
        ]
      },
      {
        id: '2',
        name: 'Weight Maintenance Plan',
        description: 'Balanced nutrition for maintaining current weight',
        targetProtein: 120,
        targetCalories: 2000,
        isActive: false,
        meals: [
          { id: '2-1', name: 'Greek Yogurt Parfait', protein: 20, calories: 300, mealType: 'breakfast' },
          { id: '2-2', name: 'Turkey and Avocado Wrap', protein: 30, calories: 400, mealType: 'lunch' },
          { id: '2-3', name: 'Baked Cod with Brown Rice', protein: 35, calories: 380, mealType: 'dinner' },
          { id: '2-4', name: 'Apple with Almond Butter', protein: 6, calories: 200, mealType: 'snack' }
        ]
      }
    ]
    setMealPlans(mockPlans)
    setSelectedPlan(mockPlans.find(plan => plan.isActive) || mockPlans[0])
  }, [])

  const generatePersonalizedPlan = async () => {
    setIsGenerating(true)
    
    // Simulate AI meal plan generation
    setTimeout(() => {
      const newPlan: MealPlan = {
        id: Date.now().toString(),
        name: newPlanName || 'AI-Generated Meal Plan',
        description: newPlanDescription || 'Personalized meal plan based on your preferences',
        targetProtein,
        targetCalories,
        isActive: false,
        meals: [
          { 
            id: `${Date.now()}-1`, 
            name: 'Smart Protein Breakfast Bowl', 
            protein: Math.round(targetProtein * 0.25), 
            calories: Math.round(targetCalories * 0.25), 
            mealType: 'breakfast' 
          },
          { 
            id: `${Date.now()}-2`, 
            name: 'Power Lunch Plate', 
            protein: Math.round(targetProtein * 0.35), 
            calories: Math.round(targetCalories * 0.35), 
            mealType: 'lunch' 
          },
          { 
            id: `${Date.now()}-3`, 
            name: 'Balanced Dinner Bowl', 
            protein: Math.round(targetProtein * 0.30), 
            calories: Math.round(targetCalories * 0.30), 
            mealType: 'dinner' 
          },
          { 
            id: `${Date.now()}-4`, 
            name: 'Protein Snack', 
            protein: Math.round(targetProtein * 0.10), 
            calories: Math.round(targetCalories * 0.10), 
            mealType: 'snack' 
          }
        ]
      }
      
      setMealPlans([...mealPlans, newPlan])
      setNewPlanName('')
      setNewPlanDescription('')
      setShowCreateDialog(false)
      setIsGenerating(false)
    }, 2000)
  }

  const activatePlan = (planId: string) => {
    setMealPlans(mealPlans.map(plan => ({
      ...plan,
      isActive: plan.id === planId
    })))
    setSelectedPlan(mealPlans.find(plan => plan.id === planId) || null)
  }

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return '🌅'
      case 'lunch':
        return '☀️'
      case 'dinner':
        return '🌙'
      case 'snack':
        return '🍎'
      default:
        return '🍽️'
    }
  }

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return 'bg-orange-100 text-orange-700'
      case 'lunch':
        return 'bg-blue-100 text-blue-700'
      case 'dinner':
        return 'bg-purple-100 text-purple-700'
      case 'snack':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Personalized Meal Plans</h2>
          <p className="text-gray-600">AI-generated meal plans tailored to your goals and preferences</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Generate New Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Personalized Meal Plan</DialogTitle>
              <DialogDescription>
                Our AI will generate a meal plan based on your goals and preferences.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="plan-name">Plan Name</Label>
                <Input
                  id="plan-name"
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                  placeholder="e.g., Muscle Building Plan"
                />
              </div>
              <div>
                <Label htmlFor="plan-description">Description (Optional)</Label>
                <Textarea
                  id="plan-description"
                  value={newPlanDescription}
                  onChange={(e) => setNewPlanDescription(e.target.value)}
                  placeholder="Describe your goals..."
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="target-protein">Target Protein (g)</Label>
                  <Input
                    id="target-protein"
                    type="number"
                    value={targetProtein}
                    onChange={(e) => setTargetProtein(parseInt(e.target.value) || 150)}
                  />
                </div>
                <div>
                  <Label htmlFor="target-calories">Target Calories</Label>
                  <Input
                    id="target-calories"
                    type="number"
                    value={targetCalories}
                    onChange={(e) => setTargetCalories(parseInt(e.target.value) || 2000)}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={generatePersonalizedPlan} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <ChefHat className="mr-2 h-4 w-4" />
                      Generate Plan
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Plan Selector */}
      {mealPlans.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {mealPlans.map((plan) => (
            <Button
              key={plan.id}
              variant={plan.isActive ? "default" : "outline"}
              size="sm"
              onClick={() => activatePlan(plan.id)}
              className="flex items-center gap-2"
            >
              {plan.name}
              {plan.isActive && <CheckCircle className="h-4 w-4" />}
            </Button>
          ))}
        </div>
      )}

      {/* Selected Plan Details */}
      {selectedPlan && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5" />
                  {selectedPlan.name}
                  {selectedPlan.isActive && (
                    <Badge variant="default" className="text-xs">
                      Active
                    </Badge>
                  )}
                </CardTitle>
                {selectedPlan.description && (
                  <CardDescription>{selectedPlan.description}</CardDescription>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Plan Overview */}
              <div>
                <h4 className="font-semibold mb-4">Daily Targets</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedPlan.targetProtein}g
                      </div>
                      <div className="text-sm text-gray-500">Protein Goal</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedPlan.targetCalories}
                      </div>
                      <div className="text-sm text-gray-500">Calories</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Nutritional Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Protein:</span>
                      <span className="font-medium text-green-600">
                        {selectedPlan.meals.reduce((sum, meal) => sum + meal.protein, 0)}g
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Calories:</span>
                      <span className="font-medium text-blue-600">
                        {selectedPlan.meals.reduce((sum, meal) => sum + meal.calories, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Meals per Day:</span>
                      <span className="font-medium">{selectedPlan.meals.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meal Schedule */}
              <div>
                <h4 className="font-semibold mb-4">Today's Meals</h4>
                <div className="space-y-3">
                  {selectedPlan.meals.map((meal) => (
                    <div key={meal.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{getMealTypeIcon(meal.mealType)}</div>
                        <div>
                          <div className="font-medium">{meal.name}</div>
                          <Badge className={`text-xs ${getMealTypeColor(meal.mealType)}`}>
                            {meal.mealType}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-600">{meal.protein}g</div>
                        <div className="text-sm text-gray-500">{meal.calories} cal</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-700 dark:text-green-300">
                      Protein Efficiency
                    </span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-300">
                    This plan provides {Math.round((selectedPlan.meals.reduce((sum, meal) => sum + meal.protein, 0) / selectedPlan.targetProtein) * 100)}% 
                    of your daily protein goal with optimal meal timing.
                  </p>
                </div>
              </div>
            </div>

            {/* Smart Suggestions */}
            <div className="mt-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                AI Suggestions for This Plan
              </h4>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="font-medium text-blue-700 dark:text-blue-300 mb-1">
                    Hydration Reminder
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Drink 8-10 glasses of water daily to support protein metabolism
                  </p>
                </div>
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="font-medium text-orange-700 dark:text-orange-300 mb-1">
                    Timing Optimization
                  </div>
                  <p className="text-sm text-orange-600 dark:text-orange-400">
                    Consume protein within 30 minutes after workouts for best results
                  </p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="font-medium text-purple-700 dark:text-purple-300 mb-1">
                    Supplement Option
                  </div>
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    Consider BCAA supplements if training intensity is high
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {mealPlans.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <ChefHat className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No Meal Plans Yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first personalized meal plan to start tracking your nutrition goals.
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Generate Meal Plan
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}