//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    satPapersList: []
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    this.onGetSatPapers()
  },

  onSetUser: function() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res1 => {
              this.setData({
                avatarUrl: res1.userInfo.avatarUrl,
                userInfo: res1.userInfo
              })
              // 调用云函数
              wx.cloud.callFunction({
                name: 'login',
                data: {},
                success: res2 => {
                  const db = wx.cloud.database()
                  db.collection('userAuthor').where({
                    _openid: res2.result.openid
                  }).get({
                    success: function(res) {
                      if(res.data.length === 0){
                        db.collection('userAuthor').add({
                          data: {
                            right: false,
                            nickName: res1.userInfo.nickName
                          },
                          success: res => {
                            wx.showToast({
                              title: '新增记录成功',
                            })
                          },
                          fail: err => {
                            wx.showToast({
                              icon: 'none',
                              title: '新增记录失败'
                            })
                          }
                        })
                      }
                    }
                  })
                },
                fail: err => {
                  console.error('[云函数] [login] 调用失败', err)
                  wx.navigateTo({
                    url: '../deployFunctions/deployFunctions',
                  })
                }
              })
            }
          })
        }
      }
    })
  },

  onGetSatPapers: function() {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('satPapers').get({
      success: res => {
        this.setData({
          satPapersList: res.data
        })
        console.log('satPapersList: ', res.data)
      }
    })
  },

  goToAnwserList: function (event) {
    let index = event.currentTarget.dataset.index
    let data = this.data.satPapersList[index]
    wx.navigateTo({
      url: '../anwserList/anwserList',
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('paper', data)
      }
    })
  }
})
