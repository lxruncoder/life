// pages/shoplist/shoplist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 存储传递过来的数据
    query: {},
    shopList: [],
    page: 1,
    limit: 10,
    total: 0,
    flag: false
  },
  onLoad(options) {
    this.setData({
      query: options
    })
    this.getShopList()
  },
  getShopList(cb) {
    wx.showLoading({
      title: '数据请求中',
    })
    this.setData({
      flag: true
    })
    wx.request({
      url: `https://www.escook.cn/categories/${this.data.query.id}/shops`,
      method: 'GET',
      data: {
        _page: this.data.page,
        _limit: this.data.limit
      },
      // 箭头函数否则this不对
      success: (res) => {
        this.setData({
          shopList: [
            ...this.data.shopList,
            ...res.data
          ],
          total: res.header['X-Total-Count'] - 0 //转换为数字
        })
      },
      complete: () => {
        wx.hideLoading()
        this.setData({
          flag: false
        })
        cb && cb()
      }
    })
  },
  onReady() {
    wx.setNavigationBarTitle({
      title: this.data.query.title,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    // 刷新,将pages设置为0,容器清空,总条数清空
    this.setData({
      page:1,
      shopList:[],
      total:0
    })
    // 只有拉下刷新才会关闭,所以传递回调函数去调用
    this.getShopList(()=>{
      wx.stopPullDownRefresh()
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // 判断是否有下一页数据,如果当前页*每页显示的数量>=总条数就没有了
    if(this.data.page * this.data.limit >= this.data.total) {
      return wx.showToast({
        title: '没有更多数据了',
        icon:'none' //会默认显示一个对号的图标,让其不显示
      })
    }
    if(this.data.flag) return
    this.setData({
      page: this.data.page + 1
    })
    this.getShopList()

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})