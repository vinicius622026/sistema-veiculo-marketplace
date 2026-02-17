import { z } from 'zod'

export const criarVeiculoSchema = z.object({
  marca: z.string().min(2, 'Marca deve ter pelo menos 2 caracteres'),
  modelo: z.string().min(2, 'Modelo deve ter pelo menos 2 caracteres'),
  ano: z.number().min(1900).max(new Date().getFullYear() + 1),
  valor: z.number().positive('Valor deve ser positivo'),
  km: z.number().min(0),
  combustivel: z.enum(['Gasolina', 'Diesel', 'Flex', 'Elétrico']),
  cor: z.string().min(2),
  placa: z.string().regex(/^[A-Z]{3}-[0-9]{4}$/, 'Placa inválida'),
  chassi: z.string().length(17, 'Chassi deve ter 17 caracteres'),
  descricao: z.string().optional(),
})

export type CriarVeiculoInput = z.infer<typeof criarVeiculoSchema>
