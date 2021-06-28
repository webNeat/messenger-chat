import {AxiosInstance} from 'axios'
import {Message} from '../messages/types'
import {ContextStorage} from '../storages/types'
import {WebhookEvent, MessagingItem} from '../events/types'

type OptionalOneOrMany<T> = T | T[] | undefined

export type BotConfig = {
  accessToken: string
  verifyToken: string
  initialContext: any
  storage: ContextStorage
  handle: (entry: ChatEntry) => OptionalOneOrMany<Message> | Promise<OptionalOneOrMany<Message>>
  axiosInstance: AxiosInstance
}

export interface Bot {
  verify(query: VerificationQuery): string
  handle(event: WebhookEvent): Promise<void>
}

export type VerificationQuery = {
  'hub.mode': string
  'hub.challenge': string
  'hub.verify_token': string
}

export type ChatEntry = MessagingItem & {
  context: any
  setContext: (value: Record<string, any>) => void
  getUserFields: () => Promise<UserFields>
}

export type UserFields = {
  id: string
  first_name: string
  last_name: string
  profile_pic: string
}
