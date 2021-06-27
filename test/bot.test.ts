import {BotConfig, ChatEntry} from '../src/types'
import {bot, event, text, textReply} from '../src'
import {AxiosInstance} from 'axios'

describe('bot', () => {
  const evt = event()
    .from('bob')
    .to('page')
  const getStarted = evt.postback('Get started', 'get_started').get()
  const makeBot = (config: Partial<BotConfig>) =>
    bot({
      accessToken: 'fake-access-token',
      verifyToken: 'fake-verify-token',
      ...config,
    })

  test(`simple echo bot`, async () => {
    const axiosMock = ({post: jest.fn()} as any) as AxiosInstance
    const sendUrl = `https://graph.facebook.com/v11.0/me/messages?access_token=fake-access-token`
    const handle = ({message}: ChatEntry) => {
      if (message) {
        return text(`You said: "${message.text}"`)
      }
      return text(`Send me a message and I will send it back to you!`)
    }
    const app = makeBot({axiosInstance: axiosMock, handle})

    await app.handle(getStarted)
    expect(axiosMock.post).toBeCalledWith(sendUrl, {
      messaging_type: 'RESPONSE',
      recipient: {id: 'bob'},
      message: {
        text: 'Send me a message and I will send it back to you!',
        quick_replies: undefined,
      },
    })

    await app.handle(evt.text('Yo').get())
    expect(axiosMock.post).toBeCalledWith(sendUrl, {
      messaging_type: 'RESPONSE',
      recipient: {id: 'bob'},
      message: {text: 'You said: "Yo"', quick_replies: undefined},
    })
  })

  test(`calculator bot`, async () => {
    const axiosMock = ({post: jest.fn()} as any) as AxiosInstance
    const sendUrl = `https://graph.facebook.com/v11.0/me/messages?access_token=fake-access-token`
    const initialContext = {step: 'start'}
    const handle = async ({context, setContext, message}: ChatEntry) => {
      if (context.step === 'start') {
        await setContext({step: 'operation'})
        return text(`Select an operation`, [
          textReply('+'),
          textReply('-'),
          textReply('*'),
          textReply('/'),
        ])
      }

      if (context.step === 'operation' && message?.quick_reply?.payload) {
        const operation = message?.quick_reply?.payload
        await setContext({operation, args: [], step: 'args'})
        return text(`Please enter the first argument for operation '${operation}'`)
      }

      const {operation, args} = context
      if (context.step === 'args' && message?.text) {
        const value = parseFloat(message.text)
        if (isNaN(value) || (operation === '/' && value === 0))
          return text(`Your input is incorrect, try again`)
        if (args.length == 0) {
          setContext({...context, args: [value]})
          return text(`Please enter the second argument for operation '${context.operation}'`)
        }
        if (args.length == 1) {
          let result = args[0] + value
          if (operation == '-') result = args[0] - value
          if (operation == '*') result = args[0] * value
          if (operation == '/') result = args[0] / value
          setContext({step: 'start'})
          return text(`The result is ${result}`)
        }
      }
      return undefined
    }
    const app = makeBot({axiosInstance: axiosMock, handle, initialContext})

    await app.handle(getStarted)
    expect(axiosMock.post).toBeCalledWith(sendUrl, {
      messaging_type: 'RESPONSE',
      recipient: {id: 'bob'},
      message: {
        text: 'Select an operation',
        quick_replies: [
          {content_type: 'text', title: '+', payload: '+'},
          {content_type: 'text', title: '-', payload: '-'},
          {content_type: 'text', title: '*', payload: '*'},
          {content_type: 'text', title: '/', payload: '/'},
        ],
      },
    })

    await app.handle(evt.quickReply('+').get())
    expect(axiosMock.post).toBeCalledWith(sendUrl, {
      messaging_type: 'RESPONSE',
      recipient: {id: 'bob'},
      message: {text: `Please enter the first argument for operation '+'`},
    })

    await app.handle(evt.text('bla bla').get())
    expect(axiosMock.post).toBeCalledWith(sendUrl, {
      messaging_type: 'RESPONSE',
      recipient: {id: 'bob'},
      message: {text: `Your input is incorrect, try again`},
    })

    await app.handle(evt.text('11').get())
    expect(axiosMock.post).toBeCalledWith(sendUrl, {
      messaging_type: 'RESPONSE',
      recipient: {id: 'bob'},
      message: {text: `Please enter the second argument for operation '+'`},
    })

    await app.handle(evt.text('4').get())
    expect(axiosMock.post).toBeCalledWith(sendUrl, {
      messaging_type: 'RESPONSE',
      recipient: {id: 'bob'},
      message: {text: `The result is 15`},
    })

    await app.handle(evt.text('Thanks!').get())
    expect(axiosMock.post).toBeCalledWith(sendUrl, {
      messaging_type: 'RESPONSE',
      recipient: {id: 'bob'},
      message: {
        text: 'Select an operation',
        quick_replies: [
          {content_type: 'text', title: '+', payload: '+'},
          {content_type: 'text', title: '-', payload: '-'},
          {content_type: 'text', title: '*', payload: '*'},
          {content_type: 'text', title: '/', payload: '/'},
        ],
      },
    })
  })
})
