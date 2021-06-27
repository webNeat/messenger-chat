import {Message} from '../messages/types'
import {ContextStorage} from '../storages/types'
import {WebhookEvent, MessagingItem} from '../events/types'

export type BotConfig = {
  accessToken: string
  verifyToken: string
  initialContext: any
  storage: ContextStorage
  handle: (entry: ChatEntry) => Message | undefined | Promise<Message | undefined>
  send: (accessToken: string, data: any) => Promise<any>
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
}
