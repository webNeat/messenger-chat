import {BotConfig, VerificationQuery} from './types'

export function verify({verifyToken}: BotConfig, query: VerificationQuery) {
  if (query['hub.mode'] !== 'subscribe' || query['hub.verify_token'] !== verifyToken) {
    throw `The query parameters are incorrect`
  }
  return query['hub.challenge']
}
