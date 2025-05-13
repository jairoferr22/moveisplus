import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const produto = await prisma.produto.findUnique({
      where: { id: parseInt(params.id) },
    })
    if (!produto) {
      return NextResponse.json(
        { error: 'Produto not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(produto)
  } catch (error) {
    console.error('Error fetching produto:', error)
    return NextResponse.json(
      { error: 'Error fetching produto' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const produto = await prisma.produto.update({
      where: { id: parseInt(params.id) },
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
    console.error('Error updating produto:', error)
    return NextResponse.json(
      { error: 'Error updating produto' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.produto.delete({
      where: { id: parseInt(params.id) },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting produto:', error)
    return NextResponse.json(
      { error: 'Error deleting produto' },
      { status: 500 }
    )
  }
} 