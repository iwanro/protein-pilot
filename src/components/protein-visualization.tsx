'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eye, Download, ZoomIn, ZoomOut } from 'lucide-react'

interface ProteinVisualizationProps {
  originalSequence: string
  optimizedSequence: string
  mutations: string[]
  title?: string
}

export default function ProteinVisualization({ 
  originalSequence, 
  optimizedSequence, 
  mutations, 
  title = "Protein Structure Visualization" 
}: ProteinVisualizationProps) {
  
  // Parse mutations to get position and change info
  const parsedMutations = mutations.map(mutation => {
    const match = mutation.match(/^([A-Z])(\d+)([A-Z])$/)
    if (match) {
      return {
        original: match[1],
        position: parseInt(match[2]) - 1, // Convert to 0-based index
        new: match[3],
        mutation
      }
    }
    return null
  }).filter(Boolean)

  // Generate colors for amino acids based on properties
  const getAminoAcidColor = (aminoAcid: string) => {
    const colors: Record<string, string> = {
      // Hydrophobic
      'A': 'bg-gray-400', 'V': 'bg-gray-400', 'L': 'bg-gray-400', 'I': 'bg-gray-400', 
      'M': 'bg-gray-400', 'F': 'bg-gray-400', 'W': 'bg-gray-400', 'Y': 'bg-gray-400',
      // Polar
      'S': 'bg-green-400', 'T': 'bg-green-400', 'N': 'bg-green-400', 'Q': 'bg-green-400',
      // Positive
      'K': 'bg-blue-400', 'R': 'bg-blue-400', 'H': 'bg-blue-400',
      // Negative
      'D': 'bg-red-400', 'E': 'bg-red-400',
      // Special cases
      'C': 'bg-yellow-400', 'G': 'bg-purple-400', 'P': 'bg-pink-400'
    }
    return colors[aminoAcid.toUpperCase()] || 'bg-gray-300'
  }

  // Render sequence as colored blocks
  const renderSequence = (sequence: string, highlightMutations = false) => {
    return (
      <div className="flex flex-wrap gap-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        {sequence.split('').map((aminoAcid, index) => {
          const isMutated = highlightMutations && 
            parsedMutations.some(mut => mut && mut.position === index)
          
          return (
            <div
              key={index}
              className={`
                w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white
                ${getAminoAcidColor(aminoAcid)}
                ${isMutated ? 'ring-2 ring-yellow-400 ring-offset-1' : ''}
                transition-all duration-200 hover:scale-110 cursor-pointer
              `}
              title={`${aminoAcid}${index + 1}${isMutated ? ' (mutated)' : ''}`}
            >
              {aminoAcid}
            </div>
          )
        })}
      </div>
    )
  }

  // Generate a simple secondary structure prediction (mock)
  const generateSecondaryStructure = (sequence: string) => {
    return sequence.split('').map(() => {
      const rand = Math.random()
      if (rand < 0.3) return 'H' // Alpha helix
      if (rand < 0.5) return 'E' // Beta sheet
      return 'C' // Coil
    }).join('')
  }

  const secondaryStructure = generateSecondaryStructure(optimizedSequence)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>
          Interactive visualization of protein sequence and predicted structure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sequence" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sequence">Sequence View</TabsTrigger>
            <TabsTrigger value="structure">Structure View</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sequence" className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Optimized Sequence</h4>
              {renderSequence(optimizedSequence, true)}
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm">
                  <ZoomIn className="mr-2 h-4 w-4" />
                  Zoom In
                </Button>
                <Button variant="outline" size="sm">
                  <ZoomOut className="mr-2 h-4 w-4" />
                  Zoom Out
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Legend</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-400 rounded"></div>
                  <span>Hydrophobic</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-400 rounded"></div>
                  <span>Polar</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-400 rounded"></div>
                  <span>Positive</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-400 rounded"></div>
                  <span>Negative</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                  <span>Cysteine</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 ring-2 ring-yellow-400 rounded"></div>
                  <span>Mutated</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="structure" className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Predicted Secondary Structure</h4>
              <div className="flex flex-wrap gap-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {secondaryStructure.split('').map((structure, index) => (
                  <div
                    key={index}
                    className={`
                      w-6 h-6 rounded flex items-center justify-center text-xs font-bold
                      ${structure === 'H' ? 'bg-blue-500 text-white' : 
                        structure === 'E' ? 'bg-red-500 text-white' : 
                        'bg-gray-300 text-gray-700'}
                    `}
                    title={`Position ${index + 1}: ${
                      structure === 'H' ? 'Alpha helix' : 
                      structure === 'E' ? 'Beta sheet' : 'Coil'
                    }`}
                  >
                    {structure}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Structure Legend</h4>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span>Alpha Helix (H)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>Beta Sheet (E)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <span>Coil (C)</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="comparison" className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Sequence Comparison</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium mb-2">Original</h5>
                  {renderSequence(originalSequence)}
                </div>
                <div>
                  <h5 className="text-sm font-medium mb-2">Optimized</h5>
                  {renderSequence(optimizedSequence, true)}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Detected Mutations</h4>
              <div className="space-y-2">
                {parsedMutations.map((mutation, index) => (
                  <Badge key={index} variant="outline" className="mr-2">
                    {mutation?.mutation}
                  </Badge>
                ))}
                {parsedMutations.length === 0 && (
                  <p className="text-sm text-gray-500">No mutations detected</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}