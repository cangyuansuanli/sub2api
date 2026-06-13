import { apiClient } from './client'

export interface InfiniteCanvasBootstrap {
  canvas_url: string
  api_base_url: string
}

export async function getInfiniteCanvasBootstrap(): Promise<InfiniteCanvasBootstrap> {
  const { data } = await apiClient.get<InfiniteCanvasBootstrap>('/user/infinite-canvas/bootstrap')
  return data
}
