import { prisma } from "@/lib/db";
import Stripe from "stripe";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  const sk = process.env.STRIPE_SECRET_KEY || "";
  if (!whSecret || !sk) return new Response("Stripe not configured", { status: 200 });
  const buf = await req.text();
  const sig = headers().get("stripe-signature") || "";
  const stripe = new Stripe(sk, { apiVersion: "2024-06-20" });
  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(buf, sig, whSecret); }
  catch (err:any) { return new Response(`Webhook Error: ${err.message}`, { status: 400 }); }
  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;
    const bookingId = (s.metadata as any)?.bookingId;
    if (bookingId) await prisma.booking.update({ where: { id: bookingId }, data: { paid: true } });
  }
  return new Response("ok", { status: 200 });
}
export const config = { api: { bodyParser: false } } as any;
