const exercises=require("../../data/exercises.js");
Page({
  data:{item:null,saved:false},
  onLoad(options){const raw=exercises.find(x=>x.id===options.id)||exercises[0];const item=this.enrich(raw);this.setData({item,saved:(wx.getStorageSync("exercise-favorites")||[]).includes(item.id)});wx.setNavigationBarTitle({title:item.nameZh});},
  toggleFavorite(){let list=wx.getStorageSync("exercise-favorites")||[];const id=this.data.item.id;list=list.includes(id)?list.filter(x=>x!==id):[...list,id];wx.setStorageSync("exercise-favorites",list);this.setData({saved:list.includes(id)});},
  random(){const item=this.enrich(exercises[Math.floor(Math.random()*exercises.length)]);this.setData({item,saved:(wx.getStorageSync("exercise-favorites")||[]).includes(item.id)});wx.setNavigationBarTitle({title:item.nameZh});},
  enrich(raw){return {...raw,musclesText:[raw.muscleGroup,...raw.secondaryMuscles].filter((v,i,a)=>v&&a.indexOf(v)===i).join(" · ")};}
});
