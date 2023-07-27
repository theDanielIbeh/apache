import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import user_routes from "./handlers/user";
import cors from "cors";

const app: express.Application = express();

const { POSTGRES_HOST: host, POSTGRES_PORT: port } = process.env;
const address: string = `${host}:${port}`;

app.use(bodyParser.json());
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Middleware to enable CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/", function (req: Request, res: Response) {
  res.send("Hello User!");
});

user_routes(app);

app.listen(port, function () {
  console.log(`starting app on: ${address}`);
});

export default app;
