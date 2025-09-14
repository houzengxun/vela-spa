// @ts-nocheck
import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function Success({ searchParams }:{ searchParams: Promise<any> }){
  const sp = await searchParams;
  const bId = Array.isArray(sp?.b) ? sp.b[0] : sp?.b;
  const booking = bId ? await prisma.booking.findUnique({ where: { id: bId } }) : null;
  return (
    <div className="card">
      <h1>Thank you!</h1>
      <p>Your booking has been {sp?.demo ? 'simulated (demo)' : 'confirmed'}.</p>
      {booking ? (<div><div><b>Service:</b> {booking.serviceName}</div><div><b>Time:</b> {new Date(booking.date).toLocaleString()}</div><div><b>Name:</b> {booking.name} • <b>Phone:</b> {booking.phone}</div><div><b>Paid:</b> {booking.paid ? "Yes" : "Pending"}</div></div>) : <p className="kicker">No booking info found.</p>}
    </div>
  );
}
