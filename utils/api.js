var NoOne = 'https://wstcsd.1haomei.com',
	NewApiRootUrl = NoOne+'/html/shop/index.php/WstInterFace/GetProduct/',//全部商品接口
	BannerImg = NoOne+'/html/shop/index.php/WstInterFace/ShopDecoration/',//轮播图接口
	ShopCart = NoOne +'/html/shop/index.php/WstInterFace/ShoppingCart/',//购物车接口
	Classify = NoOne +'/html/shop/index.php/WstInterFace/GoodsType/',//分类接口
	BrandInfo = NoOne +'/html/shop/index.php/WstInterFace/BrandInfo/',//分类品牌接口
	DetailInfo = NoOne +'/html/shop/index.php/WstInterFace/goodsDetailsServic/',//详情接口
	LikeInfo = NoOne +'/html/shop/index.php/WstInterFace/Collection/',//详情接口
	OrderInfo = NoOne +'/html/shop/index.php/WstInterFace/goodsDetails/',//结算订单接口
	AddrInfo = NoOne + '/html/shop/index.php/WstInterFace/GetAddress/',// 地址接口
	StoreManage = NoOne+'/html/shop/index.php/WstInterFace/StoreManage/',//店铺管理接口
	TicketInfo = NoOne+'/html/shop/index.php/WstInterFace/Coupon/',//优惠卷接口
	CreateOrder = NoOne+'/html/shop/index.php/WstInterFace/GoodsDetails/',//提交订单
	UserMsg = NoOne+'/html/shop/index.php/WstInterFace/UserInfo/',
	RmbPay = NoOne+'/html/shop/index.php/WstInterFace/BalancePayment/',//余额支付接口
	OrderDetailInfo = NoOne+'/html/shop/index.php/WstInterFace/OrderInfo/',//订单详情
	LogisticsInfo = NoOne+'/html/shop/index.php/WstInterFace/Logistics/';//物流详情
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
	OrderList:OrderInfo+'addressInfo',//结算订单接口
	NewOrderInfo:CreateOrder+'orderInfo',//生成订单接口
	AddNewAddrInfo:AddrInfo+'addAddress',//添加地址接口
	GetAddrInfo:AddrInfo+'getAddressInfo',//获取地址接口
	DelAddInfo:AddrInfo+'delAddress',//删除地址接口
	DelOrderCar:ShopCart+'deleteCart',//提交订单清空购物车信息
	UserMainMsg:UserMsg+'getUserInfo',//支付页面的接口获取余额
	UserRmbPay:RmbPay+'balancePay',//余额支付
	OrderInfoList:OrderDetailInfo+'getOrderList',//订单列表
	OrderInfoDetail:OrderDetailInfo+'getOrderDetail',//订单详情
	CancelOredr:OrderDetailInfo+'cancelOrder',//取消订单
	CancelMoney:OrderDetailInfo+'cancelMoney',//申请退款
	TakeGoods:OrderDetailInfo+'takeGoods',//确认收货
	GetLogisticsInfo:LogisticsInfo+'getLogisticsInfo'//物流信息

}