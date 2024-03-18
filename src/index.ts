import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono();
app.use('/v1/*', clerkMiddleware());
app.get('/v1/test', (c) => {
  const auth = getAuth(c)
  if (!auth?.userId) {
    return c.json({
      message: 'You are not logged in.',
    }, 401);
  }

  return c.json({
    message: `Hello World`,
  });
})

app.get("/ping", (c) => c.json({ ping: "pong" }, 200));

serve(app, (info) => {
  console.log(`Listening on http://localhost:${info.port}`); // Listening on http://localhost:3000
})

export default app