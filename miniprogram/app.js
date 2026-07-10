App({
  globalData: { favorites: [] },
  onLaunch() { this.globalData.favorites = wx.getStorageSync("exercise-favorites") || []; }
});
