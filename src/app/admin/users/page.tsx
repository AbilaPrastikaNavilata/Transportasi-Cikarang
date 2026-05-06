import { db } from "@/db"
import { user } from "@/db/schema"
import { desc } from "drizzle-orm"
import { UsersClient } from "./users-client"

export const dynamic = "force-dynamic"

export default async function UsersPage() {
  const usersData = await db.select().from(user).orderBy(desc(user.createdAt))

  return <UsersClient initialData={usersData} />
}
