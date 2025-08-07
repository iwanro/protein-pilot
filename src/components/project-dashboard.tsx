'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FolderOpen, 
  Plus, 
  Dna, 
  Zap, 
  Calendar, 
  TrendingUp,
  Eye,
  Trash2,
  Edit
} from 'lucide-react'

interface Project {
  id: string
  name: string
  description?: string
  createdAt: string
  sequences: any[]
  optimizations: any[]
  _count: {
    sequences: number
    optimizations: number
  }
}

export default function ProjectDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDescription, setNewProjectDescription] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const createProject = async () => {
    if (!newProjectName.trim()) return

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProjectName,
          description: newProjectDescription,
        }),
      })

      if (response.ok) {
        await fetchProjects()
        setShowCreateDialog(false)
        setNewProjectName('')
        setNewProjectDescription('')
      }
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getOptimizationScore = (project: Project) => {
    if (project.optimizations.length === 0) return 0
    const avgScore = project.optimizations.reduce((sum, opt) => sum + opt.improvementScore, 0) / project.optimizations.length
    return Math.round(avgScore)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Project Dashboard</h2>
          <p className="text-gray-600">Manage your protein optimization projects</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Create a new project to organize your protein optimization work.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="My Protein Project"
                />
              </div>
              <div>
                <Label htmlFor="project-description">Description (Optional)</Label>
                <Textarea
                  id="project-description"
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="Describe your project goals..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={createProject} disabled={!newProjectName.trim()}>
                  Create Project
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-2xl font-bold">{projects.length}</p>
                </div>
                <FolderOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Protein Sequences</p>
                  <p className="text-2xl font-bold">
                    {projects.reduce((sum, p) => sum + p._count.sequences, 0)}
                  </p>
                </div>
                <Dna className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Optimizations</p>
                  <p className="text-2xl font-bold">
                    {projects.reduce((sum, p) => sum + p._count.optimizations, 0)}
                  </p>
                </div>
                <Zap className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Improvement</p>
                  <p className="text-2xl font-bold">
                    {Math.round(
                      projects.reduce((sum, p) => sum + getOptimizationScore(p), 0) / projects.length
                    )}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Projects List */}
      {projects.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-4">Create your first protein optimization project to get started.</p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FolderOpen className="h-5 w-5" />
                      {project.name}
                    </CardTitle>
                    {project.description && (
                      <CardDescription>{project.description}</CardDescription>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
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
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="sequences">Sequences</TabsTrigger>
                    <TabsTrigger value="optimizations">Optimizations</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {project._count.sequences}
                        </div>
                        <div className="text-sm text-gray-500">Sequences</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {project._count.optimizations}
                        </div>
                        <div className="text-sm text-gray-500">Optimizations</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {getOptimizationScore(project)}%
                        </div>
                        <div className="text-sm text-gray-500">Avg. Improvement</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">
                          {formatDate(project.createdAt)}
                        </div>
                        <div className="text-sm text-gray-500">Created</div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="sequences">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Length</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead>Created</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {project.sequences.map((sequence) => (
                          <TableRow key={sequence.id}>
                            <TableCell className="font-medium">{sequence.name || 'Unnamed'}</TableCell>
                            <TableCell>{sequence.length} aa</TableCell>
                            <TableCell>
                              <Badge variant="outline">{sequence.source}</Badge>
                            </TableCell>
                            <TableCell>{formatDate(sequence.createdAt)}</TableCell>
                          </TableRow>
                        ))}
                        {project.sequences.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-gray-500">
                              No sequences in this project
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  <TabsContent value="optimizations">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Goal</TableHead>
                          <TableHead>Improvement</TableHead>
                          <TableHead>Confidence</TableHead>
                          <TableHead>Mutations</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {project.optimizations.map((optimization) => (
                          <TableRow key={optimization.id}>
                            <TableCell>
                              <Badge>{optimization.goal}</Badge>
                            </TableCell>
                            <TableCell>
                              <span className="text-green-600 font-medium">
                                +{optimization.improvementScore}%
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-blue-600 font-medium">
                                {optimization.confidenceScore}%
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {optimization.mutations.slice(0, 3).map((mutation: any) => (
                                  <Badge key={mutation.id} variant="secondary" className="text-xs">
                                    {mutation.mutation}
                                  </Badge>
                                ))}
                                {optimization.mutations.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{optimization.mutations.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{formatDate(optimization.createdAt)}</TableCell>
                          </TableRow>
                        ))}
                        {project.optimizations.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-gray-500">
                              No optimizations in this project
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}