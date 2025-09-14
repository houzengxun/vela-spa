// @ts-nocheck
import { prisma } from "@/lib/db";
import FilterList from "./FilterList";
export const dynamic = "force-dynamic";

export default async function PricesPage() {
  let services:any[] = [];
  try {
    services = await prisma.service.findMany({ where: { active: true }, orderBy: [{ category: "asc" }, { duration: "asc" }] });
  } catch { services = []; }

  return (
    <div>
      <h1>Prices</h1>
      <p className="kicker">Filter by intensity, body area and duration. Click “Read more” to expand from a short summary to full details.</p>
      {services.length === 0 ? (
        <div className="card">Services will appear here after seeding the database. Run <code>npm run db:push</code> then <code>npm run db:seed</code>.</div>
      ) : (
        <FilterList services={services} />
      )}
    </div>
  );
}
