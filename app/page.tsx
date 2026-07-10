"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";

type Exercise = {
  id:string; nameZh:string; nameEn:string; category:string; equipment:string;
  target:string; muscleGroup:string; secondaryMuscles:string[]; steps:string[];
  image:string; gif:string; attribution:string;
};

const parts = ["全部", "胸部", "肩部", "背部", "上臂", "前臂", "大腿", "小腿", "腰腹", "颈部", "有氧"];
const fallback: Exercise[] = [
  { id:"0025",nameZh:"杠铃卧推",nameEn:"barbell bench press",category:"胸部",equipment:"杠铃",target:"胸大肌",muscleGroup:"肱三头肌",secondaryMuscles:["肱三头肌","肩部肌群"],steps:["仰卧在训练凳上，双脚踩稳地面。","双手略宽于肩握住杠铃，收紧肩胛。","控制杠铃下降至胸部，再平稳推回起始位置。"],image:"https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0025-EIeI8Vf.jpg",gif:"https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0025-EIeI8Vf.gif",attribution:"© Gym visual — https://gymvisual.com/" },
  { id:"0043",nameZh:"杠铃深蹲",nameEn:"barbell full squat",category:"大腿",equipment:"杠铃",target:"臀肌",muscleGroup:"股四头肌",secondaryMuscles:["腘绳肌","小腿肌"],steps:["将杠铃稳定置于上背部，双脚与肩同宽。","收紧核心，髋部向后下方移动。","下蹲至大腿低于平行位置，再通过全脚掌发力站起。"],image:"https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0043-qXTaZnJ.jpg",gif:"https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0043-qXTaZnJ.gif",attribution:"© Gym visual — https://gymvisual.com/" },
  { id:"0652",nameZh:"引体向上",nameEn:"pull-up",category:"背部",equipment:"自重",target:"背阔肌",muscleGroup:"肱二头肌",secondaryMuscles:["前臂肌","核心肌群"],steps:["正握单杠，双手略宽于肩。","下沉肩胛并收紧核心，将胸部拉向单杠。","控制身体下降至手臂完全伸直。"],image:"https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0652-lBDjFxJ.jpg",gif:"https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0652-lBDjFxJ.gif",attribution:"© Gym visual — https://gymvisual.com/" },
];

function Card({ item, saved, onOpen, onSave }: { item:Exercise; saved:boolean; onOpen:()=>void; onSave:()=>void }) {
  return <article className="exercise-card">
    <div className="card-media" onClick={onOpen} role="button" tabIndex={0} onKeyDown={(e)=>{if(e.key==="Enter") onOpen();}} aria-label={`查看${item.nameZh}详情`}>
      <img src={item.image} alt={`${item.nameZh}动作示意`} loading="lazy" />
      <button className={saved ? "saved" : ""} onClick={(e)=>{e.stopPropagation();onSave();}} aria-label={`${saved?"取消收藏":"收藏"}${item.nameZh}`}>{saved ? "♥" : "♡"}</button>
    </div>
    <div className="card-body">
      <div className="tags"><span>{item.category}</span><span>{item.equipment}</span></div>
      <h3>{item.nameZh}</h3><small className="english-name">{item.nameEn}</small>
      <p>主要目标：{item.target}</p>
      <button className="detail-link" onClick={onOpen}>查看中文步骤 <span>→</span></button>
    </div>
  </article>;
}

