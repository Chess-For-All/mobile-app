import dotenv from "dotenv";
import {App} from "octokit";
import {createNodeMiddleware} from "@octokit/webhooks";
import fs from "fs";
import http from "http";
import path from "path"

dotenv.config();

const appId = process.env.APP_ID;
const webhookSecret = process.env.WEBHOOK_SECRET;
const privateKeyPath = process.env.PRIVATE_KEY_PATH;

const privateKey = fs.readFileSync(privateKeyPath, "utf8");

const app = new App({
  appId: appId,
  privateKey: privateKey,
  webhooks: {
    secret: webhookSecret
  },
});

const messageForNewPRs = "Thanks for opening a new PR! Please follow our contributing guidelines to make your PR easier to review.";

async function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const formattedPath = path === '/' ? '/index.html' : path;
  const filePathAdr = path.join(__dirname, formattedPath.slice(1));
  fs.readFile(filePathAdr, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`Error: ${err}\n`);
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(data);
  });
};

app.webhooks.on("request.handled", handleRequest);

app.webhooks.onError((error) => {
    console.error(error);
    return
});

const port = 443;
const host = 'localhost';
const path = "/";
const localWebhookUrl = `http://${host}:${port}${path}`;

const middleware = createNodeMiddleware(app.webhooks, {path});

const servship = http.createServer(middleware)
  .listen(port, () => {
      console.log(`Server running at ${localWebhookUrl}`);
  });
