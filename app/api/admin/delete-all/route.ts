import { prisma } from "@/lib/db";
export async function POST() {
  await prisma.booking.deleteMany({});
  return Response.redirect("/admin");
}
