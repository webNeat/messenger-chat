export type WebhookEvent = {
  object: 'page'
  entry: EventEntry[]
}

export type EventEntry = {
  id: string // page id
  time: number
  messaging: [MessagingItem]
}

export type MessagingItem = {
  sender: {id: string}
  recipient: {id: string}
  timestamp: number
  message?: MessageEvent
  postback?: PostbackEvent
}

export type PostbackEvent = {
  mid: string
  title: string
  payload: string
  referral?: object
}

export type MessageEvent = {
  mid: string
  text?: string
  attachments?: EventAttachment[]
  quick_reply?: {
    payload: string
  }
  reply_to?: {
    mid: string
  }
  referral?: object
}

export type EventAttachment =
  | EventAudioAttachment
  | EventFileAttachment
  | EventImageAttachment
  | EventLocationAttachment
  | EventVideoAttachment
  | EventFallbackAttachment

export type EventAudioAttachment = {
  type: 'audio'
  payload: {
    url: string
  }
}

export type EventFileAttachment = {
  type: 'file'
  payload: {
    url: string
  }
}

export type EventImageAttachment = {
  type: 'image'
  payload: {
    url: string
    sticker_id?: string
  }
}

export type EventLocationAttachment = {
  type: 'location'
  payload: {
    url: string
    coordinates: {
      lat: number
      long: number
    }
  }
}

export type EventVideoAttachment = {
  type: 'video'
  payload: {
    url: string
  }
}

export type EventFallbackAttachment = {
  type: 'fallback'
  payload: {
    title: string
    url: string
  }
}
