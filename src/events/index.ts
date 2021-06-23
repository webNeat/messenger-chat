import {EventBuilder, EventBuilderData} from './EventBuilder'

export {WebhookEvent, EventEntry, PostbackEvent, MessageEvent} from './types'

export function event(data?: EventBuilderData) {
  return new EventBuilder(data || {timestamp: Date.now(), items: []})
}
