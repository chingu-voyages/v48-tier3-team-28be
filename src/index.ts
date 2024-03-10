import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import logger from "koa-logger";
import json from "koa-json";

const app = new Koa();
const router = new Router();

app.use(bodyParser());
app.use(json());

router.get("/", async (ctx) => {
  ctx.body = "Hello World!";
});

app.use(logger());

app.use(router.routes());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
