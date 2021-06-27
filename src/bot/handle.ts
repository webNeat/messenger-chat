import {EventEntry, WebhookEvent} from '../events/types'
import {Reply} from '../messages/types'
import {BotConfig} from './types'

export async function handle(config: BotConfig, event: WebhookEvent) {
  if (event.object !== 'page') {
    throw `Unknown event.object value '${event.object}', it should be 'page'`
  }
  await Promise.all(event.entry.map(e => handleEntry(config, e)))
}

async function handleEntry(config: BotConfig, entry: EventEntry) {
  const messaging = entry.messaging[0]
  const {recipient, sender} = messaging
  const {storage, initialContext} = config
  const contextKey = `${sender.id}-${recipient.id}`
  const context = (await storage.get(contextKey)) || initialContext
  const setContext = (value: any) => storage.set(contextKey, value)
  const getUserFields = () => loadUserFields(config, sender)
  let response = config.handle({...messaging, context, setContext, getUserFields})
  if (response instanceof Promise) {
    response = await response
  }
  if (response) {
    await sendReply(config, {
      messaging_type: 'RESPONSE',
      recipient: sender,
      message: response,
    })
  }
}

async function sendReply({axiosInstance, accessToken}: BotConfig, reply: Reply) {
  return axiosInstance.post(
    `https://graph.facebook.com/v11.0/me/messages?access_token=${accessToken}`,
    reply
  )
}

async function loadUserFields({axiosInstance, accessToken}: BotConfig, sender: {id: string}) {
  const res = await axiosInstance.get(
    `https://graph.facebook.com/v11.0/${sender.id}?access_token=${accessToken}&fields=id,first_name,last_name,profile_pic`
  )
  return res.data
}
