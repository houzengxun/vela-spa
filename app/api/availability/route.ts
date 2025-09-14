import { prisma } from "@/lib/db";

function addMinutes(date: Date, mins: number){ return new Date(date.getTime() + mins*60000); }

export async function POST(req: Request){
  try{
    const { start, serviceId } = await req.json();
    if(!start) return Response.json({ error: "start required" }, { status: 400 });

    let duration = 60;
    if(serviceId){
      const svc = await prisma.service.findUnique({ where: { id: serviceId } });
      if(svc) duration = svc.duration;
    }

    const startAt = new Date(start);
    const endAt = addMinutes(startAt, duration);

    const nearFrom = addMinutes(startAt, -240);
    const nearTo = addMinutes(endAt, 240);
    const bookings = await prisma.booking.findMany({
      where: { date: { gte: nearFrom, lte: nearTo } },
      select: { date: true, duration: true }
    });

    const overlaps = bookings.some(b => {
      const bStart = new Date(b.date);
      const bEnd = addMinutes(bStart, b.duration || 60);
      return bStart < endAt && bEnd > startAt;
    });

    return Response.json({ available: !overlaps, duration });
  }catch(e:any){
    return Response.json({ error: e.message || "failed" }, { status: 500 });
  }
}
