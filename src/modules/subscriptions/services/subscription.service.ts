import httpClient from '@/core/http/client'

export interface Plan {
  slug: string
  name: string
  description: string
  price_brl: number
  duration_days: number
}

export interface CheckoutPayload {
  plan_slug: string
  name: string
  email: string
  cellphone: string
  tax_id: string
}

export interface SubscriptionStatus {
  status: 'active' | 'inactive'
  plan: string | null
  expires_at: string | null
}

export const SubscriptionService = {
  /**
   * Lista planos disponíveis (Público)
   */
  async getPlans(): Promise<Plan[]> {
    const { data } = await httpClient.get<Plan[]>('subscriptions/plans')
    return data
  },

  /**
   * Inicia processo de checkout (Autenticado)
   */
  async createCheckout(payload: CheckoutPayload): Promise<{ checkout_url: string }> {
    const { data } = await httpClient.post<{ checkout_url: string }>('subscriptions/checkout', payload)
    return data
  },

  /**
   * Verifica status da assinatura do usuário logado (Autenticado)
   */
  async getMySubscription(): Promise<SubscriptionStatus> {
    const { data } = await httpClient.get<SubscriptionStatus>('subscriptions/me')
    return data
  }
}
