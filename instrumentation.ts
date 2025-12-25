import { registerOTel } from '@vercel/otel'

export function register() {
  registerOTel({
    serviceName: 'librarease-next',
    instrumentationConfig: {
      fetch: {
        propagateContextUrls: [process.env.API_URL!],
      },
    },
  })
}
