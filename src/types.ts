export type WebhookEvent = {
  object: 'page'
  entry: WebhookEntry[]
}

export type WebhookEntry = {
  id: string // page id
  time: number
  messaging: [WebhookMessageItem | WebhookPostbackItem]
}

export type WebhookPostbackItem = WebhookBasicMessagingItem & {postback: WebhookPostback}
export type WebhookMessageItem = WebhookBasicMessagingItem & {message: WebhookMessage}

export type WebhookBasicMessagingItem = {
  sender: {id: string}
  recipient: {id: string}
  timestamp: number
}

export type WebhookPostback = {
  mid: string
  title: string
  payload: string
  referral?: object
}

export type WebhookMessage = {
  mid: string
  text?: string
  attachments?: WebhookAttachment[]
  quick_reply?: {
    payload: string
  }
  reply_to?: {
    mid: string
  }
  referral?: object
}

export type WebhookAttachment =
  | WebhookAudioAttachment
  | WebhookFileAttachment
  | WebhookImageAttachment
  | WebhookLocationAttachment
  | WebhookVideoAttachment
  | WebhookFallbackAttachment

export type WebhookAudioAttachment = {
  type: 'audio'
  payload: {
    url: string
  }
}

export type WebhookFileAttachment = {
  type: 'file'
  payload: {
    url: string
  }
}

export type WebhookImageAttachment = {
  type: 'image'
  payload: {
    url: string
    sticker_id?: string
  }
}

export type WebhookLocationAttachment = {
  type: 'location'
  payload: {
    url: string
    coordinates: {
      lat: number
      long: number
    }
  }
}

export type WebhookVideoAttachment = {
  type: 'video'
  payload: {
    url: string
  }
}

export type WebhookFallbackAttachment = {
  type: 'fallback'
  payload: {
    title: string
    url: string
  }
}

export type SendRequest = SendSenderAction | SendResponse | SendTag

export type SendSenderAction = {
  recipient: {id: string}
  sender_action: 'typing_on' | 'typing_off' | 'mark_seen'
}

export type SendTag = {
  messaging_type: 'MESSAGE_TAG'
  recipient: {id: string}
  tag: 'CONFIRMED_EVENT_UPDATE' | 'POST_PURCHASE_UPDATE' | 'ACCOUNT_UPDATE' | 'HUMAN_AGENT' | 'CUSTOMER_FEEDBACK'
  notification_type?: 'REGULAR' | 'SILENT_PUSH' | 'NO_PUSH'
}

export type SendResponse = {
  messaging_type: 'RESPONSE' | 'UPDATE'
  recipient: {id: string}
  notification_type?: 'REGULAR' | 'SILENT_PUSH' | 'NO_PUSH'
  message: SendTextMessage | SendAttachmentMessage
}

export type SendBasicMessage = {
  quick_replies: SendQuickReply[]
  metadata: string
}

export type SendQuickReply = SendEmailQuickReply | SendPhoneQuickReply | SendTextQuickReply

export type SendEmailQuickReply = {
  content_type: 'user_email'
}

export type SendPhoneQuickReply = {
  content_type: 'user_phone_number'
}

export type SendTextQuickReply = {
  content_type: 'text'
  title: string
  payload: string
  image_url?: string
}

export type SendTextMessage = SendBasicMessage & {
  text: string
}

export type SendAttachmentMessage = SendBasicMessage & {
  attachment: SendFileAttachment | SendTemplateAttachment
}

export type SendFileAttachment = {
  type: 'image' | 'video' | 'audio' | 'file'
  payload: {url: string; is_reusable?: boolean} | {attachment_id: string}
}

export type SendTemplateAttachment = {
  type: 'template'
  payload: SendMediaTemplate | SendButtonTemplate | SendGenericTemplate
}

export type SendMediaTemplate = {
  template_type: 'media'
  sharable?: boolean
  elements: SendMediaElement[]
}

export type SendButtonTemplate = {
  template_type: 'button'
  text: string
  buttons: SendButton[] // 3 buttons max
}

export type SendGenericTemplate = {
  template_type: 'generic'
  image_aspect_ratio?: 'horizontal' | 'square'
  elements: SendGenericElement[] // 10 elements max
}

export type SendMediaElement = SendMediaElementWithUrl | SendMediaElementWithAttachment

export type SendMediaElementBasic = {
  type: 'image' | 'video'
  buttons: [SendButton]
}
export type SendMediaElementWithUrl = SendMediaElementBasic & {
  url: string
}
export type SendMediaElementWithAttachment = SendMediaElementBasic & {
  attachment_id: string
}

export type SendGenericElement = {
  title: string
  subtitle?: string
  image_url?: string
  buttons?: SendButton[] // 3 buttons max
  default_action?: Omit<SendUrlButton, 'title'>
}

export type SendButton =
  | SendUrlButton
  | SendPostbackButton
  | SendCallButton
  | SendLoginButton
  | SendLogoutButton
  | SendGamePlayButton

export type SendUrlButton = {
  type: 'web_url'
  title: string
  url: string
}

export type SendPostbackButton = {
  type: 'postback'
  title: string
  payload: string
}

export type SendCallButton = {
  type: 'phone_number'
  title: string
  payload: string // ex: '+123456789'
}

export type SendLoginButton = {
  type: 'account_link'
  url: string // Authentication callback URL
}

export type SendLogoutButton = {
  type: 'account_unlink'
}

export type SendGamePlayButton = {
  type: 'game_play'
  title: string
  payload?: string
  game_metadata?: {
    player_id?: string
    context_id?: string
  }
}
