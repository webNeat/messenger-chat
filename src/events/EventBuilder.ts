import {Builder} from '../utils'
import {EventAttachment, EventEntry, MessageEvent, PostbackEvent, WebhookEvent} from './types'

export type EventBuilderData = {
  senderId?: string
  recipientId?: string
  timestamp: number
  items: Array<MessageItem | PostbackItem>
}
type MessageItem = {timestamp: number; message: MessageEvent}
type PostbackItem = {timestamp: number; postback: PostbackEvent}

let nextFakeMessageId = 1

export class EventBuilder extends Builder<WebhookEvent, EventBuilderData> {
  from(senderId: string) {
    return this.clone({senderId})
  }

  to(recipientId: string) {
    return this.clone({recipientId})
  }

  at(timestamp: number) {
    return this.clone({timestamp})
  }

  postback(title: string, payload?: string) {
    const mid = `m-${nextFakeMessageId++}`
    const item = {timestamp: this.data.timestamp, postback: {mid, title, payload: payload || title}}
    return this.clone({items: [...this.data.items, item]})
  }

  text(content: string) {
    return this.message({text: content})
  }

  quickReply(text: string, payload?: string) {
    return this.message({text, quick_reply: {payload: payload || text}})
  }

  replyTo(id: string, text: string) {
    return this.message({text, reply_to: {mid: id}})
  }

  image(url: string) {
    return this.attachment({type: 'image', payload: {url}})
  }

  audio(url: string) {
    return this.attachment({type: 'audio', payload: {url}})
  }

  video(url: string) {
    return this.attachment({type: 'video', payload: {url}})
  }

  file(url: string) {
    return this.attachment({type: 'file', payload: {url}})
  }

  location(lat: number, long: number, url: string) {
    return this.attachment({type: 'location', payload: {url, coordinates: {lat, long}}})
  }

  protected validate() {
    const {recipientId, senderId, items} = this.data
    if (recipientId === undefined)
      throw `The recipient is missing, use .to(recipientId) to set the recipient`
    if (senderId === undefined) throw `The sender is missing, use .from(senderId) to set the sender`
    if (items.length === 0) throw `The message to send with the event is missing`
  }

  protected build() {
    const {recipientId, senderId, items} = this.data
    const entry = items.map(({timestamp, ...data}) => {
      return {
        id: recipientId,
        time: timestamp,
        messaging: [
          {
            timestamp,
            sender: {id: senderId},
            recipient: {id: recipientId},
            ...data,
          },
        ],
      } as EventEntry
    })
    return {object: 'page', entry} as WebhookEvent
  }

  private message(data: Omit<MessageEvent, 'mid'>) {
    const mid = `m-${nextFakeMessageId++}`
    const item = {timestamp: this.data.timestamp, message: {mid, ...data}}
    return this.clone({items: [...this.data.items, item]})
  }

  private attachment(data: EventAttachment) {
    return this.message({attachments: [data]})
  }
}
