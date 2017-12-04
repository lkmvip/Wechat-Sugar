const api = require('../../../utils/api.js');//封装好的接口路径
const utils = require('../../../utils/util.js');//调用封装的request
Page({

    /**
    * 页面的初始数据
    */
    data: {
        itemList:[]
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad(options) {
        this.getLikeList();
        let card = wx.getStorageSync('UserCard');
        this.setData({
            userId:card.user_id
        })
    },
    getLikeList() {
        let userId = this.data.userId;
        const data ={
            userid:userId,
            limit:''
        };
        //调用收藏商品接口
        utils.sendRequest(api.LikeInfoUrl, data, this.handleLikeInfoSucc.bind(this));
    },
    handleLikeInfoSucc(res) {
        console.log(res)
        try {
            this.setData({
                itemList:res.data.data,
                num:res.data.data.length
            });

        } catch(e) {
            // statements
            console.log(e);
        }
        
    },
    //取消收藏处理逻辑
    handleDelLike(e) {
        const id = e.currentTarget.dataset.id,
            index = e.currentTarget.dataset.index,
            userId = this.data.userId;
        let list = this.data.itemList,
            _this =this;
        list.splice(index,1);
        wx.showModal({
            content:'您确定要删除嘛？',
            showCancel:true,
            confirmColor:'#3cc51f',//默认值为#3cc51f
            success:function(res){
                if(res.confirm){
                    _this.setData({
                      itemList: list,
                      num:list.length
                    });
                    const data ={
                        userid:userId,
                        id:id
                    };
                    utils.sendRequest(api.LikeInfoDel, data, _this.handleCancelLikeSucc.bind(_this));
                }
            }
        })
    },
    handleCancelLikeSucc(res) {}
   
})