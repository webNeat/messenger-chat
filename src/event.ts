import {WebhookAttachment, WebhookEntry, WebhookEvent, WebhookMessage, WebhookPostback} from './types'

type EventData = {
  senderId?: string
  recipientId?: string
  timestamp: number
  items: Array<EventItem>
}
type EventItem = EventMessageItem | EventPostbackItem
type EventMessageItem = {timestamp: number; message: WebhookMessage}
type EventPostbackItem = {timestamp: number; postback: WebhookPostback}

export function event(data?: EventData) {
  return new Event(data || {timestamp: Date.now(), items: []})
}

let nexttMessageId = 1

class Event {
  constructor(private data: EventData) {}

  from(senderId: string) {
    return this.clone({senderId})
  }

  to(recipientId: string) {
    return this.clone({recipientId})
  }

  at(timestamp: number) {
    return this.clone({timestamp})
  }

  postback(title: string, payload: string) {
    const mid = `m-${nexttMessageId++}`
    const item = {timestamp: this.data.timestamp, postback: {mid, title, payload}}
    return this.clone({items: [...this.data.items, item]})
  }

  text(content: string) {
    return this.message({text: content})
  }

  quickReply(text: string, payload: string) {
    return this.message({text, quick_reply: {payload}})
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

  get(): WebhookEvent {
    const {recipientId, senderId, items} = this.data
    if (recipientId === undefined) throw `The recipient is missing, use .to(recipientId) to set the recipient`
    if (senderId === undefined) throw `The sender is missing, use .from(senderId) to set the sender`
    if (items.length === 0) throw `The message to send with the event is missing`

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
      } as WebhookEntry
    })
    return {object: 'page', entry}
  }

  private message(data: Omit<WebhookMessage, 'mid'>) {
    const mid = `m-${nexttMessageId++}`
    const item = {timestamp: this.data.timestamp, message: {mid, ...data}}
    return this.clone({items: [...this.data.items, item]})
  }

  private attachment(data: WebhookAttachment) {
    return this.message({attachments: [data]})
  }

  private clone(data: Partial<EventData>) {
    return event({...this.data, ...data})
  }
}
