import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { usersTable } from "../models/user.model.js";

export async function getUserByEmail(email) {
  const [existingUser] = await db
    .select({
      id: usersTable.id,
      firstname: usersTable.firstname,
      lastname: usersTable.lastname,
      email: usersTable.email,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));
  return existingUser;
}

export async function createUser({firstname,lastname,email,salt,hashedPassword}){
const [user] = await db.insert(usersTable).values({
    email,
    firstname,
    lastname,
    salt,
    password:hashedPassword
   }).returning({id:usersTable.id})
   return user
}
