import https from 'https'

export async function send(accessToken: string, data: any) {
  data = JSON.stringify(data)
  const req = https.request({
    hostname: 'graph.facebook.com',
    port: 443,
    path: '/v11.0/me/messages?access_token=' + accessToken,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  })
  return new Promise<void>((resolve, reject) => {
    req.on('error', err => reject(err))
    req.end(data, () => resolve())
  })
}
