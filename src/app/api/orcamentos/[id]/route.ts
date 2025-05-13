import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const orcamento = await prisma.orcamento.findUnique({
      where: { id: params.id },
      include: {
        cliente: true,
        itens: {
          include: {
            materiais: {
              include: {
                material: true
              }
            }
          }
        }
      }
    })

    if (!orcamento) {
      return NextResponse.json(
        { error: 'Orçamento não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(orcamento)
  } catch (error) {
    console.error('Error fetching orcamento:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const data = await request.json()

    // Primeiro, excluir todos os materiais e itens existentes
    await prisma.orcamentoMaterial.deleteMany({
      where: {
        item: {
          orcamentoId: params.id
        }
      }
    })

    await prisma.orcamentoItem.deleteMany({
      where: {
        orcamentoId: params.id
      }
    })

    // Depois, atualizar o orçamento com os novos dados
    const orcamento = await prisma.orcamento.update({
      where: { id: params.id },
      data: {
        numero: data.numero,
        data: new Date(data.data),
        status: data.status,
        observacoes: data.observacoes,
        clienteId: data.clienteId,
        itens: {
          create: data.itens.map((item: any) => ({
            descricao: item.descricao,
            quantidade: item.quantidade,
            valorUnitario: item.valorUnitario,
            materiais: {
              create: item.materiais.map((material: any) => ({
                quantidade: material.quantidade,
                materialId: material.id
              }))
            }
          }))
        }
      },
      include: {
        cliente: true,
        itens: {
          include: {
            materiais: {
              include: {
                material: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(orcamento)
  } catch (error) {
    console.error('Error updating orcamento:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    // Primeiro, excluir todos os materiais e itens
    await prisma.orcamentoMaterial.deleteMany({
      where: {
        item: {
          orcamentoId: params.id
        }
      }
    })

    await prisma.orcamentoItem.deleteMany({
      where: {
        orcamentoId: params.id
      }
    })

    // Depois, excluir o orçamento
    await prisma.orcamento.delete({
      where: { id: params.id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting orcamento:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 