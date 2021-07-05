import {Message} from '../messages/types'
import {BotConfig} from './types'

export async function send(config: BotConfig, recipientId: string, message: Message) {
  const {axiosInstance, accessToken} = config
  return axiosInstance.post(
    `https://graph.facebook.com/v11.0/me/messages?access_token=${accessToken}`,
    {
      messaging_type: 'RESPONSE',
      recipient: {id: recipientId},
      message,
    }
  )
}
