import {MessageBuilder} from './MessageBuilder'
import {AttachmentMessage} from './types'

export class FileMessageBuilder extends MessageBuilder<AttachmentMessage> {
  constructor(type: 'image' | 'video' | 'audio' | 'file', url: string) {
    super({attachment: {type, payload: {url}}})
  }
  protected validate() {}
}
