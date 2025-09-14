'use client';
import { useMemo, useState } from 'react';
import PriceCard from './PriceCard';

export default function FilterList({ services }:{ services:any[] }){
  const [filters, setFilters] = useState({ intensity:'', bodyArea:'', duration:'' });

  const filtered = useMemo(()=>services.filter(s=> 
    (!filters.intensity || s.intensity===filters.intensity) &&
    (!filters.bodyArea || s.bodyArea===filters.bodyArea) &&
    (!filters.duration || String(s.duration)===filters.duration)
  ), [services, filters]);

  const groups = useMemo(()=>{
    const g:Record<string, any[]> = {};
    for(const s of filtered){ if(!g[s.category]) g[s.category]=[]; g[s.category].push(s); }
    return g;
  }, [filtered]);

  return (
    <div className="grid" style={{ gap: 20 }}>
      <div className="card">
        <div className="grid" style={{gridTemplateColumns:'repeat(3, minmax(0,1fr))'}}>
          <div><div className="label">Intensity</div><select value={filters.intensity} onChange={e=>setFilters({...filters, intensity:e.target.value})}><option value="">Any</option><option>Gentle</option><option>Medium</option><option>Deep</option></select></div>
          <div><div className="label">Body area</div><select value={filters.bodyArea} onChange={e=>setFilters({...filters, bodyArea:e.target.value})}><option value="">Any</option><option>Foot</option><option>Back</option><option>Full body</option><option>Customizable</option></select></div>
          <div><div className="label">Duration</div><select value={filters.duration} onChange={e=>setFilters({...filters, duration:e.target.value})}><option value="">Any</option><option value="30">30</option><option value="60">60</option><option value="70">70</option><option value="90">90</option></select></div>
        </div>
      </div>

      {Object.keys(groups).length === 0 ? (
        <div className="card">No services match your filters.</div>
      ) : (
        Object.entries(groups).map(([cat,list])=> (
          <section key={cat}>
            <h2>{cat}</h2>
            <div className="grid cols-2">
              {list.map(s => <PriceCard key={s.id} s={s} />)}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
