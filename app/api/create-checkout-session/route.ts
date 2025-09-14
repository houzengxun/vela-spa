import { prisma } from "@/lib/db";
import Stripe from "stripe";
import { NextRequest } from "next/server";
const stripeKey = process.env.STRIPE_SECRET_KEY || "";
const stripe = stripeKey ? new Stripe(stripeKey, { apiVersion: "2024-06-20" }) : null;

function inBusinessHours(dateStr: string) {
  const hhmm = dateStr?.slice(11,16) || "";
  const [hh, mm] = hhmm.split(":").map(Number);
  if (!isFinite(hh) || !isFinite(mm)) return false;
  const m = hh * 60 + mm;
  return m >= 9*60 + 30 && m <= 21*60 + 30;
}

export async function POST(req: NextRequest) {
  try{
    const { serviceId, date, name, phone, email } = await req.json();
    if (!inBusinessHours(date)) return Response.json({ error: "Please book within business hours (09:30–21:30)." }, { status: 400 });
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if(!service) return Response.json({ error: "Service not found" }, { status: 404 });

    const booking = await prisma.booking.create({
      data: { date: new Date(date), name, phone, email, intensity: service.intensity, bodyArea: service.bodyArea, duration: service.duration, serviceId: service.id, serviceName: service.name, price: service.price, paid: false }
    });

    if (!stripe) {
      const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      return Response.json({ url: `${base}/success?b=${booking.id}&demo=1` });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email || undefined,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?b=${booking.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/booking`,
      line_items: [{ quantity: 1, price_data: { currency: "usd", unit_amount: service.price * 100, product_data: { name: service.name, description: `${service.duration}m • ${service.bodyArea} • ${service.intensity}` } } }],
      metadata: { bookingId: booking.id }
    });
    await prisma.booking.update({ where: { id: booking.id }, data: { stripeSessionId: session.id } });
    return Response.json({ url: session.url });
  }catch(e:any){ return Response.json({ error: e.message || 'Failed' }, { status: 500 }); }
}
