// app/api/stripe-webhook/route.ts
import { prisma } from "@/lib/db";
import Stripe from "stripe";
import { headers } from "next/headers";

// 关键：App Router 用这些而不是 export const config
export const runtime = "nodejs";         // Stripe SDK 需要 Node 运行时
export const dynamic = "force-dynamic";  // 避免缓存，确保每次都能接收事件

export async function POST(req: Request) {
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  const sk = process.env.STRIPE_SECRET_KEY || "";
  if (!whSecret || !sk) {
    // 环境变量还没配置时也让构建通过；仅返回提示
    return new Response("Stripe not configured", { status: 200 });
  }

  // 读取原始 body 并校验签名
  const rawBody = await req.text();
  const sig = headers().get("stripe-signature") || "";
  const stripe = new Stripe(sk, { apiVersion: "2024-06-20" });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, whSecret);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;
    const bookingId = (s.metadata as any)?.bookingId;
    if (bookingId) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { paid: true },
      });
    }
  }

  return new Response("ok", { status: 200 });
}
