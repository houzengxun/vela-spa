import "./globals.css";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: process.env.SITE_NAME || "VELA SPA",
  description: "Warm, elegant massage & spa in Chicago Pilsen.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const site = process.env.SITE_NAME || "VELA SPA";
  const addr = process.env.SITE_ADDRESS || "";
  const phone = process.env.SITE_PHONE || "";
  const email = process.env.SITE_EMAIL || "";
  const open = process.env.OPEN_TIME || "09:30";
  const close = process.env.CLOSE_TIME || "21:30";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: site,
    telephone: phone,
    email,
    address: { "@type": "PostalAddress", streetAddress: addr },
    openingHours: "Mo-Su 09:30-21:30",
    url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  };

  return (
    <html lang="en">
      <body>
        <div style={{ background: "rgba(212,175,55,0.10)", borderBottom: "1px solid rgba(212,175,55,0.35)" }}>
          <div className="container" style={{ display: "flex", gap: 16, justifyContent: "space-between", fontSize: 13 }}>
            <div>Open daily: {open} – {close}</div>
            <div style={{ display: "flex", gap: 12 }}>
              <a href={`tel:${phone}`}><b>Tel:</b> {phone}</a>
              <a href={`mailto:${email}`}><b>Email:</b> {email}</a>
            </div>
          </div>
        </div>

        <header className="header">
          <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="logo">
              <Image src="/logo.jpg" alt="VELA SPA" width={56} height={56} />
              <div>
                <div className="kicker">{addr}</div>
                <h2 style={{ margin: 0 }}>{site}</h2>
              </div>
            </div>
            <nav>
              <Link href="/">Home</Link>
              <Link href="/prices">Prices</Link>
              <Link href="/booking">Book</Link>
              <Link href="/admin">Admin</Link>
            </nav>
          </div>
        </header>

        <main className="container">{children}</main>

        <footer className="container">
          <div>© {new Date().getFullYear()} {site}. {addr}</div>
          <div className="kicker" style={{ marginTop: 6 }}>
            Open daily {open}–{close} • Tel {phone} • {email}
          </div>
        </footer>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
