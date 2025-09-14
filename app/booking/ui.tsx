'use client';
import { useState } from 'react';

function minutesOf(t: string) { const hhmm = t?.slice(11, 16) || ""; const [hh, mm] = hhmm.split(":").map(Number); return isFinite(hh) && isFinite(mm) ? hh * 60 + mm : NaN; }
function inBusinessHours(t: string) { const m = minutesOf(t); if (!isFinite(m)) return false; const open = 9 * 60 + 30; const close = 21 * 60 + 30; return m >= open && m <= close; }

export default function BookForm({ services }:{ services:any[] }){
  const [serviceId, setServiceId] = useState<string>('');
  const [date, setDate] = useState(''); const [name, setName] = useState(''); const [phone, setPhone] = useState(''); const [email, setEmail] = useState('');
  const [avail, setAvail] = useState<null | {ok:boolean, msg:string}>(null);
  const selected = services.find(s=>s.id===serviceId);
  const duration = selected?.duration || 60;

  async function check(){
    if(!serviceId || !date){ setAvail({ok:false, msg:'Pick a service and time first.'}); return; }
    if(!inBusinessHours(date)){ setAvail({ok:false, msg:'Please pick a time between 09:30 and 21:30.'}); return; }
    const r = await fetch('/api/availability', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ start: date, serviceId }) });
    const d = await r.json();
    if(d.available){ setAvail({ok:true, msg:'Available ✔'}); } else { setAvail({ok:false, msg:'Not available at this time. Try a different start time.'}); }
  }

  async function submit(){
    if(!inBusinessHours(date)){ alert('Please pick a time between 09:30 and 21:30.'); return; }
    const res = await fetch('/api/create-checkout-session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ serviceId, date, name, phone, email }) });
    const data = await res.json();
    if(data.url) window.location.href = data.url; else alert(data.error || 'Failed to create checkout');
  }

  return (
    <div className="card">
      <div className="grid" style={{gridTemplateColumns:'repeat(2, minmax(0,1fr))'}}>
        <div><div className="label">Service</div>
          <select className="input" value={serviceId} onChange={e=>{setServiceId(e.target.value); setAvail(null);}}>
            <option value="">Select a service</option>
            {services.map(s=>(<option key={s.id} value={s.id}>{s.name} • ${s.price} • {s.duration}m</option>))}
          </select>
        </div>
        <div><div className="label">Start time</div><input className="input" type="datetime-local" value={date} onChange={e=>{setDate(e.target.value); setAvail(null);}} step={1800} /><div className="kicker" style={{marginTop:6}}>Open daily 09:30–21:30</div></div>
        <div><div className="label">Your name</div><input className="input" value={name} onChange={e=>setName(e.target.value)} /></div>
        <div><div className="label">Phone</div><input className="input" value={phone} onChange={e=>setPhone(e.target.value)} /></div>
        <div><div className="label">Email (optional)</div><input className="input" value={email} onChange={e=>setEmail(e.target.value)} /></div>
      </div>
      <div style={{display:'flex', gap:10, alignItems:'center', marginTop:12}}>
        <button className="btn secondary" onClick={check} disabled={!serviceId || !date}>Check availability ({duration}m)</button>
        <div className="kicker">{avail ? (avail.ok ? 'Available ✔' : avail.msg) : 'Select service & time, then check availability.'}</div>
      </div>
      <div style={{marginTop:12}}><button className="btn" onClick={submit} disabled={!serviceId || !date || !name || !phone}>Pay & confirm</button></div>
    </div>
  );
}
