const allExercises = require("../../data/exercises.js");

Page({
  data: {
    exercises: [], shown: [], query: "", activePart: "全部", activeEquipment: "全部器械",
    parts: ["全部","胸部","肩部","背部","上臂","前臂","大腿","小腿","腰腹","颈部","有氧"],
    equipment: ["全部器械"], limit: 20, resultCount: 1324, favorites: []
  },
  onLoad(){
    const equipment=["全部器械",...Array.from(new Set(allExercises.map(x=>x.equipment))).sort()];
    this.setData({exercises:allExercises,equipment,favorites:wx.getStorageSync("exercise-favorites")||[]});
    this.applyFilters();
  },
  onShow(){this.setData({favorites:wx.getStorageSync("exercise-favorites")||[]});},
  onPullDownRefresh(){this.setData({query:"",activePart:"全部",activeEquipment:"全部器械",limit:20});this.applyFilters();wx.stopPullDownRefresh();},
  onSearch(e){this.setData({query:e.detail.value,limit:20});this.applyFilters();},
  choosePart(e){this.setData({activePart:e.currentTarget.dataset.part,limit:20});this.applyFilters();},
  chooseEquipment(e){this.setData({activeEquipment:this.data.equipment[e.detail.value],limit:20});this.applyFilters();},
  applyFilters(){
    const {query,activePart,activeEquipment,limit,favorites}=this.data; const q=query.trim().toLowerCase();
    const result=allExercises.filter(x=>(activePart==="全部"||x.category===activePart)&&(activeEquipment==="全部器械"||x.equipment===activeEquipment)&&(!q||`${x.nameZh} ${x.nameEn} ${x.category} ${x.equipment} ${x.target}`.toLowerCase().includes(q)));
    this.setData({shown:result.slice(0,limit).map(x=>({...x,saved:favorites.includes(x.id)})),resultCount:result.length});
  },
  loadMore(){this.setData({limit:this.data.limit+20});this.applyFilters();},
  openDetail(e){wx.navigateTo({url:`/pages/detail/detail?id=${e.currentTarget.dataset.id}`});},
  random(){const x=allExercises[Math.floor(Math.random()*allExercises.length)];wx.navigateTo({url:`/pages/detail/detail?id=${x.id}`});},
  toggleFavorite(e){
    const id=e.currentTarget.dataset.id;let list=wx.getStorageSync("exercise-favorites")||[];
    list=list.includes(id)?list.filter(x=>x!==id):[...list,id];wx.setStorageSync("exercise-favorites",list);this.setData({favorites:list},()=>this.applyFilters());
  },
  noop(){}
});
