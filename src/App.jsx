import {useState,useEffect,useMemo,useRef} from 'react'
import {useApp} from './store'
import {I,Logo,Avatar,Modal,Drawer} from './ui'
import {STAGES,revenue} from './data'

const NAV=['today','deals','people','inbox','calendar','reports']
const byId=(a,id)=>a.find(x=>x.id===id)
const DAY=864e5

/* ---------- Today ---------- */
function Today(){
 const {s,dispatch,t,L,money,fmt,date,nav}=useApp()
 const [open,setOpen]=useState(null)
 const h=new Date().getHours();const g=t.good[h<12?0:h<18?1:2]
 const openD=s.deals.filter(d=>d.stage!=='won');const pipe=openD.reduce((a,d)=>a+d.value,0)
 const wonV=s.deals.filter(d=>d.stage==='won').reduce((a,d)=>a+d.value,0)
 const kpis=[[t.pipeline,money(pipe),'+12%',true],[t.won,money(wonV),'+8%',true],[t.winrate,fmt(38)+'%','+3',true],[t.response,s.lang==='ar'?'٢٫٤ س':'2.4h','−18%',true]]
 const today=new Date();today.setHours(0,0,0,0)
 const tk=[...s.tasks].sort((a,b)=>a.done-b.done||a.due-b.due)
 const lab=d=>{const n=Math.round((d-today)/DAY);return n<0?t.overdue:n===0?t.dueToday:n===1?t.tomorrow:date(d)}
 const ev=s.events.filter(e=>e.day===0)
 const hot=[...openD].sort((a,b)=>a.close-b.close).slice(0,4)
 return <div className="page">
  <header className="ph"><div><p className="eyebrow">{date(Date.now(),{weekday:'long',month:'long',day:'numeric'})}</p><h1>{g}, {s.lang==='ar'?'طارق':'Tarek'}</h1></div></header>
  <section className="kpis">{kpis.map(([l,v,d],i)=><div className="kpi" key={i} style={{'--i':i}}><span>{l}</span><b>{v}</b><em>{d}</em></div>)}</section>
  <div className="cols">
   <section className="card"><div className="ch"><div><h2>{t.focus}</h2><p>{t.focusSub}</p></div></div>
    <ul className="tasks">{tk.map(k=>{const d=byId(s.deals,k.deal);return <li key={k.id} className={k.done?'done':''}>
     <button className="chk" onClick={()=>dispatch({t:'task',id:k.id})} aria-label={t.markDone} aria-pressed={k.done}><I n="check" s={14}/></button>
     <div><b>{L(k.title)}</b><small>{d&&L(d.title)}</small></div>
     <span className={'pill '+(lab(k.due)===t.overdue?'warn':'')}>{lab(k.due)}</span></li>})}</ul></section>
   <section className="card"><div className="ch"><h2>{t.schedule}</h2><button className="link" onClick={()=>nav('calendar')}>{t.calendar}</button></div>
    <ol className="tl">{ev.map(e=>{const p=byId(s.people,e.pid);const f=x=>String(Math.floor(x)).padStart(2,'0')+':'+(x%1?'30':'00');return <li key={e.id} className={e.kind}>
     <time>{f(e.s)}</time><div><b>{L(e.title)}</b><small>{L(p.name)} · {t[e.kind]}</small></div></li>})}</ol></section>
  </div>
  <section className="card"><div className="ch"><h2>{t.hot}</h2><button className="link" onClick={()=>nav('deals')}>{t.deals}</button></div>
   <div className="hotgrid">{hot.map(d=>{const p=byId(s.people,d.pid);return <button className="hot" key={d.id} onClick={()=>setOpen(d.id)}>
    <Avatar p={p} s={40}/><div><b>{L(d.title)}</b><small>{L(p.company)}</small></div><strong>{money(d.value)}</strong>
    <div className="bar"><i style={{width:d.prob+'%'}}/></div><span className="pill">{date(d.close)}</span></button>})}</div></section>
  {open&&<DealDrawer id={open} onClose={()=>setOpen(null)}/>}
 </div>}

