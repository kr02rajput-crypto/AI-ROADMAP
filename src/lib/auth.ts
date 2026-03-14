import { currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getOrCreateUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  // Check if user exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkUser.id),
  });

  if (existingUser) return existingUser;

  // Create new user
  const [newUser] = await db
    .insert(users)
    .values({
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    })
    .returning();

  return newUser;
}
