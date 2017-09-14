Page({
    data: {
        inputShowed: false,
        inputVal: "",
        classifyTab: [
            {name:'品牌',id:0},
            {name:'分类',id:1}
        ],
        tabIdx: 0
    },

    handleClickGoods: function(e) {
        console.log(e)
        this.setData({
            tabIdx : e.target.dataset.index
        })
    }
});