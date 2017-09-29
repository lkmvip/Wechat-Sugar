    // pages/user/like/like.js
Page({

    /**
    * 页面的初始数据
    */
    data: {
        itemList:[
            {tit:"化妆品面霜",way:"面霜也能清清爽爽",url:"/image/like/left.png",new:120,old:240},
            {tit:"化妆品面霜",way:"面霜也能清清爽爽",url:"/image/like/left.png",new:120,old:240},
            {tit:"化妆品面霜",way:"面霜也能清清爽爽",url:"/image/like/left.png",new:120,old:240},
            {tit:"化妆品面霜",way:"面霜也能清清爽爽",url:"/image/like/left.png",new:120,old:240},
            {tit:"化妆品面霜",way:"面霜也能清清爽爽",url:"/image/like/left.png",new:120,old:240}
        ]
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {

    },
    handleDelLike(e) {
        const index = e.currentTarget.dataset.id;
        let list = this.data.itemList;
        let _this =this;
        list.splice(index,1);
        wx.showModal({
            title:'提示',
            content:'您确定要删除嘛？',
            showCancel:true,
            confirmColor:'#3cc51f',//默认值为#3cc51f
            success:function(res){
                if(res.confirm){
                    _this.setData({
                      itemList: list
                    });
                }
            }
        })
    }
   
})