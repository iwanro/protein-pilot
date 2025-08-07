import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // For demo purposes, we'll get all projects
    // In a real app, you would filter by authenticated user
    const projects = await db.proteinProject.findMany({
      include: {
        sequences: {
          include: {
            optimizations: {
              include: {
                mutations: true
              },
              orderBy: {
                createdAt: 'desc'
              }
            }
          }
        },
        _count: {
          select: {
            sequences: true,
            optimizations: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      )
    }

    // For demo purposes, using a demo user ID
    // In a real app, this would be the authenticated user's ID
    const project = await db.proteinProject.create({
      data: {
        name,
        description,
        userId: 'demo-user'
      },
      include: {
        sequences: true,
        optimizations: true
      }
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}