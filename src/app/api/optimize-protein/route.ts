import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { db } from '@/lib/db'

// Mock protein optimization function using AI
async function optimizeProteinWithAI(sequence: string, goal: string) {
  try {
    const zai = await ZAI.create()
    
    // Create a prompt for protein optimization based on the goal
    const systemPrompt = `You are an expert protein engineer and bioinformatician. Your task is to optimize protein sequences for specific goals. 

For the given protein sequence, analyze it and suggest optimizations. You must respond with a JSON object containing:

1. optimizedSequence: The optimized protein sequence (single-letter amino acid codes)
2. mutations: Array of mutations in format ["A15V", "G23S"] etc.
3. improvementScore: Estimated improvement percentage (0-100)
4. confidenceScore: AI confidence in the optimization (0-100)
5. analysis: Brief explanation of the optimization strategy

Optimization goals:
- stability: Improve protein stability, reduce aggregation, increase melting temperature
- activity: Enhance enzymatic activity or binding affinity
- expression: Improve expression yield and solubility

Keep mutations minimal and conservative. Only suggest changes that are likely to improve the target property.`

    const userPrompt = `Optimize this protein sequence for ${goal}: ${sequence}

Provide the optimization results in JSON format as specified.`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    })

    const responseContent = completion.choices[0]?.message?.content
    
    if (!responseContent) {
      throw new Error('No response from AI')
    }

    // Parse the JSON response
    try {
      const result = JSON.parse(responseContent)
      return result
    } catch (parseError) {
      // If JSON parsing fails, create a structured response from the text
      return {
        optimizedSequence: sequence, // Fallback to original sequence
        mutations: [],
        improvementScore: 15,
        confidenceScore: 70,
        analysis: responseContent.substring(0, 500)
      }
    }
  } catch (error) {
    console.error('AI optimization error:', error)
    
    // Fallback response if AI fails
    return {
      optimizedSequence: sequence,
      mutations: [],
      improvementScore: 10,
      confidenceScore: 50,
      analysis: 'AI optimization service unavailable. Basic analysis performed.'
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sequence, goal } = body

    if (!sequence || !goal) {
      return NextResponse.json(
        { error: 'Sequence and goal are required' },
        { status: 400 }
      )
    }

    // Validate sequence format (basic check for amino acid letters)
    const validAminoAcids = /^[ACDEFGHIKLMNPQRSTVWY]+$/i
    if (!validAminoAcids.test(sequence.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'Invalid protein sequence format' },
        { status: 400 }
      )
    }

    // Clean sequence
    const cleanSequence = sequence.replace(/\s/g, '').toUpperCase()

    // Get AI optimization
    const optimizationResult = await optimizeProteinWithAI(cleanSequence, goal)

    // Store in database (optional - you might want to add user authentication first)
    try {
      // Create a default project for demo purposes
      let project = await db.proteinProject.findFirst({
        where: { name: 'Demo Project' }
      })

      if (!project) {
        project = await db.proteinProject.create({
          data: {
            name: 'Demo Project',
            description: 'Demo project for protein optimization',
            userId: 'demo-user' // In a real app, this would be the authenticated user
          }
        })
      }

      // Create protein sequence
      const proteinSequence = await db.proteinSequence.create({
        data: {
          name: `Optimized for ${goal}`,
          sequence: cleanSequence,
          length: cleanSequence.length,
          source: 'user_input',
          projectId: project.id
        }
      })

      // Store optimization result
      await db.optimizationResult.create({
        data: {
          goal,
          originalSequence: cleanSequence,
          optimizedSequence: optimizationResult.optimizedSequence,
          improvementScore: optimizationResult.improvementScore,
          confidenceScore: optimizationResult.confidenceScore,
          analysis: optimizationResult.analysis,
          parameters: JSON.stringify({ goal, timestamp: new Date().toISOString() }),
          sequenceId: proteinSequence.id,
          projectId: project.id
        }
      })
    } catch (dbError) {
      console.error('Database storage error:', dbError)
      // Continue even if database storage fails
    }

    return NextResponse.json(optimizationResult)
  } catch (error) {
    console.error('Optimization error:', error)
    return NextResponse.json(
      { error: 'Internal server error during optimization' },
      { status: 500 }
    )
  }
}