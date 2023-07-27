import client from "../database";
import bcrypt from "bcrypt";

const { BCRYPT_PASSWORD: pepper, SALT_ROUNDS: saltRounds } = process.env;

export type User = {
  id?: number;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
};

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM users";

      const result = await conn.query(sql);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  async show(id: number): Promise<User> {
    try {
      const sql = "SELECT * FROM users WHERE id=($1)";
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`);
    }
  }

  async getByUsername(username: string): Promise<User | null> {
    try {
      const sql = "SELECT * FROM users WHERE username=($1)";
      const conn = await client.connect();

      const result = await conn.query(sql, [username]);

      conn.release();

      return result.rows[0] || null;
    } catch (err) {
      throw new Error(`Could not find user ${username}. Error: ${err}`);
    }
  }

  async create(u: User): Promise<User | null> {
    try {
      const sql =
        "INSERT INTO users (username, first_name, last_name, password) VALUES($1, $2, $3, $4) RETURNING *";
      const conn = await client.connect();

      const hash = bcrypt.hashSync(
        u.password + pepper,
        parseInt(saltRounds as string),
      );

      const result = await conn.query(sql, [
        u.username,
        u.first_name,
        u.last_name,
        hash,
      ]);

      const user = result.rows[0];

      conn.release();

      return user || null
    } catch (err) {
      throw new Error(
        `Could not add new user ${u.first_name} ${u.last_name}. Error: ${err}`,
      );
    }
  }

  async edit(user: User): Promise<User> {
    try {
      const sql =
        "UPDATE users SET username = $2, first_name = $3, last_name = $4, password = $5 WHERE id = $1 RETURNING *";
      const conn = await client.connect();

      const result = await conn.query(sql, [
        user.id,
        user.username,
        user.first_name,
        user.last_name,
        user.password,
      ]);

      const user1 = result.rows[0];

      conn.release();

      return user1;
    } catch (err) {
      throw new Error(`Could not edit article ${user.id}. Error: ${err}`);
    }
  }

  async delete(id: number): Promise<User> {
    try {
      const sql = "DELETE FROM users WHERE id=($1) RETURNING *";
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);

      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(`Could not delete user ${id}. Error: ${err}`);
    }
  }

  async authenticate(username: string, password: string): Promise<User | null> {
    try {
      const sql = "SELECT * FROM users WHERE username=($1)";
      const conn = await client.connect();

      const result = await conn.query(sql, [username]);

      conn.release();

      const user = result.rows[0] || null;
      if (user && bcrypt.compareSync(password + pepper, user.password)) {
        return user;
      } else {
        return null
      }

    } catch (err) {
      throw new Error(`Could not find user ${username}. Error: ${err}`);
    }
  }
}
