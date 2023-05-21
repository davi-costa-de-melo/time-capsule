import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function memoriesRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (req) => {
    await req.jwtVerify()
  })

  app.get('/', async (req) => {
    const memories = await prisma.memory.findMany({
      where: {
        userId: req.user.sub,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 115).concat('...'),
      }
    })
  })

  app.get('/:id', async (req, rep) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(req.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (memory.userId !== req.user.sub && !memory.isPublic) {
      return rep.status(401).send()
    }

    return { memory }
  })

  app.post('/', async (req, rep) => {
    const bodySchema = z.object({
      coverUrl: z.string(),
      content: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { coverUrl, content, isPublic } = bodySchema.parse(req.body)

    const memory = await prisma.memory.create({
      data: {
        userId: req.user.sub,
        coverUrl,
        content,
        isPublic,
      },
    })

    return rep.status(201).send(memory)
  })

  app.put('/:id', async (req, rep) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(req.params)

    const bodySchema = z.object({
      coverUrl: z.string(),
      content: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { coverUrl, content, isPublic } = bodySchema.parse(req.body)

    let memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (memory.userId !== req.user.sub) {
      return rep.status(401).send()
    }

    memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        coverUrl,
        content,
        isPublic,
      },
    })

    return memory
  })

  app.delete('/:id', async (req, rep) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(req.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (memory.userId !== req.user.sub) {
      return rep.status(401).send()
    }

    await prisma.memory.delete({
      where: {
        id,
      },
    })

    return rep.status(204).send()
  })
}