/* ---------- Deals ---------- */
function DealDrawer({id,onClose}){
 const {s,dispatch,t,L,money,date,say}=useApp();const d=byId(s.deals,id);const p=byId(s.people,d.pid);const [n,setN]=useState('')
 const notes=s.notes[id]||[]
 return <Drawer onClose={onClose}>
  <p className="eyebrow">{t[d.stage==='won'?'wonS':d.stage]}</p><h2 className="dt">{L(d.title)}</h2>
  <div className="big">{money(d.value)}</div>
  <div className="seg" role="group" aria-label={t.stage}>{STAGES.map(st=><button key={st} className={d.stage===st?'on':''} onClick={()=>{dispatch({t:'stage',id,stage:st});say(`${t.moved} ${t[st==='won'?'wonS':st]}`)}}>{t[st==='won'?'wonS':st]}</button>)}</div>
  <dl className="facts"><div><dt>{t.prob}</dt><dd>{d.prob}%</dd></div><div><dt>{t.close}</dt><dd>{date(d.close,{year:'numeric',month:'short',day:'numeric'})}</dd></div></dl>
  <div className="person"><Avatar p={p}/><div><b>{L(p.name)}</b><small>{L(p.role)} · {L(p.company)}</small></div></div>
  <h4>{t.notes}</h4>
  <ul className="notes">{notes.map((x,i)=><li key={i}>{x.text}<small>{date(x.at,{hour:'numeric',minute:'2-digit'})}</small></li>)}</ul>
  <form className="row" onSubmit={e=>{e.preventDefault();if(!n.trim())return;dispatch({t:'note',id,text:n});setN('')}}>
   <input value={n} onChange={e=>setN(e.target.value)} placeholder={t.addNote}/><button className="btn">{t.save}</button></form>
 </Drawer>}
function Deals(){
 const {s,dispatch,t,L,money,date,say,fmt}=useApp();const [drag,setDrag]=useState(null);const [over,setOver]=useState(null);const [open,setOpen]=useState(null)
 return <div className="page wide"><header className="ph"><div><h1>{t.deals}</h1><p className="sub">{t.dragHint}</p></div></header>
 <div className="board">{STAGES.map(st=>{const ds=s.deals.filter(d=>d.stage===st);const tot=ds.reduce((a,d)=>a+d.value,0)
  return <section key={st} className={'col st-'+st+(over===st?' over':'')} onDragOver={e=>{e.preventDefault();setOver(st)}} onDragLeave={()=>setOver(null)}
   onDrop={()=>{if(drag){dispatch({t:'stage',id:drag,stage:st});say(`${t.moved} ${t[st==='won'?'wonS':st]}`)}setDrag(null);setOver(null)}}>
   <div className="colh"><i/><b>{t[st==='won'?'wonS':st]}</b><span className="cnt">{fmt(ds.length)}</span><em>{money(tot)}</em></div>
   <div className="cards">{ds.map(d=>{const p=byId(s.people,d.pid);return <article key={d.id} className={'dc'+(drag===d.id?' drag':'')} draggable tabIndex={0} onDragStart={()=>setDrag(d.id)} onDragEnd={()=>{setDrag(null);setOver(null)}}
    onClick={()=>setOpen(d.id)} onKeyDown={e=>e.key==='Enter'&&setOpen(d.id)}>
    <b>{L(d.title)}</b><div className="who"><Avatar p={p} s={22}/><small>{L(p.company)}</small></div>
    <div className="foot"><strong>{money(d.value)}</strong><span className="pill">{date(d.close)}</span></div>
    <div className="bar"><i style={{width:d.prob+'%'}}/></div></article>})}
    {!ds.length&&<p className="empty">{t.empty}</p>}</div></section>})}</div>
 {open&&<DealDrawer id={open} onClose={()=>setOpen(null)}/>}</div>}

