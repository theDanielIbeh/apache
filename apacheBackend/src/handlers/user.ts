import express, { Request, Response, NextFunction } from "express";
import { User, UserStore } from "../models/user";
import jwt from "jsonwebtoken";

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (err) {
    console.log("Error:", err);
    res.status(400);
    res.json(err);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as unknown as string);
    const user = await store.show(id);
    res.json({
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      password: user.password,
    });
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    interface LogIn {
      username: string;
      password: string;
    }
    const logInObject: LogIn = req.body as unknown as LogIn;
    const email = logInObject.username as unknown as string;
    const password = logInObject.password as unknown as string;

    const user: User | null = await store.authenticate(email, password);
    if (user != null) {
      const token = jwt.sign(
        { user },
        process.env.TOKEN_SECRET as unknown as string,
      );
      res.json({
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        password: user.password,
        token,
      });
    } else {
      const existingUser: User | null = await store.getByUsername(email);
      if (existingUser) {
        return res.status(409).json({
          error: true,
          key: "password",
          message: `Incorrect password`,
        });
      } else {
        return res.status(409).json({
          error: true,
          key: "username",
          message: `Username not registered. Please sign up.`,
        });
      }
    }
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const create = async (req: Request, res: Response) => {
  const user: User = {
    username: req.body.username,
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    password: req.body.password,
  };
  try {
    const existingUser = await store.getByUsername(user.username);
    if (existingUser) {
      // return res.status(409).json(`User ${user.username} already exists`);
      return res
        .status(409)
        .json({ error: true, message: `User ${user.username} already exists` });
    }
    const newUser = await store.create(user);
    const token = jwt.sign(
      { user: newUser },
      process.env.TOKEN_SECRET as unknown as string,
    );
    res.json({
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      password: user.password,
      token,
    });
  } catch (err: any) {
    res.status(400).json(`${err.message}`);
  }
};

const edit = async (req: Request, res: Response) => {
  const user: User = {
    id: parseInt(req.params.id),
    username: req.body.username,
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    password: req.body.password,
  };

  try {
    const newUser = await store.edit(user);
    const token = jwt.sign(
      { user: newUser },
      process.env.TOKEN_SECRET as unknown as string,
    );
    res.json({
      username: newUser.username,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      password: newUser.password,
    });
  } catch (err) {
    res.status(400);
    res.json(`${err} + ${user}`);
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as unknown as string);
    const user = await store.delete(id);
    res.json({
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      password: user.password,
    });
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const provideToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozLCJ1c2VybmFtZSI6IkZpcnN0IFVzZXIiLCJmaXJzdF9uYW1lIjpudWxsLCJsYXN0X25hbWUiOm51bGwsInBhc3N3b3JkIjoiJDJiJDEwJGdiZkJ2SDcyVGs1MjZMa3cyZ09iMi5CQjFKcC5wTHJzaFh5cjZsOEUyOHVQdFRWbEhEaVhpIn0sImlhdCI6MTY3NDM5ODE0MH0.8HtOWUsyRbOGmt9FJCEi4JEnmSh5k5gHJ_S4mlW-vck";

  if (!token) {
    console.log("token: undefined");
  } else {
    req.headers.authorization = "Bearer " + token;
  }
  next();
};

const verifyAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authorizationHeader = req.headers.authorization as unknown as string;
    const token = authorizationHeader?.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET as unknown as string);
    next();
  } catch (err) {
    res.status(401);
    res.json(`Access denied, invalid token ${err}`);
  }
};

const user_routes = (app: express.Application) => {
  app.get("/users", verifyAuthToken, index);
  app.get("/users/:id", verifyAuthToken, show);
  app.post("/users/auth", authenticate);
  app.put("/users/:id", edit);
  app.post("/users", create);
  app.delete("/users/:id", destroy);
};

export default user_routes;
