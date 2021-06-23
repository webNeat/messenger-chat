import {event} from '../src'

describe('event', () => {
  test(`generates message`, () => {
    const time = Date.now()
    const evt = event()
      .from('alice')
      .to('bob')
      .at(time)
      .text('Hello there!')
      .get()
    expect(evt.object).toBe('page')
    expect(evt.entry).toHaveLength(1)
    const entry = evt.entry[0]
    expect(entry.id).toBe('bob')
    expect(entry.time).toBe(time)
    expect(entry.messaging).toHaveLength(1)
    const item = entry.messaging[0] as any
    expect(item.recipient).toEqual({id: 'bob'})
    expect(item.sender).toEqual({id: 'alice'})
    expect(item.timestamp).toBe(time)
    expect(item.postback).toBeUndefined()
    expect(item.message.mid).toBeDefined()
    expect(item.message).toMatchObject({
      mid: expect.stringMatching(/m-\d+/),
      text: 'Hello there!',
    })
  })

  test(`generates postback`, () => {
    const time = Date.now()
    const evt = event()
      .from('alice')
      .to('bob')
      .at(time)
      .postback('Click here', 'custom-action')
      .get()
    expect(evt.entry).toHaveLength(1)
    const item = evt.entry[0].messaging[0] as any
    expect(item.recipient).toEqual({id: 'bob'})
    expect(item.sender).toEqual({id: 'alice'})
    expect(item.timestamp).toBe(time)
    expect(item.message).toBeUndefined()
    expect(item.postback.mid).toBeDefined()
    expect(item.postback).toMatchObject({
      mid: expect.stringMatching(/m-\d+/),
      title: 'Click here',
      payload: 'custom-action',
    })
  })
})