/* ---------- People ---------- */
function People(){
 const {s,t,L,date,money,dispatch}=useApp();const [q,setQ]=useState('');const [sel,setSel]=useState(null);const [src,setSrc]=useState('all')
 const srcs=['all',...new Set(s.people.map(p=>p.source))]
 const rows=s.people.filter(p=>(src==='all'||p.source===src)&&(L(p.name)+L(p.company)).toLowerCase().includes(q.toLowerCase()))
 const p=sel&&byId(s.people,sel)
 return <div className="page"><header className="ph"><div><h1>{t.people}</h1><p className="sub">{rows.length} / {s.people.length}</p></div></header>
  <div className="toolbar"><div className="field"><I n="search" s={16}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder={t.search}/></div>
   <div className="chips">{srcs.map(x=><button key={x} className={'chip'+(src===x?' on':'')} onClick={()=>setSrc(x)}>{x==='all'?t.all:x}</button>)}</div></div>
  <div className="card tablecard"><table><thead><tr><th>{t.name}</th><th>{t.company}</th><th>{t.city}</th><th>{t.source}</th><th>{t.openDeals}</th><th>{t.lastTouch}</th></tr></thead>
  <tbody>{rows.map(r=>{const ds=s.deals.filter(d=>d.pid===r.id&&d.stage!=='won');return <tr key={r.id} tabIndex={0} onClick={()=>setSel(r.id)} onKeyDown={e=>e.key==='Enter'&&setSel(r.id)}>
   <td><div className="cellp"><Avatar p={r} s={32}/><div><b>{L(r.name)}</b><small>{L(r.role)}</small></div></div></td><td>{L(r.company)}</td><td>{L(r.city)}</td><td><span className="pill">{r.source}</span></td>
   <td>{ds.length?money(ds.reduce((a,d)=>a+d.value,0)):'—'}</td><td>{date(r.last)}</td></tr>})}</tbody></table>
   {!rows.length&&<p className="empty">{t.noResults}</p>}</div>
  {p&&<Drawer onClose={()=>setSel(null)}><div className="phead"><Avatar p={p} s={64}/><div><h2 className="dt">{L(p.name)}</h2><p className="sub">{L(p.role)} · {L(p.company)}</p></div></div>
   <ul className="contact"><li><I n="mail" s={16}/>{p.email}</li><li><I n="phone" s={16}/><bdi dir="ltr">{p.phone}</bdi></li><li><I n="pin" s={16}/>{L(p.city)}</li><li><I n="globe" s={16}/>{p.source}</li></ul>
   <h4>{t.deals}</h4>{s.deals.filter(d=>d.pid===p.id).map(d=><div className="mini" key={d.id}><b>{L(d.title)}</b><span className="pill">{t[d.stage==='won'?'wonS':d.stage]}</span><strong>{money(d.value)}</strong></div>)}
   <h4>{t.timeline}</h4><ol className="tl2">{[...(s.messages.find(m=>m.pid===p.id)?.msgs||[])].reverse().map(m=><li key={m.id}><small>{date(m.at)} · {m.dir==='in'?'←':'→'}</small>{L(m.text)}</li>)}</ol></Drawer>}
 </div>}

/* ---------- Inbox ---------- */
function Inbox(){
 const {s,dispatch,t,L,date,say}=useApp();const [id,setId]=useState(s.messages[0].id);const [txt,setTxt]=useState('');const end=useRef()
 const th=byId(s.messages,id);const p=byId(s.people,th.pid)
 useEffect(()=>{end.current?.scrollIntoView({block:'end'})},[th.msgs.length,id])
 useEffect(()=>{if(th.unread)dispatch({t:'read',id})},[id])
 const send=e=>{e.preventDefault();if(!txt.trim())return;dispatch({t:'reply',id,text:txt});setTxt('');say(t.sent)}
 return <div className="page wide inbox"><aside className="threads">{[...s.messages].sort((a,b)=>b.msgs.at(-1).at-a.msgs.at(-1).at).map(m=>{const pp=byId(s.people,m.pid);const last=m.msgs.at(-1)
  return <button key={m.id} className={'th'+(m.id===id?' on':'')+(m.unread?' unread':'')} onClick={()=>setId(m.id)}><Avatar p={pp}/><div><b>{L(pp.name)}</b><small>{L(last.text)}</small></div><time>{date(last.at)}</time></button>})}</aside>
  <section className="conv"><header><Avatar p={p}/><div><b>{L(p.name)}</b><small>{L(p.role)} · {L(p.company)}</small></div></header>
   <div className="msgs">{th.msgs.map(m=><div key={m.id} className={'bub '+m.dir}>{m.dir==='out'&&m.text.en===m.text.ar?m.text.en:L(m.text)}<small>{date(m.at,{hour:'numeric',minute:'2-digit'})}</small></div>)}<div ref={end}/></div>
   <form className="compose" onSubmit={send}><input value={txt} onChange={e=>setTxt(e.target.value)} placeholder={t.reply}/><button className="btn"><I n="send" s={16}/>{t.send}</button></form></section></div>}

