import {
  AttachmentMessage,
  Button,
  CallButton,
  EmailQuickReply,
  GamePlayButton,
  GenericElement,
  LoginButton,
  LogoutButton,
  MediaElement,
  PhoneQuickReply,
  PostbackButton,
  QuickReply,
  TextMessage,
  TextQuickReply,
  UrlButton,
} from './types'

export function text(content: string, quickReplies?: QuickReply[]): TextMessage {
  return {text: content, quick_replies: quickReplies}
}

export function image(url: string, quickReplies?: QuickReply[]): AttachmentMessage {
  return {attachment: {type: 'image', payload: {url}}, quick_replies: quickReplies}
}

export function audio(url: string, quickReplies?: QuickReply[]): AttachmentMessage {
  return {attachment: {type: 'audio', payload: {url}}, quick_replies: quickReplies}
}

export function video(url: string, quickReplies?: QuickReply[]): AttachmentMessage {
  return {attachment: {type: 'video', payload: {url}}, quick_replies: quickReplies}
}

export function file(url: string, quickReplies?: QuickReply[]): AttachmentMessage {
  return {attachment: {type: 'file', payload: {url}}, quick_replies: quickReplies}
}

export function media(...elements: MediaElement[]): AttachmentMessage {
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'media',
        elements,
      },
    },
  }
}

export function buttons(title: string, btns: Button[]): AttachmentMessage {
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text: title,
        buttons: btns,
      },
    },
  }
}

export function generic(...elements: GenericElement[]): AttachmentMessage {
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements,
      },
    },
  }
}

export function textReply(title: string, payload?: string): TextQuickReply {
  return {content_type: 'text', title, payload: payload || title}
}

export function emailReply(): EmailQuickReply {
  return {content_type: 'user_email'}
}

export function phoneReply(): PhoneQuickReply {
  return {content_type: 'user_phone_number'}
}

export function mediaImage(url: string, button: Button): MediaElement {
  return {type: 'image', url, buttons: [button]}
}

export function mediaVideo(url: string, button: Button): MediaElement {
  return {type: 'video', url, buttons: [button]}
}

export function card(
  title: string,
  subtitle?: string,
  imageUrl?: string,
  btns?: Button[]
): GenericElement {
  return {title, subtitle, image_url: imageUrl, buttons: btns}
}

export function urlButton(title: string, url: string): UrlButton {
  return {type: 'web_url', title, url}
}

export function postbackButton(title: string, payload?: string): PostbackButton {
  return {type: 'postback', title, payload: payload || title}
}

export function callButton(title: string, payload: string): CallButton {
  return {type: 'phone_number', title, payload}
}

export function loginButton(callbackUrl: string): LoginButton {
  return {type: 'account_link', url: callbackUrl}
}

export function logoutButton(): LogoutButton {
  return {type: 'account_unlink'}
}

export function gameButton(
  title: string,
  payload?: string,
  playerId?: string,
  contextId?: string
): GamePlayButton {
  return {
    type: 'game_play',
    title,
    payload,
    game_metadata: {player_id: playerId, context_id: contextId},
  }
}
