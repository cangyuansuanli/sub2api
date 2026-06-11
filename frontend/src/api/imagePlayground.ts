import { apiClient } from './client'

export interface ImagePlaygroundBootstrap {
  playground_url: string
  model: string
  api_mode: string
  stream_images?: boolean
  stream_partial_images?: number
}

export async function getImagePlaygroundBootstrap(): Promise<ImagePlaygroundBootstrap> {
  const { data } = await apiClient.get<ImagePlaygroundBootstrap>('/user/image-playground/bootstrap')
  return data
}
