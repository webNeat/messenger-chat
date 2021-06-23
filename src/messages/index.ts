import {MessageBuilder} from './MessageBuilder'
import { AttachmentMessage, TextMessage } from './types'

export {MessageBuilder}
export {Message, MessageReply} from './types'

export function text(content: string) {
  return new MessageBuilder<TextMessage>({text: content})
}

export function image(url: string) {
  return new MessageBuilder<AttachmentMessage>({attachment: {type: 'image', payload: {url}}})
}

export function audio(url: string) {
  return new MessageBuilder<AttachmentMessage>({attachment: {type: 'audio', payload: {url}}})
}

export function video(url: string) {
  return new MessageBuilder<AttachmentMessage>({attachment: {type: 'video', payload: {url}}})
}

export function file(url: string) {
  return new MessageBuilder<AttachmentMessage>({attachment: {type: 'file', payload: {url}}})
}
