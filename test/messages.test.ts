import {message} from '../src'

describe('messages', () => {
  test(`text message`, () => {
    expect(message.text('Yo').get()).toEqual({
      text: 'Yo',
    })
  })

  test(`text message with quick replies`, () => {
    expect(
      message
        .text('Yo')
        .withEmailQuickReply()
        .withPhoneQuickReply()
        .withQuickReply('foo')
        .withQuickReply('bar')
        .get()
    ).toEqual({
      text: 'Yo',
      quick_replies: [
        {
          content_type: 'user_email',
        },
        {
          content_type: 'user_phone_number',
        },
        {
          content_type: 'text',
          payload: 'foo',
          title: 'foo',
        },
        {
          content_type: 'text',
          payload: 'bar',
          title: 'bar',
        },
      ],
    })
  })
})
