const api = require('../../../utils/api.js');//封装好的借口路径
const utils = require('../../../utils/util.js');//调用封装的request

Page({
    data: {
        tabs: ["全部订单","待付款","待收货","已收货"],
        activeIndex: "0",
        allOrder:[]
    },
    onLoad(options) {
        this.setData({
            activeIndex: options.id
        });
        // wx.navigateBack({
        //   delta: 1
        // })
        this.handleGetList();
    },
    tabClick(e) {
        this.setData({
            activeIndex: e.currentTarget.id
        });
    },
    handleGetList() {
         const data ={
                    user_id:3,
                    status:'',
                    orderBy:'',
                    distribution_id:''
                };
        utils.sendRequest(api.OrderInfoList, data, this.handleOrderInfoListSucc.bind(this));
    },
    handleOrderInfoListSucc(res) {
        this.setData({
            allOrder:res.data.data.reverse()
        })
        // console.log(this.data.allOrder)
    }
});