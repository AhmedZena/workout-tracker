import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Trash2, Plus, TrendingUp, Calendar, Dumbbell, Target } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import './App.css'

function App() {
  const [workouts, setWorkouts] = useState([])
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    day: '',
    exercise: '',
    sets: '',
    reps: '',
    weight: '',
    notes: ''
  })
  const [message, setMessage] = useState({ text: '', type: '' })
  const [selectedExercise, setSelectedExercise] = useState('')

  // Load workouts from localStorage on component mount
  useEffect(() => {
    const savedWorkouts = localStorage.getItem('workouts')
    if (savedWorkouts) {
      setWorkouts(JSON.parse(savedWorkouts))
    }
  }, [])

  // Save workouts to localStorage whenever workouts change
  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts))
  }, [workouts])

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  const handleInputChange = (field, value) => {
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

  const deleteWorkout = (id) => {
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
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(w => ({
        date: w.date,
        weight: w.weight,
        sets: w.sets,
        reps: w.reps
      }))
  }

  // Get personal records
  const getPersonalRecords = () => {
    const records = {}
    workouts.forEach(workout => {
      const { exercise, weight } = workout
      if (!records[exercise] || weight > records[exercise].weight) {
        records[exercise] = workout
      }
    })
    return Object.values(records)
  }

  const personalRecords = getPersonalRecords()
  const progressData = getProgressData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Dumbbell className="h-10 w-10 text-purple-400" />
            Workout Tracker Pro
          </h1>
          <p className="text-slate-300">Track your progress and achieve your fitness goals</p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`p-4 rounded-lg text-center font-medium ${
            message.type === 'error' 
              ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
              : 'bg-green-500/20 text-green-300 border border-green-500/30'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add Workout Form */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Workout
              </CardTitle>
              <CardDescription className="text-slate-400">
                Log your workout details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Date</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Day</label>
                  <Select value={formData.day} onValueChange={(value) => handleInputChange('day', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
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
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Sets</label>
                  <Input
                    type="number"
                    placeholder="3"
                    value={formData.sets}
                    onChange={(e) => handleInputChange('sets', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Reps</label>
                  <Input
                    placeholder="8-12"
                    value={formData.reps}
                    onChange={(e) => handleInputChange('reps', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
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
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Notes (Optional)</label>
                <Textarea
                  placeholder="How did it feel? Any observations?"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={3}
                />
              </div>

              <Button onClick={addWorkout} className="w-full bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Workout
              </Button>
            </CardContent>
          </Card>

          {/* Personal Records */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5" />
                Personal Records
              </CardTitle>
              <CardDescription className="text-slate-400">
                Your best performances
              </CardDescription>
            </CardHeader>
            <CardContent>
              {personalRecords.length > 0 ? (
                <div className="space-y-3">
                  {personalRecords.slice(0, 5).map((record) => (
                    <div key={record.id} className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{record.exercise}</p>
                        <p className="text-sm text-slate-400">{record.date}</p>
                      </div>
                      <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                        {record.weight}kg
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-8">No workouts recorded yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Progress Chart */}
        {uniqueExercises.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Progress Tracking
              </CardTitle>
              <CardDescription className="text-slate-400">
                Visualize your strength gains over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select value={selectedExercise} onValueChange={setSelectedExercise}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white max-w-xs">
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
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F3F4F6'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#A855F7" 
                        strokeWidth={3}
                        dot={{ fill: '#A855F7', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : selectedExercise ? (
                <p className="text-slate-400 text-center py-8">No data available for {selectedExercise}</p>
              ) : (
                <p className="text-slate-400 text-center py-8">Select an exercise to view progress</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Workout History */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Workout History
              </CardTitle>
              <CardDescription className="text-slate-400">
                All your recorded workouts
              </CardDescription>
            </div>
            {workouts.length > 0 && (
              <Button 
                onClick={clearAllWorkouts} 
                variant="destructive" 
                size="sm"
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {workouts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left p-3 text-slate-300 font-medium">Date</th>
                      <th className="text-left p-3 text-slate-300 font-medium">Day</th>
                      <th className="text-left p-3 text-slate-300 font-medium">Exercise</th>
                      <th className="text-left p-3 text-slate-300 font-medium">Sets</th>
                      <th className="text-left p-3 text-slate-300 font-medium">Reps</th>
                      <th className="text-left p-3 text-slate-300 font-medium">Weight</th>
                      <th className="text-left p-3 text-slate-300 font-medium">Notes</th>
                      <th className="text-left p-3 text-slate-300 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workouts.slice().reverse().map((workout) => (
                      <tr key={workout.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="p-3 text-white">{workout.date}</td>
                        <td className="p-3">
                          <Badge variant="outline" className="border-purple-500/50 text-purple-300">
                            {workout.day}
                          </Badge>
                        </td>
                        <td className="p-3 text-white font-medium">{workout.exercise}</td>
                        <td className="p-3 text-slate-300">{workout.sets}</td>
                        <td className="p-3 text-slate-300">{workout.reps}</td>
                        <td className="p-3 text-slate-300">{workout.weight}kg</td>
                        <td className="p-3 text-slate-400 max-w-xs truncate">{workout.notes || '-'}</td>
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
            ) : (
              <div className="text-center py-12">
                <Dumbbell className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">No workouts recorded yet</p>
                <p className="text-slate-500">Start by adding your first workout above!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App