/* ---------- Calendar ---------- */
function Calendar(){
 const {s,t,L,date}=useApp();const [sel,setSel]=useState(null);const base=new Date();base.setHours(0,0,0,0)
 const days=[...Array(5)].map((_,i)=>new Date(+base+i*DAY));const hrs=[...Array(10)].map((_,i)=>8+i)
 const ev=sel&&byId(s.events,sel);const nowH=new Date().getHours()+new Date().getMinutes()/60
 return <div className="page wide"><header className="ph"><div><h1>{t.calendar}</h1><p className="sub">{t.thisWeek}</p></div></header>
  <div className="card cal" style={{'--n':5}}><div className="calh"><span/>{days.map((d,i)=><div key={i} className={i===0?'tdy':''}><small>{date(d,{weekday:'short'})}</small><b>{date(d,{day:'numeric'})}</b></div>)}</div>
   <div className="calb"><div className="hrs">{hrs.map(h=><span key={h}>{String(h).padStart(2,'0')}:00</span>)}</div>
    {days.map((_,di)=><div className="dcol" key={di}>{hrs.map(h=><i key={h}/>)}{di===0&&nowH>=8&&nowH<18&&<u className="now" style={{top:(nowH-8)*56}}/>}
     {s.events.filter(e=>e.day===di).map(e=><button key={e.id} className={'ev '+e.kind} style={{top:(e.s-8)*56+2,height:(e.e-e.s)*56-4}} onClick={()=>setSel(e.id)}><b>{L(e.title)}</b><small>{t[e.kind]}</small></button>)}</div>)}</div></div>
  {ev&&<Modal title={L(ev.title)} onClose={()=>setSel(null)}><div className="person"><Avatar p={byId(s.people,ev.pid)}/><div><b>{L(byId(s.people,ev.pid).name)}</b><small>{L(byId(s.people,ev.pid).company)}</small></div></div><p className="sub">{t[ev.kind]} · {String(Math.floor(ev.s)).padStart(2,'0')}:{ev.s%1?'30':'00'} – {String(Math.floor(ev.e)).padStart(2,'0')}:{ev.e%1?'30':'00'}</p></Modal>}</div>}

