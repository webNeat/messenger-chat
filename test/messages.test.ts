import {emailReply, phoneReply, text, textReply} from '../src'

describe('messages', () => {
  test(`text message`, () => {
    expect(text('Yo')).toEqual({text: 'Yo'})
  })

  test(`text message with quick replies`, () => {
    expect(text('Yo', [emailReply(), phoneReply(), textReply('foo'), textReply('bar')])).toEqual({
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
