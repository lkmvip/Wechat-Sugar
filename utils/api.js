var NoOne = 'https://wstcsd.1haomei.com',
	NewApiRootUrl = NoOne+'/html/shop/index.php/WstInterFace/GetProduct/',//全部商品接口
	BannerImg = NoOne+'/html/shop/index.php/WstInterFace/ShopDecoration/',//轮播图接口
	ShopCart =NoOne +'/html/shop/index.php/WstInterFace/ShoppingCart/',//购物车接口
	Classify =NoOne +'/html/shop/index.php/WstInterFace/GoodsType/',//分类接口
	BrandInfo =NoOne +'/html/shop/index.php/WstInterFace/BrandInfo/',//分类品牌接口
	DetailInfo =NoOne +'/html/shop/index.php/WstInterFace/goodsDetailsServic/',//详情接口
	LikeInfo =NoOne +'/html/shop/index.php/WstInterFace/Collection/',//详情接口
	OrderInfo =NoOne +'/html/shop/index.php/WstInterFace/goodsDetails/';//结算订单接口

module.exports = {
	NoOneJson:NoOne+'/html/shop/Public/Home/js/data.json',//地址json
	IndexUrl:NewApiRootUrl+ 'getIndexProduct',//首页信息
	TabUrl:NewApiRootUrl+ 'getNavProduct',//选项卡信息
	BannerUrl:BannerImg+'getBanner',
	AllGoodsUrl:NewApiRootUrl+'getProduct',//搜索信息
	AddGoodtoCart:ShopCart+'AddGoodtoCart',//添加购物车
	ClassifyUrl:Classify+'getGoodsType',//
	AllType:Classify+'getAllGoodsType',//分类详情
	ClassifySon:Classify+'getTypeSon',//分类tab子元素的内容
	BrandInfoUrl:BrandInfo+'getBrandInfo',//分类品牌接口
	DetailInfoUrl:DetailInfo+'goodsDetails',//详情页数据接口
	LikeInfoAdd:LikeInfo+'addCollection',//添加收藏
	LikeInfoDel:LikeInfo+'removeCollection',//删除收藏
	LikeInfoUrl:LikeInfo+'getCollectionList',//获取收藏列表
	CartGoodsNum:ShopCart+'showCarListCount',// 获取购物车商品数量
	CartInfo:ShopCart+'getCarList',//购物车信息
	CartDelInfo:ShopCart+'DelGoodtoCart',//删除购物车信息
	UpdateGoodsAmount:ShopCart+'UpdateGoodsAmount',//改变商品数量接口
	OrderList:OrderInfo+'addressInfo'//结算订单接口
}