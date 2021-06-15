import {event, WebhookMessageItem, WebhookPostbackItem} from '../src'

describe('event', () => {
  const messenger = event()
    .from('alice')
    .to('bob')

  test(`generates message`, () => {
    const time = Date.now()
    const evt = messenger
      .at(time)
      .text('Hello there!')
      .get()
    expect(evt.object).toBe('page')
    expect(evt.entry).toHaveLength(1)
    const entry = evt.entry[0]
    expect(entry.id).toBe('bob')
    expect(entry.time).toBe(time)
    expect(entry.messaging).toHaveLength(1)
    const item = entry.messaging[0] as WebhookMessageItem
    expect(item.recipient).toEqual({id: 'bob'})
    expect(item.sender).toEqual({id: 'alice'})
    expect(item.timestamp).toBe(time)
    expect((item as any).postback).toBeUndefined()
    expect(item.message.mid).toBeDefined()
    expect(item.message).toMatchObject({
      mid: expect.stringMatching(/m-\d+/),
      text: 'Hello there!',
    })
  })

  test(`generates postback`, () => {
    const time = Date.now()
    const evt = messenger
      .at(time)
      .postback('Click here', 'custom-action')
      .get()
    expect(evt.entry).toHaveLength(1)
    const item = evt.entry[0].messaging[0] as WebhookPostbackItem
    expect(item.recipient).toEqual({id: 'bob'})
    expect(item.sender).toEqual({id: 'alice'})
    expect(item.timestamp).toBe(time)
    expect((item as any).message).toBeUndefined()
    expect(item.postback.mid).toBeDefined()
    expect(item.postback).toMatchObject({
      mid: expect.stringMatching(/m-\d+/),
      title: 'Click here',
      payload: 'custom-action',
    })
  })
})
