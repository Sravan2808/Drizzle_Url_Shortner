import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { usersTable } from "../models/user.model.js";
import { urlsTable } from "../models/url.model.js";

export async function getUserByEmail(email) {
  const [existingUser] = await db
    .select({
      id: usersTable.id,
      firstname: usersTable.firstname,
      lastname: usersTable.lastname,
      email: usersTable.email,
      salt: usersTable.salt,
      password: usersTable.password,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));
  return existingUser;
}

export async function createUser({
  firstname,
  lastname,
  email,
  salt,
  hashedPassword,
}) {
  const [user] = await db
    .insert(usersTable)
    .values({
      email,
      firstname,
      lastname,
      salt,
      password: hashedPassword,
    })
    .returning({ id: usersTable.id });
  return user;
}

export async function createUrl(shortCode, url, userId) {
  const [result] = await db
    .insert(urlsTable)
    .values({ shortCode, targetURL: url, userId })
    .returning({
      id: urlsTable.id,
      shortCode: urlsTable.shortCode,
      targetURL: urlsTable.targetURL,
    });
  return result;
}

export async function getUrlByCode(code) {
  const [result] = await db
    .select({ targetURL: urlsTable.targetURL })
    .from(urlsTable)
    .where(eq(urlsTable.shortCode, code));
  return result;
}