/* ---------- Reports ---------- */
function Reports(){
 const {s,t,L,money,fmt}=useApp()
 const mx=Math.max(...revenue);const W=560,H=200
 const pts=revenue.map((v,i)=>[24+i*(W-48)/11,H-24-(v/mx)*(H-56)])
 const path=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ')
 const mo=[...Array(12)].map((_,i)=>new Intl.DateTimeFormat(s.lang==='ar'?'ar-EG':'en-US',{month:'narrow'}).format(new Date(2026,i,1)))
 const fun=STAGES.map(st=>({st,n:s.deals.filter(d=>d.stage===st).length,v:s.deals.filter(d=>d.stage===st).reduce((a,d)=>a+d.value,0)}))
 const fm=Math.max(...fun.map(f=>f.v))
 const srcs=Object.entries(s.people.reduce((a,p)=>(a[p.source]=(a[p.source]||0)+1,a),{}))
 const col=['var(--brand)','var(--saffron)','var(--coral)','var(--sky)'];const tot=s.people.length
 let acc=0;const R=52,C=2*Math.PI*R
 const top=[...s.deals].filter(d=>d.stage!=='won').sort((a,b)=>b.value-a.value).slice(0,5)
 return <div className="page"><header className="ph"><div><h1>{t.reports}</h1></div></header>
  <div className="rgrid">
   <section className="card span2"><div className="ch"><h2>{t.revTrend}</h2><strong className="big sm">{money(revenue.reduce((a,b)=>a+b,0)*1000)}</strong></div>
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label={t.revTrend}><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--brand)" stopOpacity=".28"/><stop offset="1" stopColor="var(--brand)" stopOpacity="0"/></linearGradient></defs>
     {[0,1,2,3].map(i=><line key={i} x1="24" x2={W-24} y1={H-24-i*(H-56)/3} y2={H-24-i*(H-56)/3} className="grid"/>)}
     <path d={`${path} L${pts.at(-1)[0]} ${H-24} L${pts[0][0]} ${H-24}Z`} fill="url(#g)"/><path d={path} className="line"/>
     {pts.map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r={i===11?5:3} className={i===11?'dot hi':'dot'}/>)}
     {mo.map((m,i)=><text key={i} x={pts[i][0]} y={H-6} textAnchor="middle" className="ax">{m}</text>)}</svg></section>
   <section className="card"><div className="ch"><h2>{t.sources}</h2></div><div className="donutw"><svg viewBox="0 0 140 140" className="donut">{srcs.map(([k,n],i)=>{const len=n/tot*C;const el=<circle key={k} cx="70" cy="70" r={R} fill="none" stroke={col[i%4]} strokeWidth="18" strokeDasharray={`${len-2} ${C}`} strokeDashoffset={-acc} transform="rotate(-90 70 70)"/>;acc+=len;return el})}<text x="70" y="76" textAnchor="middle" className="dn">{fmt(tot)}</text></svg>
     <ul className="leg">{srcs.map(([k,n],i)=><li key={k}><i style={{background:col[i%4]}}/>{k}<b>{fmt(n)}</b></li>)}</ul></div></section>
   <section className="card"><div className="ch"><h2>{t.funnel}</h2></div><div className="fun">{fun.map(f=><div key={f.st}><span>{t[f.st==='won'?'wonS':f.st]}</span><div className="fb"><i className={'st-'+f.st} style={{width:Math.max(6,f.v/fm*100)+'%'}}/></div><b>{money(f.v)}</b></div>)}</div></section>
   <section className="card span2"><div className="ch"><h2>{t.topDeals}</h2></div><ol className="rank">{top.map((d,i)=><li key={d.id}><span>{fmt(i+1)}</span><div><b>{L(d.title)}</b><small>{L(byId(s.people,d.pid).company)}</small></div><strong>{money(d.value)}</strong></li>)}</ol></section>
  </div></div>}

/* ---------- Palette & new deal ---------- */
function Palette({onClose,onNew}){
 const {s,t,L,nav,dispatch}=useApp();const [q,setQ]=useState('');const [i,setI]=useState(0)
 const items=useMemo(()=>[
  ...NAV.map(r=>({g:t.jump,l:t[r],k:()=>nav(r),ic:r})),
  {g:t.actions,l:t.newDeal,k:onNew,ic:'plus'},
  {g:t.actions,l:t.theme,k:()=>dispatch({t:'set',p:{theme:s.theme==='dark'?'light':'dark'}}),ic:'moon'},
  {g:t.actions,l:t.lang,k:()=>dispatch({t:'set',p:{lang:s.lang==='ar'?'en':'ar'}}),ic:'globe'},
  ...s.people.map(p=>({g:t.people,l:L(p.name),sub:L(p.company),k:()=>nav('people'),ic:'people'})),
  ...s.deals.map(d=>({g:t.deals,l:L(d.title),sub:L(byId(s.people,d.pid).company),k:()=>nav('deals'),ic:'deals'}))
 ].filter(x=>(x.l+(x.sub||'')).toLowerCase().includes(q.toLowerCase())).slice(0,9),[q,s.lang,s.theme])
 const run=x=>{onClose();x.k()}
 return <div className="scrim top" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className="pal" role="dialog">
  <div className="field"><I n="search"/><input autoFocus value={q} onChange={e=>{setQ(e.target.value);setI(0)}} placeholder={t.search}
   onKeyDown={e=>{if(e.key==='ArrowDown'){e.preventDefault();setI(v=>Math.min(v+1,items.length-1))}if(e.key==='ArrowUp'){e.preventDefault();setI(v=>Math.max(v-1,0))}if(e.key==='Enter'&&items[i])run(items[i]);if(e.key==='Escape')onClose()}}/></div>
  <ul>{items.map((x,n)=><li key={n} className={n===i?'on':''} onMouseEnter={()=>setI(n)} onClick={()=>run(x)}><I n={x.ic} s={16}/><span>{x.l}{x.sub&&<small>{x.sub}</small>}</span><em>{x.g}</em></li>)}{!items.length&&<li className="empty">{t.noResults}</li>}</ul></div></div>}
