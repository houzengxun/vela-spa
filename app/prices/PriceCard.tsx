'use client';
import { useState, useMemo } from 'react';

function makeSummary(desc: string){
  if(!desc) return '';
  const dot = desc.indexOf('.');
  if(dot > 0 && dot < 160) return desc.slice(0, dot+1);
  return desc.length > 120 ? desc.slice(0,120) + '…' : desc;
}

export default function PriceCard({ s }:{ s:any }){
  const [open,setOpen] = useState(false);
  const summary = useMemo(()=>makeSummary(s.description), [s.description]);
  return (
    <div className="card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',gap:10}}>
        <h3 style={{margin:0}}>{s.name}</h3>
        <div className="badge">${s.price} · {s.duration}m</div>
      </div>
      <div className="kicker">{s.bodyArea} · {s.intensity}</div>

      {!open ? (
        <p style={{marginTop:8}}>{summary}</p>
      ) : (
        <p style={{marginTop:8, whiteSpace:'pre-wrap'}}>{s.description}</p>
      )}

      <button className="readmore" onClick={()=>setOpen(v=>!v)}>{open?'Show less':'Read more'}</button>
    </div>
  );
}
