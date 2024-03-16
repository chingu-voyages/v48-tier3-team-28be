import { expect, describe, it } from 'vitest'
import app from '.'

describe('Requests', () => {
  describe('Requests - Unauthenticated', () => {
    it('should return 401 as an unauthenticated user', async () => {
      const res = await app.request("/v1/test", { method: 'GET' });
      expect(res.status).toBe(401);
    })
  })

  describe('Requests - Public', () => {
    it('should return pong', async () => {
      const res = await app.request("/ping", { method: 'GET' });
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({
        ping: "pong"
      })
    })
  })
})