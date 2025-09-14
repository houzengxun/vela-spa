// app/admin/page.tsx
// @ts-nocheck
import { prisma } from "@/lib/db";
import DeleteAll from "./DeleteAll";

export const dynamic = "force-dynamic";

function usd(n: number) {
  if (!n || isNaN(n as any)) return "$0";
  // 价格模型里是整数美元（如 60、90），按 $xx 显示
  return `$${n}`;
}

export default async function Admin({
  searchParams,
}: {
  searchParams: Promise<any>;
}) {
  const sp = await searchParams;
  const pass = process.env.ADMIN_PASSWORD || "velaspa123";

  // ✅ 临时加急方案：仅用 URL 查询参数 ?p=... 验证，不再写 Cookie
  const ok = sp?.p === pass;

  if (!ok) {
    return (
      <div className="card">
        <h1 className="text-xl font-semibold">Admin</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          未授权。请输入密码或在地址后追加 <code>?p=PASSWORD</code>。
        </p>

        <form method="GET" action="/admin" className="mt-4 flex gap-2 items-center">
          <input
            name="p"
            type="password"
            placeholder="Password"
            className="input"
          />
          <button type="submit" className="btn">Unlock</button>
        </form>
      </div>
    );
  }

  // === 数据查询 ===
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const items = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { service: { select: { price: true, name: true } } },
    take: 500,
  });

  const sum = (arr: any[]) =>
    arr.reduce((s, x) => s + (x?.service?.price ?? 0), 0);

  const paidItems = items.filter((b) => b.paid);
  const todayPaid = sum(paidItems.filter((b) => b.createdAt >= startOfDay));
  const monthPaid = sum(paidItems.filter((b) => b.createdAt >= startOfMonth));
  const totalPaid = sum(paidItems);

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <DeleteAll />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="card">
            <div className="text-sm text-muted-foreground">Today revenue</div>
            <div className="text-2xl font-semibold">{usd(todayPaid)}</div>
          </div>
          <div className="card">
            <div className="text-sm text-muted-foreground">Month revenue</div>
            <div className="text-2xl font-semibold">{usd(monthPaid)}</div>
          </div>
          <div className="card">
            <div className="text-sm text-muted-foreground">Total revenue</div>
            <div className="text-2xl font-semibold">{usd(totalPaid)}</div>
          </div>
          <div className="card">
            <div className="text-sm text-muted-foreground">Bookings</div>
            <div className="text-2xl font-semibold">
              {items.length} <span className="text-sm">({paidItems.length} paid)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <h2 className="text-lg font-semibold mb-3">Recent bookings</h2>
        <table className="min-w-[800px] w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-3">Created</th>
              <th className="py-2 pr-3">Date</th>
              <th className="py-2 pr-3">Name / Phone</th>
              <th className="py-2 pr-3">Service</th>
              <th className="py-2 pr-3">Duration</th>
              <th className="py-2 pr-3">Price</th>
              <th className="py-2 pr-3">Paid</th>
            </tr>
          </thead>
          <tbody>
            {items.map((b) => {
              const price = b?.service?.price ?? 0;
              return (
                <tr key={b.id} className="border-b last:border-0">
                  <td className="py-2 pr-3">
                    {new Date(b.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 pr-3">
                    {new Date(b.date).toLocaleString()}
                  </td>
                  <td className="py-2 pr-3">
                    {b.name} <span className="text-muted-foreground">/ {b.phone}</span>
                  </td>
                  <td className="py-2 pr-3">{b.serviceName}</td>
                  <td className="py-2 pr-3">{b.duration}m</td>
                  <td className="py-2 pr-3">{usd(price)}</td>
                  <td className="py-2 pr-3">
                    {b.paid ? (
                      <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-600">Yes</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600">Pending</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-muted-foreground">
                  No bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
