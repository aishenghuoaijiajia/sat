const app = getApp()

Page({
    data: {
        navActiveIndex: 0,
        paper: {},
        items: [],
        nav: ['阅读','语法']
    },
    onLoad(option){
        const eventChannel = this.getOpenerEventChannel()
        // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
        eventChannel.on('paper', (data) => {
            this.setData({
                paper: data,
                items: data.read
            })
            wx.setNavigationBarTitle({
                title: data.name
            })
        })

    },
    onItemActive(event){
        console.log(event.currentTarget.id)
        let index = event.currentTarget.id
        let data = this.data.items[index]
        wx.navigateTo({
            url: './../analyze/analyze',
            success: function(res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('analyze', data)
            }
        })
    },
    onNavClick(e) {
        if(this.data.navActiveIndex != e.currentTarget.id){
            let id = e.currentTarget.id
            this.setData({
                navActiveIndex: id
            })
            let type = this.data.nav[id]
            if(type == "阅读"){
                this.setData({
                    items: this.data.paper.read
                })
            }
            if(type == "语法"){
                this.setData({
                    items: this.data.paper.grammar
                })
            }
        }
    }
})
