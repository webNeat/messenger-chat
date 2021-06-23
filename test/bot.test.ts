import {bot, event, message} from '../src'
import {Bot} from '../src/types'

describe('bot', () => {
  const evt = event()
    .from('bob')
    .to('page')
  const getStarted = evt.postback('Get started', 'get_started').get()
  let app: Bot
  let send: any
  beforeEach(() => {
    send = jest.fn()
    app = bot({accessToken: 'fake-access-token', verifyToken: 'fake-verify-token', send})
  })

  test(`simple echo bot`, async () => {
    app.on('start', {
      send: async () => message.text('Tell me something and I will send it back to you!'),
      listen: async ({message, setContext}) => {
        await setContext({text: message!.text})
        return 'echo'
      },
    })

    app.on('echo', {
      send: async ({text}) => message.text(text),
      listen: async ({message, setContext}) => {
        await setContext({text: message!.text})
      },
    })

    await app.handle(getStarted)
    expect(send).toBeCalledWith('fake-access-token', {
      messaging_type: 'RESPONSE',
      recipient: {id: 'bob'},
      message: {text: 'Tell me something and I will send it back to you!'},
    })

    await app.handle(evt.text('Yo').get())
    expect(send).toBeCalledWith('fake-access-token', {
      messaging_type: 'RESPONSE',
      recipient: {id: 'bob'},
      message: {text: 'Yo'},
    })
  })

  test(`calculator bot`, async () => {
    app.on('start', {
      send: async () =>
        message
          .text('Select an operation')
          .withQuickReply('+')
          .withQuickReply('-')
          .withQuickReply('*')
          .withQuickReply('/'),
      listen: async ({postback, setContext}) => {
        if (postback) {
          await setContext({operation: postback.payload})
          return 'args'
        }
        return 'start'
      },
    })

    app.on('args', {
      send: async ({error, operation, a}) => {
        if (error) {
          return message.text(`Your input is incorrect, try again`)
        }
        return message.text(
          `Please enter the ${
            a === undefined ? 'first' : 'second'
          } argument for operation '${operation}'`
        )
      },
      listen: async ({message, context, setContext}) => {
        if (message) {
          const x = parseFloat(message.text!)
          if (isNaN(x) || (context.operation == '/' && context.a !== undefined && x == 0)) {
            context = {...context, error: true}
          } else if (context.a === undefined) {
            context = {...context, error: false, a: x}
          } else {
            context = {...context, error: false, b: x}
          }
          await setContext(context)
          if (context.a !== undefined && context.b !== undefined) {
            return 'result'
          }
        }
        return 'args'
      },
    })

    app.on('result', {
      send: async ({operation, a, b}) => {
        let result = a + b
        if (operation == '-') result = a - b
        if (operation == '*') result = a * b
        if (operation == '/') result = a / b
        return message.text(`The result is ${result}`)
      },
      listen: async ({setContext}) => {
        setContext({})
        return 'start'
      },
    })

    await app.handle(getStarted)
    expect(send).toBeCalledWith('fake-access-token', {
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

    await app.handle(evt.postback('+').get())
    expect(send).toBeCalledWith('fake-access-token', {
      messaging_type: 'RESPONSE',
      recipient: {id: 'bob'},
      message: {text: `Please enter the first argument for operation '+'`},
    })

    await app.handle(evt.text('bla bla').get())
    expect(send).toBeCalledWith('fake-access-token', {
      messaging_type: 'RESPONSE',
      recipient: {id: 'bob'},
      message: {text: `Your input is incorrect, try again`},
    })

    await app.handle(evt.text('11').get())
    expect(send).toBeCalledWith('fake-access-token', {
      messaging_type: 'RESPONSE',
      recipient: {id: 'bob'},
      message: {text: `Please enter the second argument for operation '+'`},
    })

    await app.handle(evt.text('4').get())
    expect(send).toBeCalledWith('fake-access-token', {
      messaging_type: 'RESPONSE',
      recipient: {id: 'bob'},
      message: {text: `The result is 15`},
    })

    await app.handle(evt.text('Thanks!').get())
    expect(send).toBeCalledWith('fake-access-token', {
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
