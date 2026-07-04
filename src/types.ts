export interface User {
  id: number
  name: string
  email: string
  role: 'client' | 'creator' | 'admin'
  phone: string | null
  avatar_url: string | null
  bio: string | null
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  slug: string
  name: string
  description: string | null
  icon_url: string | null
  sort_order: number
  active: boolean
  products_count?: number
  products?: Product[]
  created_at: string
  updated_at: string
}

export interface Product {
  id: number
  category_id: number
  category?: Category
  slug: string
  name: string
  short_description: string
  long_description: string
  base_price: string | number
  delivery_days: number
  revisions_included: number
  deliverables: string[] | null
  thumbnail_url: string | null
  status: 'draft' | 'published' | 'unpublished'
  featured: boolean
  order_count: number
  avg_rating: string | number
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Paginated<T> {
  current_page: number
  data: T[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: { url: string | null; label: string; active: boolean }[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export interface AuthResponse {
  user: User
  token: string
}
