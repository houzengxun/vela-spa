import Link from "next/link";

export default function Page() {
  const site = process.env.SITE_NAME || "VELA SPA";
  const addr = process.env.SITE_ADDRESS || "";
  const phone = process.env.SITE_PHONE || "";
  const email = process.env.SITE_EMAIL || "";
  const open = process.env.OPEN_TIME || "09:30";
  const close = process.env.CLOSE_TIME || "21:30";

  return (
    <div className="grid" style={{ gap: 24 }}>
      <section className="card">
        <div className="kicker">Welcome to</div>
        <h1>{site}</h1>
        <p>Black & gold, warm and elegant. A boutique spa offering foot, back and full-body massage with customizable pressure and duration.</p>
        <p><b>Find us:</b> {addr}</p>
        <p><b>Hours:</b> Daily {open}–{close}</p>
        <p><b>Contact:</b> {phone} · {email}</p>
        <div style={{ display: "flex", gap: 8 }}>
          <Link className="btn" href="/booking">Book now</Link>
          <Link className="btn secondary" href="/prices">View prices</Link>
        </div>
      </section>
    </div>
  );
}
