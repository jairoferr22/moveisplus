import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const produtos = await prisma.produto.findMany({
      orderBy: { nome: 'asc' },
    })
    return NextResponse.json(produtos)
  } catch (error) {
    console.error('Error fetching produtos:', error)
    return NextResponse.json(
      { error: 'Error fetching produtos' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const produto = await prisma.produto.create({
      data: {
        nome: data.nome,
        categoria: data.categoria,
        preco: parseFloat(data.preco),
        estoque: parseInt(data.estoque),
        fornecedor: data.fornecedor,
      },
    })
    return NextResponse.json(produto)
  } catch (error) {
    console.error('Error creating produto:', error)
    return NextResponse.json(
      { error: 'Error creating produto' },
      { status: 500 }
    )
  }
} 