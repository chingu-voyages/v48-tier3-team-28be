import Koa from "koa";
import bodyParser from "koa-bodyparser";
import json from "koa-json";
import logger from "koa-logger";
import Router from "koa-router";

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
