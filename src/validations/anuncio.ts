import { z } from 'zod'

export const criarAnuncioSchema = z.object({
  titulo: z.string().min(5, 'Título deve ter pelo menos 5 caracteres').max(100),
  descricao: z.string().min(10).max(1000),
  preco: z.number().positive('Preço deve ser positivo'),
  cidade: z.string().min(2),
  estado: z.string().length(2),
  telefone_contato: z.string().regex(/^\d{11}$/, 'Telefone inválido'),
})

export type CriarAnuncioInput = z.infer<typeof criarAnuncioSchema>
