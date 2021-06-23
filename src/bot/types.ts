import {WebhookEvent, PostbackEvent, MessageEvent} from '../events'
import {Message, MessageBuilder} from '../messages'
import {ContextStorage} from '../storages'

export type BotConfig = {
  accessToken: string
  verifyToken: string
  initialContext: any
  steps: Record<string, ChatStep>
  storage: ContextStorage
  send: (accessToken: string, data: any) => Promise<void>
}

export interface Bot {
  on(name: string, step: ChatStep): void
  verify(query: VerificationQuery): string
  handle(event: WebhookEvent): Promise<void>
}

export type VerificationQuery = {
  'hub.mode': string
  'hub.challenge': string
  'hub.verify_token': string
}

export type ChatStep = {
  send: (context: any) => Promise<MessageBuilder<Message>>
  listen: (entry: ChatEntry) => Promise<string | void>
}

export type ChatEntry = {
  context: any
  setContext: (value: Record<string, any>) => Promise<void>
  message?: MessageEvent
  postback?: PostbackEvent
}

export type ChatState = {
  step: string
  context: any
}
