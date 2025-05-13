import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const vendas = await prisma.venda.findMany({
      include: {
        cliente: {
          select: {
            nome: true,
            email: true,
          },
        },
        vendedor: {
          select: {
            nome: true,
            email: true,
          },
        },
        items: {
          include: {
            produto: {
              select: {
                nome: true,
                preco: true,
              },
            },
          },
        },
      },
      orderBy: { data: 'desc' },
    })
    return NextResponse.json(vendas)
  } catch (error) {
    console.error('Error fetching vendas:', error)
    return NextResponse.json(
      { error: 'Error fetching vendas' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Calcula o total da venda
    const total = data.items.reduce(
      (acc: number, item: any) => acc + item.quantidade * item.precoUnit,
      0
    )

    // Cria a venda com seus itens
    const venda = await prisma.venda.create({
      data: {
        clienteId: parseInt(data.clienteId),
        vendedorId: parseInt(data.vendedorId),
        total,
        status: data.status,
        items: {
          create: data.items.map((item: any) => ({
            produtoId: parseInt(item.produtoId),
            quantidade: parseInt(item.quantidade),
            precoUnit: parseFloat(item.precoUnit),
          })),
        },
      },
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

    // Atualiza o estoque dos produtos
    await Promise.all(
      data.items.map((item: any) =>
        prisma.produto.update({
          where: { id: parseInt(item.produtoId) },
          data: {
            estoque: {
              decrement: parseInt(item.quantidade),
            },
          },
        })
      )
    )

    return NextResponse.json(venda)
  } catch (error) {
    console.error('Error creating venda:', error)
    return NextResponse.json(
      { error: 'Error creating venda' },
      { status: 500 }
    )
  }
} 