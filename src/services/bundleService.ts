import api from './api.js'

export interface BundlePromo {
  type: string
  value: string
  has_code: boolean
  code: string | null
}

export interface BundleGym {
  id: number
  name: string
}

export interface BundlePackage {
  id: number
  name: string
  description: string | null
  membership_duration_in_days: number
  pt_sessions: number
  price: string
  gym: BundleGym
  promos: BundlePromo[]
}

export async function getBundlePackages(params: Record<string, unknown> = {}): Promise<BundlePackage[]> {
  const { data } = await api.get('/bundle-packages', { params })
  if (!data.success) throw new Error(data.message ?? 'Failed to load bundle packages')
  return data.data as BundlePackage[]
}

export default { getBundlePackages }
