import { apiClient } from './client'

export interface ImagePlaygroundBootstrap {
  playground_url: string
  api_key: string
  model: string
  api_mode: string
}

export async function getImagePlaygroundBootstrap(): Promise<ImagePlaygroundBootstrap> {
  const { data } = await apiClient.get<ImagePlaygroundBootstrap>('/user/image-playground/bootstrap')
  return data
}
