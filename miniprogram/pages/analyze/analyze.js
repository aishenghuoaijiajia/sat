const app = getApp()

Page({
    data: {
        analyze: ''
    },
    onLoad(option){
        const eventChannel = this.getOpenerEventChannel()
        // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
        eventChannel.on('analyze', (data) => {
            this.setData({
                analyze: data.analyze,
            })
            wx.setNavigationBarTitle({
                title: "题目" + data.num
            })
        })
    }
})
