// @ts-nocheck
import { prisma } from "@/lib/db";
import BookForm from "./ui";
export const dynamic = "force-dynamic";

export default async function BookingPage() {
  let services:any[] = [];
  try { services = await prisma.service.findMany({ where: { active: true }, orderBy: [{ duration: "asc" }] }); }
  catch { services = []; }

  return (
    <div className="grid" style={{ gap: 12 }}>
      <h1>Book</h1>
      <p className="kicker">Open daily 09:30–21:30. Check availability for your time slot, then pay to confirm.</p>
      {services.length === 0 ? (
        <div className="card">No services in database yet. Run <code>npm run db:seed</code> locally to add example items.</div>
      ) : (
        <BookForm services={services} />
      )}
    </div>
  );
}
