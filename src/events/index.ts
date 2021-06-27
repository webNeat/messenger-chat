import {EventBuilder, EventBuilderData} from './EventBuilder'

export function event(data?: EventBuilderData) {
  return new EventBuilder(data || {timestamp: Date.now(), items: []})
}
