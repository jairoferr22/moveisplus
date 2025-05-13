import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const orcamentos = await prisma.orcamento.findMany({
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
      },
      orderBy: { data: 'desc' }
    })
    return NextResponse.json(orcamentos)
  } catch (error) {
    console.error('Error fetching orcamentos:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Criar o orçamento com seus itens e materiais
    const orcamento = await prisma.orcamento.create({
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
    console.error('Error creating orcamento:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 