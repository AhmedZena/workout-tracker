'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Trash2, Plus, TrendingUp, Calendar, Dumbbell, Target } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Workout {
  id: number
  date: string
  day: string
  exercise: string
  sets: number
  reps: number
  weight: number
  notes: string
}

interface WorkoutForm {
  id?: number
  date: string
  day: string
  exercise: string
  sets: string
  reps: string
  weight: string
  notes: string
}

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // Test mobile console functionality
  useEffect(() => {
    console.log('🚀 Workout Tracker Pro loaded successfully!')
    console.log('📱 Mobile Console is active - you can see this on mobile devices')
    console.log('💪 Ready to track your workouts!')
    
    // Test different console methods
    console.info('ℹ️ This is an info message')
    console.warn('⚠️ This is a warning message')
    console.error('❌ This is an error message (for testing)')
    
    // Test console.table
    console.table([
      { exercise: 'Bench Press', sets: 3, reps: 8, weight: 80 },
      { exercise: 'Squats', sets: 4, reps: 10, weight: 100 },
      { exercise: 'Deadlifts', sets: 3, reps: 5, weight: 120 }
    ])
  }, [])

  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [formData, setFormData] = useState<WorkoutForm>({
    date: new Date().toISOString().split('T')[0],
    day: '',
    exercise: '',
    sets: '',
    reps: '',
    weight: '',
    notes: ''
  })
  const [message, setMessage] = useState<{ text: string; type: string }>({ text: '', type: '' })
  const [selectedExercise, setSelectedExercise] = useState<string>('')

  // Load workouts from localStorage on component mount
  useEffect(() => {
    if (session?.user?.id) {
      try {
        const savedWorkouts = localStorage.getItem(`workouts-${session.user.id}`)
        if (savedWorkouts) {
          setWorkouts(JSON.parse(savedWorkouts))
        }
      } catch (error) {
        console.error('Failed to load workouts from localStorage:', error)
      }
    }
  }, [session])

  // Save workouts to localStorage whenever workouts change
  useEffect(() => {
    if (session?.user?.id) {
      try {
        localStorage.setItem(`workouts-${session.user.id}`, JSON.stringify(workouts))
      } catch (error) {
        console.error('Failed to save workouts to localStorage:', error)
      }
    }
  }, [workouts, session])

  const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addWorkout = () => {
    if (!formData.date || !formData.day || !formData.exercise || !formData.sets || !formData.reps || !formData.weight) {
      showMessage('Please fill out all required fields.', 'error')
      return
    }

    const newWorkout = {
      id: Date.now(),
      ...formData,
      sets: parseInt(formData.sets),
      reps: parseInt(formData.reps), // Ensure reps is parsed as integer
      weight: parseFloat(formData.weight)
    }

    setWorkouts(prev => [...prev, newWorkout])
    setFormData({
      date: new Date().toISOString().split('T')[0],
      day: '',
      exercise: '',
      sets: '',
      reps: '',
      weight: '',
      notes: ''
    })
    showMessage('Workout added successfully!')
  }

  const deleteWorkout = (id: number) => {
    setWorkouts(prev => prev.filter(workout => workout.id !== id))
    showMessage('Workout deleted successfully.')
  }

  const clearAllWorkouts = () => {
    if (window.confirm('Are you sure you want to clear all workouts? This cannot be undone.')) {
      setWorkouts([])
      showMessage('All workouts have been cleared.')
    }
  }

  // Get unique exercises for progress tracking
  const uniqueExercises = [...new Set(workouts.map(w => w.exercise))]

  // Get progress data for selected exercise
  const getProgressData = () => {
    if (!selectedExercise) return []
    
    return workouts
      .filter(w => w.exercise === selectedExercise)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(w => ({
        date: w.date,
        weight: w.weight,
        sets: w.sets,
        reps: w.reps
      }))
  }

  // Calculate 1RM using Epley formula: 1RM = weight * (1 + reps/30)
  const calculateOneRepMax = (weight: number, reps: number): number => {
    if (reps <= 0) return 0
    if (reps === 1) return weight
    return weight * (1 + reps / 30)
  }

  // Get personal records based on calculated 1RM
  const getPersonalRecords = (): Workout[] => {
    const records: Record<string, Workout> = {}
    workouts.forEach(workout => {
      const { exercise, weight, reps } = workout
      const oneRepMax = calculateOneRepMax(weight, reps)
      
      if (!records[exercise] || oneRepMax > calculateOneRepMax(records[exercise].weight, records[exercise].reps)) {
        records[exercise] = workout
      }
    })
    return Object.values(records)
  }

  const personalRecords = getPersonalRecords()
  const progressData = getProgressData()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <p className="text-white text-xl">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center py-4 sm:py-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2 sm:gap-3">
            <Dumbbell className="h-6 w-6 sm:h-8 w-8 md:h-10 md:w-10 text-purple-400" />
            <span className="break-words">Workout Tracker Pro</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">Track your progress and achieve your fitness goals</p>
          {session && (
            <div className="mt-4">
              <p className="text-slate-400 text-sm sm:text-base">Welcome, {session.user.name}!</p>
              <Button onClick={() => signOut()} className="mt-2 bg-red-600 hover:bg-red-700 text-sm sm:text-base">
                Sign Out
              </Button>
            </div>
          )}
        </div>

        {/* Message */}
        {message.text && (
          <div className={`p-3 sm:p-4 rounded-lg text-center font-medium text-sm sm:text-base ${
            message.type === 'error' 
              ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
              : 'bg-green-500/20 text-green-300 border border-green-500/30'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Add Workout Form */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-white flex items-center gap-2 text-lg sm:text-xl">
                <Plus className="h-4 w-4 sm:h-5 w-5" />
                Add New Workout
              </CardTitle>
              <CardDescription className="text-slate-400 text-sm">
                Log your workout details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Date</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Day</label>
                  <Select value={formData.day} onValueChange={(value) => handleInputChange('day', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white text-sm">
                      <SelectValue placeholder="Select Day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Day 1">Day 1</SelectItem>
                      <SelectItem value="Day 2">Day 2</SelectItem>
                      <SelectItem value="Day 3">Day 3</SelectItem>
                      <SelectItem value="Day 4">Day 4</SelectItem>
                      <SelectItem value="Rest Day">Rest Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Exercise Name</label>
                <Input
                  placeholder="e.g., Bench Press, Squats"
                  value={formData.exercise}
                  onChange={(e) => handleInputChange('exercise', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Sets</label>
                  <Input
                    type="number"
                    placeholder="3"
                    value={formData.sets}
                    onChange={(e) => handleInputChange('sets', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Reps</label>
                  <Input
                    type="number"
                    placeholder="8-12"
                    value={formData.reps}
                    onChange={(e) => handleInputChange('reps', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Weight (kg)</label>
                  <Input
                    type="number"
                    step="0.5"
                    placeholder="60"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Notes (Optional)</label>
                <Textarea
                  placeholder="How did it feel? Any observations?"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white text-sm"
                  rows={3}
                />
              </div>

              <Button onClick={addWorkout} className="w-full bg-purple-600 hover:bg-purple-700 text-sm sm:text-base">
                <Plus className="h-4 w-4 mr-2" />
                Add Workout
              </Button>
            </CardContent>
          </Card>

          {/* Personal Records */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-white flex items-center gap-2 text-lg sm:text-xl">
                <Target className="h-4 w-4 sm:h-5 w-5" />
                Personal Records
              </CardTitle>
              <CardDescription className="text-slate-400 text-sm">
                Your best performances
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {personalRecords.length > 0 ? (
                <div className="space-y-3">
                  {personalRecords.slice(0, 5).map((record) => (
                    <div key={record.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-slate-700/50 rounded-lg gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-white text-sm sm:text-base truncate">{record.exercise}</p>
                        <p className="text-xs sm:text-sm text-slate-400">{record.date}</p>
                      </div>
                      <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 text-xs sm:text-sm self-start sm:self-center">
                        {record.weight}kg × {record.reps} ({Math.round(calculateOneRepMax(record.weight, record.reps))}kg 1RM)
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-8 text-sm sm:text-base">No workouts recorded yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Progress Chart */}
        {uniqueExercises.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-white flex items-center gap-2 text-lg sm:text-xl">
                <TrendingUp className="h-4 w-4 sm:h-5 w-5" />
                Progress Tracking
              </CardTitle>
              <CardDescription className="text-slate-400 text-sm">
                Visualize your strength gains over time
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="mb-4">
                <Select value={selectedExercise} onValueChange={setSelectedExercise}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-full sm:max-w-xs text-sm">
                    <SelectValue placeholder="Select exercise to track" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueExercises.map(exercise => (
                      <SelectItem key={exercise} value={exercise}>{exercise}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {progressData.length > 0 ? (
                <div className="h-48 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9CA3AF" 
                        fontSize={12}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        stroke="#9CA3AF" 
                        fontSize={12}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F3F4F6',
                          fontSize: '12px'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#A855F7" 
                        strokeWidth={2}
                        dot={{ fill: '#A855F7', strokeWidth: 2, r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : selectedExercise ? (
                <p className="text-slate-400 text-center py-8 text-sm sm:text-base">No data available for {selectedExercise}</p>
              ) : (
                <p className="text-slate-400 text-center py-8 text-sm sm:text-base">Select an exercise to view progress</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Workout History */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6">
            <div>
              <CardTitle className="text-white flex items-center gap-2 text-lg sm:text-xl">
                <Calendar className="h-4 w-4 sm:h-5 w-5" />
                Workout History
              </CardTitle>
              <CardDescription className="text-slate-400 text-sm">
                All your recorded workouts
              </CardDescription>
            </div>
            {workouts.length > 0 && (
              <Button 
                onClick={clearAllWorkouts} 
                variant="destructive" 
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-xs sm:text-sm self-start sm:self-center"
              >
                <Trash2 className="h-3 w-3 sm:h-4 w-4 mr-1 sm:mr-2" />
                Clear All
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {workouts.length > 0 ? (
              <div className="space-y-4 sm:hidden">
                {/* Mobile Card Layout */}
                {workouts.slice().reverse().map((workout) => (
                  <div key={workout.id} className="bg-slate-700/50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-medium text-sm">{workout.exercise}</p>
                        <p className="text-slate-400 text-xs">{workout.date}</p>
                      </div>
                      <Button
                        onClick={() => deleteWorkout(workout.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400">Day: </span>
                        <Badge variant="outline" className="border-purple-500/50 text-purple-300 text-xs">
                          {workout.day}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-slate-400">Sets: </span>
                        <span className="text-slate-300">{workout.sets}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Reps: </span>
                        <span className="text-slate-300">{workout.reps}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Weight: </span>
                        <span className="text-slate-300">{workout.weight}kg</span>
                      </div>
                    </div>
                    {workout.notes && (
                      <div>
                        <span className="text-slate-400 text-xs">Notes: </span>
                        <p className="text-slate-300 text-xs mt-1">{workout.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Dumbbell className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">No workouts recorded yet</p>
                <p className="text-slate-500">Start by adding your first workout above!</p>
              </div>
            )}
            
            {/* Desktop Table Layout */}
            {workouts.length > 0 && (
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left p-3 text-slate-300 font-medium text-sm">Date</th>
                      <th className="text-left p-3 text-slate-300 font-medium text-sm">Day</th>
                      <th className="text-left p-3 text-slate-300 font-medium text-sm">Exercise</th>
                      <th className="text-left p-3 text-slate-300 font-medium text-sm">Sets</th>
                      <th className="text-left p-3 text-slate-300 font-medium text-sm">Reps</th>
                      <th className="text-left p-3 text-slate-300 font-medium text-sm">Weight</th>
                      <th className="text-left p-3 text-slate-300 font-medium text-sm">Notes</th>
                      <th className="text-left p-3 text-slate-300 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workouts.slice().reverse().map((workout) => (
                      <tr key={workout.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="p-3 text-white text-sm">{workout.date}</td>
                        <td className="p-3">
                          <Badge variant="outline" className="border-purple-500/50 text-purple-300 text-xs">
                            {workout.day}
                          </Badge>
                        </td>
                        <td className="p-3 text-white font-medium text-sm">{workout.exercise}</td>
                        <td className="p-3 text-slate-300 text-sm">{workout.sets}</td>
                        <td className="p-3 text-slate-300 text-sm">{workout.reps}</td>
                        <td className="p-3 text-slate-300 text-sm">{workout.weight}kg</td>
                        <td className="p-3 text-slate-400 max-w-xs truncate text-sm">{workout.notes || '-'}</td>
                        <td className="p-3">
                          <Button
                            onClick={() => deleteWorkout(workout.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