export default function Home() {
  const [items,setItems]=useState<Exercise[]>(fallback);
  const [loaded,setLoaded]=useState(false);
  const [query,setQuery]=useState("");
  const [activePart,setActivePart]=useState("全部");
  const [activeEquipment,setActiveEquipment]=useState("全部器械");
  const [limit,setLimit]=useState(24);
  const [detail,setDetail]=useState<Exercise|null>(null);
  const [favorites,setFavorites]=useState<Set<string>>(()=>{
    if(typeof window==="undefined") return new Set();
    try { return new Set(JSON.parse(localStorage.getItem("exercise-favorites")||"[]")); } catch { return new Set(); }
  });
  const [onlySaved,setOnlySaved]=useState(false);

  useEffect(()=>{
    fetch("/data/exercises-cn.json").then((r)=>r.json()).then((data:Exercise[])=>{setItems(data);setLoaded(true);}).catch(()=>setLoaded(true));
  },[]);
  useEffect(()=>{ if(detail){document.body.style.overflow="hidden";} else document.body.style.overflow=""; return()=>{document.body.style.overflow="";}; },[detail]);

  const equipmentOptions=useMemo(()=>["全部器械",...Array.from(new Set(items.map(x=>x.equipment))).sort((a,b)=>a.localeCompare(b,"zh-CN"))],[items]);
  const filtered=useMemo(()=>{
    const q=query.trim().toLowerCase();
    return items.filter(x=>(activePart==="全部"||x.category===activePart)&&(activeEquipment==="全部器械"||x.equipment===activeEquipment)&&(!onlySaved||favorites.has(x.id))&&(!q||`${x.nameZh} ${x.nameEn} ${x.category} ${x.equipment} ${x.target} ${x.muscleGroup}`.toLowerCase().includes(q)));
  },[items,query,activePart,activeEquipment,onlySaved,favorites]);
  const shown=filtered.slice(0,limit);
  function toggleSave(id:string){setFavorites(prev=>{const next=new Set(prev);if(next.has(id)) next.delete(id); else next.add(id);localStorage.setItem("exercise-favorites",JSON.stringify([...next]));return next;});}
  function resetPage(){setLimit(24);}
  function randomExercise(){const pool=filtered.length?filtered:items;setDetail(pool[Math.floor(Math.random()*pool.length)]);}

  return <main>
    <header className="site-header">
      <a className="brand" href="#top" aria-label="练动库首页"><span className="brand-mark">动</span><span>练动库</span></a>
      <nav aria-label="主导航"><a className="active" href="#top">首页</a><a href="#library">动作库</a><a href="#about">数据说明</a></nav>
      <button className="nav-favorite" onClick={()=>{setOnlySaved(!onlySaved);document.querySelector("#library")?.scrollIntoView({behavior:"smooth"});}}>♥ {favorites.size}</button>
      <button className="primary small" onClick={randomExercise}>随机动作 <span>↗</span></button>
    </header>

    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow"><span /> 科学训练，从动作开始</p>
        <h1>专业的健身<br /><strong>动作数据库</strong></h1>
        <p className="lede">收录 1,324 个标准动作，覆盖 10 大身体部位与 28 种器械。中文分步指导，让每一次训练更准确、更安心。</p>
        <form className="search" onSubmit={(e)=>{e.preventDefault();resetPage();document.querySelector("#library")?.scrollIntoView({behavior:"smooth"});}}>
          <span className="icon" aria-hidden="true">⌕</span><input value={query} onChange={(e)=>{setQuery(e.target.value);resetPage();}} aria-label="搜索动作" placeholder="搜索动作、部位或器械"/><button type="submit" aria-label="提交搜索">→</button>
        </form>
        <div className="stats" aria-label="数据集统计"><div><b>1,324</b><span>标准动作</span></div><div><b>10</b><span>身体部位</span></div><div><b>28</b><span>器械类型</span></div></div>
      </div>
      <div className="hero-visual" role="img" aria-label="两位健身者正在热身"><div className="hero-badge"><span>✓</span><div><b>中文指导</b><small>逐步讲解动作要领</small></div></div></div>
    </section>

    <section className="library" id="library">
      <div className="section-heading"><div><p className="eyebrow"><span /> 动作库</p><h2>{onlySaved?"我的收藏":"找到适合你的训练动作"}</h2></div><p>{loaded?`已从 1,324 个动作中筛选出 ${filtered.length} 个结果`:`正在载入完整中文动作库…`}</p></div>
      <div className="filter-row" role="group" aria-label="按身体部位筛选">{parts.map(part=><button key={part} className={activePart===part?"selected":""} onClick={()=>{setActivePart(part);resetPage();}}>{part}</button>)}</div>
      <div className="toolbar">
        <label>器械<select value={activeEquipment} onChange={(e)=>{setActiveEquipment(e.target.value);resetPage();}}>{equipmentOptions.map(v=><option key={v}>{v}</option>)}</select></label>
        <label className="compact-search"><span>⌕</span><input value={query} onChange={(e)=>{setQuery(e.target.value);resetPage();}} placeholder="搜索中文或英文动作名" aria-label="在动作库中搜索"/></label>
        {(query||activePart!=="全部"||activeEquipment!=="全部器械"||onlySaved)&&<button className="clear" onClick={()=>{setQuery("");setActivePart("全部");setActiveEquipment("全部器械");setOnlySaved(false);resetPage();}}>清除筛选</button>}
      </div>
      <div className="cards">{shown.map(item=><Card key={item.id} item={item} saved={favorites.has(item.id)} onOpen={()=>setDetail(item)} onSave={()=>toggleSave(item.id)}/>)}{shown.length===0&&<div className="empty">没有找到匹配动作，换个关键词或筛选条件试试。</div>}</div>
      {shown.length<filtered.length&&<button className="load-more" onClick={()=>setLimit(v=>v+24)}>加载更多 <span>{shown.length} / {filtered.length}</span></button>}
    </section>

    <section className="about" id="about"><div><b>数据与版权说明</b><p>动作结构和中文说明采用 MIT 许可的 Exercises Dataset；媒体版权归 Gym visual 所有，请遵守其单独许可条款。本应用仅作学习与健身动作检索，不构成医疗建议。</p></div><a href="https://github.com/hasaneyldrm/exercises-dataset" target="_blank" rel="noreferrer">查看原始数据与许可 ↗</a></section>

    {detail&&<div className="modal-backdrop" role="presentation" onMouseDown={(e)=>{if(e.target===e.currentTarget)setDetail(null);}}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <button className="modal-close" onClick={()=>setDetail(null)} aria-label="关闭详情">×</button>
        <div className="modal-media"><img src={detail.gif} alt={`${detail.nameZh}动态示范`}/><small>{detail.attribution}</small></div>
        <div className="modal-content"><p className="eyebrow"><span/> 动作 #{detail.id}</p><h2 id="detail-title">{detail.nameZh}</h2><p className="modal-en">{detail.nameEn}</p>
          <div className="detail-meta"><div><span>身体部位</span><b>{detail.category}</b></div><div><span>训练器械</span><b>{detail.equipment}</b></div><div><span>主要目标</span><b>{detail.target}</b></div></div>
          <h3>动作步骤</h3><ol className="steps">{detail.steps.map((step,i)=><li key={i}><span>{i+1}</span><p>{step}</p></li>)}</ol>
          <div className="muscle-note"><b>参与肌群</b><span>{[detail.muscleGroup,...detail.secondaryMuscles].filter((v,i,a)=>v&&a.indexOf(v)===i).join(" · ")}</span></div>
          <div className="modal-actions"><button className={favorites.has(detail.id)?"primary action saved-action":"primary action"} onClick={()=>toggleSave(detail.id)}>{favorites.has(detail.id)?"♥ 已收藏":"♡ 收藏动作"}</button><button className="secondary action" onClick={randomExercise}>换一个动作</button></div>
        </div>
      </section>
    </div>}
  </main>;
}
