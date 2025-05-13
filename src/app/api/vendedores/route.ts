import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const vendedores = await prisma.vendedor.findMany({
      orderBy: { nome: 'asc' },
    })
    return NextResponse.json(vendedores)
  } catch (error) {
    console.error('Error fetching vendedores:', error)
    return NextResponse.json(
      { error: 'Error fetching vendedores' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const vendedor = await prisma.vendedor.create({
      data: {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        comissao: parseFloat(data.comissao),
        metaMensal: parseFloat(data.metaMensal),
        status: data.status,
      },
    })
    return NextResponse.json(vendedor)
  } catch (error) {
    console.error('Error creating vendedor:', error)
    return NextResponse.json(
      { error: 'Error creating vendedor' },
      { status: 500 }
    )
  }
} 