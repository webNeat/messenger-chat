import {Builder} from '../utils'
import {Message, QuickReply} from './types'

export class MessageBuilder<T extends Message> extends Builder<T> {
  withEmailQuickReply() {
    return this.addQuickReply({content_type: 'user_email'})
  }

  withPhoneQuickReply() {
    return this.addQuickReply({content_type: 'user_phone_number'})
  }

  withQuickReply(text: string, payload?: string) {
    return this.addQuickReply({content_type: 'text', title: text, payload: payload || text})
  }

  withMeta(metadata: string) {
    return this.clone({metadata} as Partial<T>)
  }

  protected addQuickReply(reply: QuickReply): this {
    const quick_replies = this.data.quick_replies || []
    return this.clone({quick_replies: [...quick_replies, reply]} as Partial<T>)
  }

  protected validate() {}

  protected build() {
    return this.data
  }
}
