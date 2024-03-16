import { expect, describe, it } from 'vitest'
import app from '.'

describe('Requests', () => {
  describe('Requests - Fresh', () => {
    it('should return 500 due to missing clerk env variables', async () => {
      const res = await app.request("/v1/test", { method: 'GET' });
      expect(res.status).toBe(401);
    })
  })

  describe('Requests - Warm', () => {
    it('should return pong', async () => {
      const res = await app.request("/ping", { method: 'GET' });
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({
        ping: "pong"
      })
    })
  })
})