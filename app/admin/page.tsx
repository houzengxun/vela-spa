// @ts-nocheck
import { prisma } from "@/lib/db";
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";
import DeleteAll from "./DeleteAll";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

type Agg = { _sum: { price: number | null }; _count: number };

export default async function AdminPage({ searchParams }:{ searchParams: Promise<Record<string,string|string[]|undefined>> }) {
  const sp = await searchParams;
  const p = typeof sp.p === "string" ? sp.p : Array.isArray(sp.p) ? sp.p[0] : undefined;
  const pass = process.env.ADMIN_PASSWORD || "velaspa123";
  const ck = cookies();
  if (p && p === pass) ck.set("admin", pass, { httpOnly: false });
  const ok = ck.get("admin")?.value === pass;

  if (!ok) return (<div className="card"><h1>Admin</h1><p>Unauthorized. Append <code>?p=PASSWORD</code> to unlock.</p></div>);

  const today = new Date();
  let daily:Agg = { _sum:{price:0}, _count:0 }, monthly:Agg = { _sum:{price:0}, _count:0 }, items:any[]=[];
  try {
    [daily, monthly] = await Promise.all([
      prisma.booking.aggregate({ where: { createdAt: { gte: startOfDay(today), lte: endOfDay(today) }, paid:true }, _sum:{price:true}, _count:true }),
      prisma.booking.aggregate({ where: { createdAt: { gte: startOfMonth(today), lte: endOfMonth(today) }, paid:true }, _sum:{price:true}, _count:true }),
    ]) as any;
    items = await prisma.booking.findMany({ orderBy:{ createdAt:'desc' }, take:200 });
  } catch { items = []; }

  return (
    <div>
      <h1>Admin</h1>
      <div className="grid cols-3">
        <div className="card"><div className="kicker">Today Revenue</div><h2>${daily._sum.price ?? 0}</h2><div>{daily._count} paid</div></div>
        <div className="card"><div className="kicker">This Month Revenue</div><h2>${monthly._sum.price ?? 0}</h2><div>{monthly._count} paid</div></div>
        <div className="card"><div className="kicker">Actions</div><DeleteAll /></div>
      </div>
      <div className="hr" />
      <table className="table">
        <thead><tr><th>Created</th><th>Time</th><th>Service</th><th>Customer</th><th>Price</th><th>Paid</th></tr></thead>
        <tbody>{items.map((b:any)=>(<tr key={b.id}><td>{new Date(b.createdAt).toLocaleString()}</td><td>{new Date(b.date).toLocaleString()}</td><td>{b.serviceName}</td><td>{b.name} ({b.phone})</td><td>${b.price}</td><td>{b.paid?'Yes':'No'}</td></tr>))}</tbody>
      </table>
    </div>
  );
}
