export type Reply = SenderActionReply | MessageReply | TagReply

export type SenderActionReply = {
  recipient: {id: string}
  sender_action: 'typing_on' | 'typing_off' | 'mark_seen'
}

export type TagReply = {
  messaging_type: 'MESSAGE_TAG'
  recipient: {id: string}
  tag: 'CONFIRMED_EVENT_UPDATE' | 'POST_PURCHASE_UPDATE' | 'ACCOUNT_UPDATE' | 'HUMAN_AGENT' | 'CUSTOMER_FEEDBACK'
  notification_type?: 'REGULAR' | 'SILENT_PUSH' | 'NO_PUSH'
}

export type MessageReply = {
  messaging_type: 'RESPONSE' | 'UPDATE'
  recipient: {id: string}
  notification_type?: 'REGULAR' | 'SILENT_PUSH' | 'NO_PUSH'
  message: Message
}

export type Message = TextMessage | AttachmentMessage

export type TextMessage = {
  text: string
  metadata?: string
  quick_replies?: QuickReply[]
}

export type AttachmentMessage = {
  attachment: FileAttachment | TemplateAttachment
  metadata?: string
  quick_replies?: QuickReply[]
}

export type QuickReply = EmailQuickReply | PhoneQuickReply | TextQuickReply

export type EmailQuickReply = {
  content_type: 'user_email'
}

export type PhoneQuickReply = {
  content_type: 'user_phone_number'
}

export type TextQuickReply = {
  content_type: 'text'
  title: string
  payload: string
  image_url?: string
}

export type FileAttachment = {
  type: 'image' | 'video' | 'audio' | 'file'
  payload: {url: string; is_reusable?: boolean} | {attachment_id: string}
}

export type TemplateAttachment = {
  type: 'template'
  payload: MediaTemplate | ButtonTemplate | GenericTemplate
}

export type MediaTemplate = {
  template_type: 'media'
  sharable?: boolean
  elements: MediaElement[]
}

export type ButtonTemplate = {
  template_type: 'button'
  text: string
  buttons: Button[] // 3 buttons max
}

export type GenericTemplate = {
  template_type: 'generic'
  image_aspect_ratio?: 'horizontal' | 'square'
  elements: GenericElement[] // 10 elements max
}

export type MediaElement = UrlOrAttachment & {
  type: 'image' | 'video'
  buttons: [Button]
}

export type UrlOrAttachment = {url: string} | {attachment_id: string}

export type GenericElement = {
  title: string
  subtitle?: string
  image_url?: string
  buttons?: Button[] // 3 buttons max
  default_action?: Omit<UrlButton, 'title'>
}

export type Button = UrlButton | PostbackButton | CallButton | LoginButton | LogoutButton | GamePlayButton

export type UrlButton = {
  type: 'web_url'
  title: string
  url: string
}

export type PostbackButton = {
  type: 'postback'
  title: string
  payload: string
}

export type CallButton = {
  type: 'phone_number'
  title: string
  payload: string // ex: '+123456789'
}

export type LoginButton = {
  type: 'account_link'
  url: string // Authentication callback URL
}

export type LogoutButton = {
  type: 'account_unlink'
}

export type GamePlayButton = {
  type: 'game_play'
  title: string
  payload?: string
  game_metadata?: {
    player_id?: string
    context_id?: string
  }
}