function NewDeal({onClose}){
 const {s,dispatch,t,L,say,nav}=useApp();const [title,setT]=useState('');const [val,setV]=useState('');const [pid,setP]=useState(s.people[0].id)
 return <Modal title={t.newDeal} onClose={onClose}><form className="form" onSubmit={e=>{e.preventDefault();if(!title.trim())return
  dispatch({t:'deal',deal:{id:'d'+Date.now(),pid,title:{en:title,ar:title},value:+val||0,stage:'lead',prob:15,close:Date.now()+30*DAY}});say(t.created);nav('deals');onClose()}}>
  <label>{t.title}<input autoFocus value={title} onChange={e=>setT(e.target.value)}/></label>
  <label>{t.value}<input type="number" min="0" value={val} onChange={e=>setV(e.target.value)} inputMode="numeric"/></label>
  <label>{t.owner}<select value={pid} onChange={e=>setP(e.target.value)}>{s.people.map(p=><option key={p.id} value={p.id}>{L(p.name)} — {L(p.company)}</option>)}</select></label>
  <div className="row end"><button type="button" className="btn ghost" onClick={onClose}>{t.cancel}</button><button className="btn">{t.create}</button></div></form></Modal>}

/* ---------- Shell ---------- */
export default function App(){
 const {s,dispatch,t,route,nav,toast}=useApp();const [pal,setPal]=useState(false);const [nd,setNd]=useState(false)
 useEffect(()=>{const f=e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setPal(v=>!v)}};addEventListener('keydown',f);return()=>removeEventListener('keydown',f)},[])
 const V={today:Today,deals:Deals,people:People,inbox:Inbox,calendar:Calendar,reports:Reports}[route]||Today
 const unread=s.messages.filter(m=>m.unread).length
 return <div className="app">
  <nav className="rail" aria-label="Main"><a className="brand" href="#today"><Logo/><span>{t.app}</span></a>
   {NAV.map(r=><a key={r} href={'#'+r} className={'ni'+(route===r||(!route&&r==='today')?' on':'')}><I n={r}/><span>{t[r]}</span>{r==='inbox'&&unread>0&&<em>{unread}</em>}</a>)}
   <p className="tag">{t.tag}</p></nav>
  <div className="main"><header className="top"><button className="searchbtn" onClick={()=>setPal(true)}><I n="search" s={16}/><span>{t.search}</span><kbd>⌘K</kbd></button>
   <div className="tools"><button className="btn" onClick={()=>setNd(true)}><I n="plus" s={16}/>{t.newDeal}</button>
   <button className="ib" aria-label={t.theme} onClick={()=>dispatch({t:'set',p:{theme:s.theme==='dark'?'light':'dark'}})}><I n={s.theme==='dark'?'sun':'moon'}/></button>
   <button className="btn ghost" onClick={()=>dispatch({t:'set',p:{lang:s.lang==='ar'?'en':'ar'}})}>{t.lang}</button></div></header>
   <main key={route}><V/></main></div>
  <nav className="tabbar" aria-label="Tabs">{NAV.map(r=><a key={r} href={'#'+r} className={route===r?'on':''}><I n={r}/><span>{t[r]}</span></a>)}</nav>
  {pal&&<Palette onClose={()=>setPal(false)} onNew={()=>setNd(true)}/>}{nd&&<NewDeal onClose={()=>setNd(false)}/>}
  {toast&&<div className="toast" role="status">{toast}</div>}
  {s.tour&&<div className="tour"><Logo s={28}/><div><b>{t.tourTitle}</b><p>{t.tour}</p></div><button className="btn" onClick={()=>dispatch({t:'set',p:{tour:false}})}>{t.gotit}</button></div>}
 </div>}
