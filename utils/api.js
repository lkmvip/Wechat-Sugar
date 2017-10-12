var NewApiRootUrl = 'https://wstcsd.1haomei.com/html/shop/index.php/WstInterFace/GetProduct/',
	BannerImg = 'https://wstcsd.1haomei.com/html/shop/index.php/WstInterFace/ShopDecoration/',
	ShopCart= 'https://wstcsd.1haomei.com/html/shop/index.php/WstInterFace/ShoppingCart/';


module.exports = {
	IndexUrl:NewApiRootUrl+ 'getIndexProduct',
	TabUrl:NewApiRootUrl+ 'getNavProduct',
	BannerUrl:BannerImg+'getBanner',
	AllGoodsUrl:NewApiRootUrl+'getProduct',
	AddGoodtoCart: ShopCart+'AddGoodtoCart'
}