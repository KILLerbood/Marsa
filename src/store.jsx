import {createContext,useContext,useEffect,useReducer,useState,useCallback} from 'react'
import {T} from './i18n'
import {people,deals,messages,tasks,events} from './data'
const Ctx=createContext()
const KEY='marsa.v1'
const init=()=>{let s={};try{s=JSON.parse(localStorage.getItem(KEY)||'{}')}catch{}
return {lang:s.lang||(navigator.language?.startsWith('ar')?'ar':'en'),theme:s.theme||'light',tour:s.tour??true,people,deals,messages,tasks,events,notes:{}}}
function red(s,a){switch(a.t){
case'set':return{...s,...a.p}
case'stage':return{...s,deals:s.deals.map(x=>x.id===a.id?{...x,stage:a.stage,prob:a.stage==='won'?100:x.stage==='won'?50:x.prob}:x)}
case'task':return{...s,tasks:s.tasks.map(x=>x.id===a.id?{...x,done:!x.done}:x)}
case'deal':return{...s,deals:[a.deal,...s.deals]}
case'person':return{...s,people:[a.p,...s.people]}
case'reply':return{...s,messages:s.messages.map(m=>m.id===a.id?{...m,unread:false,msgs:[...m.msgs,{id:'n'+Date.now(),dir:'out',text:{en:a.text,ar:a.text},at:Date.now()}]}:m)}
case'read':return{...s,messages:s.messages.map(m=>m.id===a.id?{...m,unread:false}:m)}
case'note':return{...s,notes:{...s.notes,[a.id]:[...(s.notes[a.id]||[]),{text:a.text,at:Date.now()}]}}
default:return s}}
export function Provider({children}){
 const [s,dispatch]=useReducer(red,null,init)
 const [toast,setToast]=useState(null)
 const [route,setRoute]=useState(location.hash.slice(1)||'today')
 useEffect(()=>{const f=()=>setRoute(location.hash.slice(1)||'today');addEventListener('hashchange',f);return()=>removeEventListener('hashchange',f)},[])
 useEffect(()=>{document.documentElement.lang=s.lang;document.documentElement.dir=s.lang==='ar'?'rtl':'ltr';document.documentElement.dataset.theme=s.theme
  try{localStorage.setItem(KEY,JSON.stringify({lang:s.lang,theme:s.theme,tour:s.tour}))}catch{}},[s.lang,s.theme,s.tour])
 const tt=T[s.lang]
 const L=useCallback(o=>o?.[s.lang]??o,[s.lang])
 const say=useCallback(m=>{setToast(m);setTimeout(()=>setToast(null),2200)},[])
 const nav=r=>{location.hash=r}
 const fmt=n=>new Intl.NumberFormat(s.lang==='ar'?'ar-EG':'en-US',{maximumFractionDigits:0}).format(n)
 const money=n=>(s.lang==='ar'?'':'$')+(n>=1000?fmt(Math.round(n/100)/10)+(s.lang==='ar'?' ألف $':'k'):fmt(n))
 const date=(ts,o={month:'short',day:'numeric'})=>new Intl.DateTimeFormat(s.lang==='ar'?'ar-EG':'en-US',o).format(ts)
 return <Ctx.Provider value={{s,dispatch,t:tt,L,say,toast,route,nav,fmt,money,date}}>{children}</Ctx.Provider>}
export const useApp=()=>useContext(Ctx)
