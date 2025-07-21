import { z } from "zod"

export const paymentGatewaySchema = z.object({
  login_id: z
    .string(),
  transaction_key: z
    .string()
})

export type PaymentGatewayFormData = z.infer<typeof paymentGatewaySchema>
