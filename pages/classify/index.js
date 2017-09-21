Page({
    data: {
        inputShowed: false,
        inputVal: "",
        classifyTab: [
            {name:'品牌',id:0},
            {name:'分类',id:1}
        ],
        tabIdx: 0,
        classifyFlag: true,
        listTab: [
            {name:'化妆品',id:0},
            {name:'洁面',id:1},
            {name:'防晒',id:2},
            {name:'男士',id:3}
        ],
        leftTab: 0,
    },
    // 点击分类里面的细分选项卡
    handleClickGoods: function(e) {
        this.setData({
            tabIdx : e.target.dataset.index
        })
    },
    // 点击选项卡切换品牌和分类
    handleClickTabs: function(e) {
        this.setData({
            leftTab : e.target.dataset.index
        })
    }
});