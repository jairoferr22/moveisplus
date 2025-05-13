import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const vendedor = await prisma.vendedor.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        vendas: {
          select: {
            id: true,
            data: true,
            total: true,
            status: true,
          },
        },
      },
    })
    if (!vendedor) {
      return NextResponse.json(
        { error: 'Vendedor not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(vendedor)
  } catch (error) {
    console.error('Error fetching vendedor:', error)
    return NextResponse.json(
      { error: 'Error fetching vendedor' },
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
    const vendedor = await prisma.vendedor.update({
      where: { id: parseInt(params.id) },
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
    console.error('Error updating vendedor:', error)
    return NextResponse.json(
      { error: 'Error updating vendedor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.vendedor.delete({
      where: { id: parseInt(params.id) },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting vendedor:', error)
    return NextResponse.json(
      { error: 'Error deleting vendedor' },
      { status: 500 }
    )
  }
} 