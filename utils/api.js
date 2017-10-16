var NewApiRootUrl = 'https://wstcsd.1haomei.com/html/shop/index.php/WstInterFace/GetProduct/',//全部商品接口
	BannerImg = 'https://wstcsd.1haomei.com/html/shop/index.php/WstInterFace/ShopDecoration/',//轮播图接口
	ShopCart= 'https://wstcsd.1haomei.com/html/shop/index.php/WstInterFace/ShoppingCart/',//购物车接口
	Classify= 'https://wstcsd.1haomei.com/html/shop/index.php/WstInterFace/GoodsType/',//分类接口
	BrandInfo='https://wstcsd.1haomei.com/html/shop/index.php/WstInterFace/BrandInfo/',//分类品牌接口
	DetailInfo='https://wstcsd.1haomei.com/html/shop/index.php/WstInterFace/goodsDetailsServic/';//详情接口

module.exports = {
	IndexUrl:NewApiRootUrl+ 'getIndexProduct',//首页信息
	TabUrl:NewApiRootUrl+ 'getNavProduct',//选项卡信息
	BannerUrl:BannerImg+'getBanner',
	AllGoodsUrl:NewApiRootUrl+'getProduct',//搜索信息
	AddGoodtoCart:ShopCart+'AddGoodtoCart',//添加购物车
	ClassifyUrl:Classify+'getGoodsType',//
	AllType:Classify+'getAllGoodsType',//分类详情
	ClassifySon:Classify+'getTypeSon',//分类tab子元素的内容
	BrandInfoUrl:BrandInfo+'getBrandInfo',//分类品牌接口
	DetailInfoUrl:DetailInfo+'goodsDetails'//详情页数据接口
}