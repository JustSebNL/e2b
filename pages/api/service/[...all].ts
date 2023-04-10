import { createProxyMiddleware } from 'http-proxy-middleware'
import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    // Proxy middleware will handle requests itself, so Next.js should 
    // ignore that our handler doesn't directly return a response
    externalResolver: true,
    // Pass request bodies through unmodified so that the origin API server
    // receives them in the intended format
    bodyParser: false,
  },
}

const target = process.env.API_URL!
const isSecure = target.startsWith('https://')

const proxy = createProxyMiddleware<NextApiRequest, NextApiResponse>({
  target,
  // ws: true,
  secure: !isSecure,
  changeOrigin: true,
  pathRewrite: { '^/api/service': '' }, // remove prefix
})

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  proxy(req, res, (result: unknown) => {
    if (result instanceof Error) {
      throw result
    }
  })
}
