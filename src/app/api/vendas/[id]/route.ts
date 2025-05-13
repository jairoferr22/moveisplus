import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const venda = await prisma.venda.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        cliente: true,
        vendedor: true,
        items: {
          include: {
            produto: true,
          },
        },
      },
    })
    if (!venda) {
      return NextResponse.json(
        { error: 'Venda not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(venda)
  } catch (error) {
    console.error('Error fetching venda:', error)
    return NextResponse.json(
      { error: 'Error fetching venda' },
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
    const venda = await prisma.venda.update({
      where: { id: parseInt(params.id) },
      data: {
        status: data.status,
      },
    })
    return NextResponse.json(venda)
  } catch (error) {
    console.error('Error updating venda:', error)
    return NextResponse.json(
      { error: 'Error updating venda' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Primeiro, recupera os itens da venda para devolver ao estoque
    const venda = await prisma.venda.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        items: true,
      },
    })

    if (!venda) {
      return NextResponse.json(
        { error: 'Venda not found' },
        { status: 404 }
      )
    }

    // Devolve os produtos ao estoque
    await Promise.all(
      venda.items.map((item) =>
        prisma.produto.update({
          where: { id: item.produtoId },
          data: {
            estoque: {
              increment: item.quantidade,
            },
          },
        })
      )
    )

    // Deleta a venda
    await prisma.venda.delete({
      where: { id: parseInt(params.id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting venda:', error)
    return NextResponse.json(
      { error: 'Error deleting venda' },
      { status: 500 }
    )
  }
} 