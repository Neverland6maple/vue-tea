var express = require('express');
var router = express.Router();
var connection = require('../db/sql.js')
var userSql = require('../db/userSql');
var QcloudSms = require("qcloudsms_js");
var jwt = require('jsonwebtoken');
var alipaySdk = require('../db/alipay');
var AlipayFormData = require('alipay-sdk/lib/form').default;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/payment',(req,res,next)=>{
	const {orderId,name,price} = req.body;
	const formData = new AlipayFormData();
	// 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
	formData.setMethod('get');
 
	const bizContent  ={
		outTradeNo: orderId,
		productCode: 'FAST_INSTANT_TRADE_PAY',
		totalAmount: price,
		subject: name,
		body: '商品详情',
	}
	console.log(bizContent);
	//支付时信息
	formData.addField('bizContent', JSON.stringify(bizContent));

	//支付成功或者失败跳转的链接
	formData.addField('returnUrl', 'http://localhost:8080/payment');
		
	//返回promise
	const result = alipaySdk.exec(
		'alipay.trade.page.pay',
		{},
		{ formData: formData },
	);

	result.then(resp=>{
		res.send({
			success:true,
			msg:'支付中',
			paymentUrl : resp
		})
})
})

router.post('/api/submitOrder',(req,res,next)=>{
	//token
	let token = req.headers.token;
	let tokenObj = jwt.decode(token);

	const {orderId,shopArr }= req.body;

	connection.query(userSql.queryTel(tokenObj),(error,result)=>{
		if(error){
			console.log(error);
			return;
		}
		const uId = result[0].id;

		connection.query(`select * from store_order where uId = ${uId} and order_id = ${orderId} and order_status = ${1}`,function(err,result){
			//订单的数据库id
			let id = result[0].id;

			connection.query(`update store_order set order_status = replace(order_status,'1','2') where id = ${id}`,function(e,r){
				//购物车数据删除
				shopArr.forEach(v=>{
						connection.query(`delete from goods_cart where id = ${v}`,function(){})	
				})
				res.send({
					success:true
				})
			})
		})
	})
})

router.post('/api/selectOrder',(req,res,next)=>{
	const orderId = req.body.orderId;
	connection.query(`select * from store_order where order_id='${orderId}'`,function(err,result){
		console.log(orderId);
		if(result.length > 0){
			res.send({
				success:true,
				data:result[0]
			})
		}
	})
})

router.post('/api/addOrder',(req,res,next)=>{
	//token
	let token = req.headers.token;
	let tokenObj = jwt.decode(token);
	
	//生成订单号order_id，规则：时间戳 + 6为随机数
	function setTimeDateFmt( s ){
		return s < 10 ? '0' + s : s
	}
	function randomNumber(){
		const now = new Date();
		let month = now.getMonth() + 1;
		let day = now.getDate();
		let hour = now.getHours();
		let minutes = now.getMinutes();
		let seconds = now.getSeconds();
		month = setTimeDateFmt(month);
		day = setTimeDateFmt(day);
		hour = setTimeDateFmt(hour);
		minutes = setTimeDateFmt(minutes);
		seconds = setTimeDateFmt(seconds);
		let orderCode = now.getFullYear().toString() + month.toString() + day + hour + minutes + seconds + (Math.round(Math.random() * 1000000 )).toString();
		return orderCode;
	}

	connection.query(userSql.queryTel(tokenObj),(error,result)=>{
		if(error){
			console.log(error);
			return;
		}
		const orderCode = randomNumber();
		const uId = result[0].id;

		let goodsName = [];
		let goodsPrice = 0;
		let goodsNum = 0;
		req.body.goodsList.forEach(item=>{
			goodsName.push(item.goods_name);
			goodsPrice += item.goods_price * item.goods_num;
			goodsNum += item.goods_num;
		})
		// console.log(goodsName,goodsPrice,goodsNum);

		connection.query(`insert into store_order (order_id,goods_name,goods_price,goods_num,order_status,uId) values ('${ orderCode }','${JSON.stringify(goodsName)}','${goodsPrice}',${goodsNum},'1',${uId})`,(error2,result2)=>{
			if(error2){
				console.log(error2);
				return;
			}
			connection.query(`select * from store_order where uId = ${uId} and order_id='${orderCode}'`,function(err,result){
				if(result.length>0){
					console.log(result[0]);
					res.send({
						success:true,
						data:result[0]
					})
				}
			})
		})
	})
})

router.post('/api/deleteAddress',(req,res,next)=>{
	let id = req.body.id;
    connection.query(`delete from address where id = ${id}`,function(error,results){
        res.send({
           code:200,
           success:true,
           msg:'删除成功'
        })
    })
})

router.post('/api/updateAddress',(req,res,next)=>{
	//token
	let token = req.headers.token;
	let tokenObj = jwt.decode(token);
	connection.query(`select * from user where tel = ${tokenObj.tel}`,function(error,results){
		//用户id
		if(error){
			console.log(error);
			return;
		}
		let uId = results[0].id;
		let {id,name,tel,province,city,county,addressDetail,isDefault,areaCode} = req.body;


		//查addressId 比较 iddefault有无改变 无改变则修改数据 改变了则 将所有iddefault置0后 修改数据
		connection.query(`select * from address where uId = ${uId} and id = ${id} and isDefault = ${isDefault}`,(err,result)=>{
			if(error){
				console.log(error);
				return;
			}
			let updateSql = `update address set uId = ? , name = ? , tel = ? , province = ? , city = ? ,county = ? , addressDetail = ? , isDefault = ? , areaCode = ? where id = ${id}`;

			if(result.length >0){
				connection.query(updateSql,[uId,name,tel,province,city,county,addressDetail,isDefault,areaCode],(errors,datas)=>{
					if(errors){
						console.log(errors);
						return;
					}
          res.send({
            success:true,
            msg:'修改成功'
          })
      	})
			}else{
				connection.query(`update address isDefault = replace(isDefault,'1','0') where uId = ${uId} and isDefault = ${1}`,function(e,r){
					connection.query(updateSql,[uId,name,tel,province,city,county,addressDetail,isDefault,areaCode],(errors,datas)=>{
						if(errors){
							console.log(errors);
							return;
						}
							res.send({
								success:true,
								msg:'修改成功'
							})
					})
			})
			}
		})
	})
})

router.post('/api/selectAddress',function(req,res,next){
	//token
	let token = req.headers.token;
	let tokenObj = jwt.decode(token);
	//查询用户
	connection.query(`select * from user where tel = ${tokenObj.tel}`,function(error,results){
			//用户id
			if(error){
				console.log(1,error);
				return;
			}
			let uId = results[0].id;
			connection.query(`select * from address where uId = ${uId}`,function(err,result){
				if(err){
					console.log(2,err);
					return;
				}	
				if(result.length>0){
					res.send({
						success:true,
						msg:'查询成功',
						data:result
					})
				}else{
					res.send({
						success:true,
						msg:'数据为空',
						data:{}
					})
				}
				
			})
	})
})

router.post('/api/addAddress',(req,res,next)=>{
	const token = req.headers.token;
	const telObj = jwt.decode(token);
	let {name,tel,province,city,county,addressDetail,isDefault,areaCode} = req.body;
	connection.query(userSql.queryTel(telObj),(error,result)=>{
		if(error){
			console.log(error);
			return;
		}
		if(result.length > 0){
			const uId = result[0].id;
			if(isDefault == 1){
				connection.query(`select * from address where uId = ${uId} and isDefault = ${isDefault}`,(err,result)=>{
					if(error){
						console.log(error);
						return;
					}
					if(result.length>0){
						const addressId = result[0].id;
						connection.query(`update address set isDefault = replace(isDefault,'1','0') where id = ${addressId}`,()=>{})
					}
				})
			}
			connection.query(`insert into address (uId,name,tel,province,city,county,addressDetail,isDefault,areaCode) values (${uId},"${name}","${tel}","${province}","${city}","${county}","${addressDetail}","${isDefault}","${areaCode}")`,(e,r)=>{
				if(e){
					console.log(e);
					return;
				}
				res.send({
					success:true,
					msg:'添加地址成功'
				})
			})
		}
	})
})

router.post('/api/updateNum',(req,res,next)=>{
	const {id,val} = req.body;
	connection.query(`select * from goods_cart where id=${id}`,(error,result)=>{
		if(error){
			console.log(error);
			return;
		}
		if(result.length > 0){
			const oldVal = result[0].goods_num;
			connection.query(`update goods_cart set goods_num = replace(goods_num,${oldVal},${val}) where id = ${id}`,(error2,result2)=>{
				if(error2){
					console.log(error2);
					return;
				}
				res.send({
					success:true
				})
			})
		}else{
			res.send({
				success:false,
				msg:'数据未找到'
			})
		}
	})
})

router.post('/api/deleteCart',(req,res,next)=>{
	const idCart = req.body.idCart;
	idCart.forEach((item)=>{
		connection.query(`delete from goods_cart where id = ${item}`,(error,resutl)=>{
			if(error){
				console.log(error);
				return;
			}
		})
		res.send({
			success:true,
			msg:'删除成功'
		})
	})
})

router.post('/api/selectCart',(req,res,next)=>{
	const token = req.headers.token;
	const telObj = jwt.decode(token);
	connection.query(userSql.queryTel(telObj),(error,result)=>{
		if(error){
			console.log(error);
			return;
		}
		const uId = result[0].id;
		connection.query(`select * from goods_cart where uId=${uId}`,(error2,result2)=>{
			if(error2){
				console.log(error2);
				return;
			}
			if(result2.length>0){
				res.send({
					success:true,
					data:result2
				})
			}else{
				res.send({
					success:false,
					msg:'购物车为空',
					data:[]
				})
			}
		})
	})
})

router.post('/api/addCart',(req,res,next)=>{
	const goodsId = req.body.id;
	const token = req.headers.token;
	const telObj = jwt.decode(token);
	connection.query(userSql.queryTel(telObj),(error,result)=>{
		if(error){
			console.log(error);
			return;
		}
		const uId = result[0].id;
		// console.log(result[0]);
		connection.query(`select * from goods_list where id=${goodsId}`,(error2,result2)=>{
			if(error2){
				console.log(error2);
				return;
			}
			// console.log(result2[0]);
			const goodsName = result2[0].name;
			const goodsPrice = result2[0].price;
			const goodsImgUrl = result2[0].imgUrl;

			connection.query(`select * from goods_cart where uId=${uId} and goods_id=${goodsId}`,(e,r)=>{
				if(r.length>0){
					const num = r[0].goods_num;
					connection.query(`update goods_cart set goods_num = replace(goods_num,${num},${parseInt(num) + 1}) where id = ${r[0].id}`,(error3,result3)=>{})
				}else{
					connection.query(`insert into goods_cart (uId,goods_id,goods_name,goods_price,goods_num,goods_imgUrl) values ("${uId}","${goodsId}","${goodsName}",${goodsPrice},"1","${goodsImgUrl}")`)
				}
			})
		})
	})
	res.send({
		success:true
	})
})

router.post('/api/recovery',(req,res,next)=>{
	console.log(req.body);
	connection.query(userSql.queryTel(req.body),(error,result)=>{
		if(error){
			console.log(error);
			return;
		}
		const pwd = result[0].pwd;
		const id = result[0].id;
		connection.query(`update user set pwd = replace(pwd,'${pwd}','${req.body.pwd}') where id = ${id}`,function(err,result){
			if(error){
				console.log(error);
				return;
			}
			res.send({
				success:true,
				msg:'修改成功',
				data:{}
			})
		})
	})
})

//注册
router.post('/api/selectUser',(req,res,next)=>{
	connection.query(userSql.queryTel(req.body),(error,result)=>{
		if(error){
			console.log(error);
			return;
		}
		if(result.length>0){
			res.send({
				success:true,
				msg:'success',
				data:{}
			})
		}else{
			res.send({
				success:false,
				msg:'账号未被注册',
				data:{}
			})
		}
	})
})

router.post('/api/register',(req,res,next)=>{
	console.log(req.body);
	connection.query(userSql.queryTel(req.body),(error,result)=>{
		if(error){
			console.log(error);
			return;
		}
		if(result.length>0){
			res.send({
				success:false,
				msg:'账号已被注册，可以更换手机号登录或直接进行登录',
				data:{},
			})
		}else{
			connection.query(userSql.insertUser(req.body),(error,result)=>{
				if(error){
					console.log(error);
					return;
				}
					res.send({
					success:true,
					msg:'注册成功，请前往登录',
					data:{},
				})
			})
		}
	})
})

router.post('/api/addUser',(req,res,next)=>{
	connection.query(userSql.queryTel(req.body),(error,result)=>{
		if(error){
			console.log(error);
			return;
		}
		if(result.length>0){
			//用户信息
			const payload = {tel:req.body.tel}
			//口令
			const secret = 'acfun'
			//生成token
			const token = jwt.sign(payload,secret,{
				expiresIn:60
			});
			const id = result[0].id
			connection.query(`update user set token = '${token}' where id = ${id}`,(err)=>{
				if(err){
					console.log(err);
					return;
				}
				connection.query(userSql.queryTel(req.body),(e,r)=>{
					if(e){
						console.log(e);
						return;
					}
					res.send({
						success:true,
						msg:'success',
						data:r[0]
					})
				})				
			})
		}else{
			connection.query(userSql.insertUser(req.body),(error,result)=>{
				if(error){
					console.log(error);
					return;
				}
				connection.query(userSql.queryTel(req.body),(error,result)=>{
					if(error){
						console.log(error);
						return;
					}
					if(result.length>0){
						res.send({
							success:true,
							msg:'success',
							data:result[0]
						})
					}
				})
			})
		}
	})
})

router.post('/api/code',(req,res,next)=>{
	// 短信应用SDK AppID
var appid = 1400187558;  // SDK AppID是1400开头

// 短信应用SDK AppKey
var appkey = "dc9dc3391896235ddc2325685047edc7";

// 需要发送短信的手机号码
var phoneNumbers = [req.body.phone];

// 短信模板ID，需要在短信应用中申请
var templateId = 285590;  // NOTE: 这里的模板ID`7839`只是一个示例，真实的模板ID需要在短信控制台中申请

// 签名
var smsSign = "三人行慕课";  // NOTE: 这里的签名只是示例，请使用真实的已申请的签名, 签名参数使用的是`签名内容`，而不是`签名ID`

// 实例化QcloudSms
var qcloudsms = QcloudSms(appid, appkey);

// 设置请求回调处理, 这里只是演示，用户需要自定义相应处理回调
function callback(err, ress, resData) {
    if (err) {
        console.log("err: ", err);
    } else {
        res.send({
					code:0,
					data:{
						success:true,
						data:ress.req.body.params[0]
					}
				})
    }
}

var ssender = qcloudsms.SmsSingleSender();
var params = [Math.floor(Math.random()*8999)+1000];
ssender.sendWithParam(86, phoneNumbers[0], templateId,
  params, smsSign, "", "", callback);  // 签名参数不能为空串

})

router.post('/api/login',(req,res,next)=>{
		connection.query(userSql.queryTel(req.body),(error,result)=>{
		if(error){
			res.send({
				success:false,
				msg:error.sqlMessage,
				data:data
			})
			return;
		};
		if(result.length > 0){
			connection.query(userSql.queryPwd(req.body),(error,result)=>{
				if(error){
					res.send({
						success:false,
						msg:error.sqlMessage,
						data:data
					})
					return;
				}
				if(result.length > 0){
					res.send({
						success:true,
						msg:'success',
						data:result[0]
					})
				}else{
					res.send({
						success:false,
						msg:'密码错误',
						data:{}
					})
				}
			})
		}else{
			res.send({
				success:false,
				msg:'账号错误',
				data:{}
			})
			return;
		}
	})
})

router.get('/api/goods/id',(req,res,next)=>{
	connection.query(`select * from goods_list where id=${req.query.id}`,function(error,result){
		if(error) throw error;
		res.json({
			code:0,
			data:result[0]
		})
	})
})

router.get('/api/goods/shopList',function(req,res,next){
	const [searchName,orderName] = Object.keys(req.query);
	const [searchVal,orderVal] = Object.values(req.query);
	connection.query('select * from goods_list where name like "%'+searchVal+'%" order by '+orderName+' '+orderVal+'',function(error,result){
		res.send({
			code:0,
			data:result
		})
	})
})

router.get('/api/goods/list',function(req,res,next){
	
	res.send({
		code:0,
		data:[
			{
				//一级
				id:0,
				name:'推荐',
				data:[
					{
						//二级
						id:0,
						name:'推荐',
						list:[
						//三级
							{
								id:0,
								name:'铁观音',
								imgUrl:'./images/list1.jpeg'
							},
							{
								id:1,
								name:'功夫茶具',
								imgUrl:'./images/list1.jpeg'
							},
							{
								id:3,
								name:'茶具电器',
								imgUrl:'./images/list1.jpeg'
							},
							{
								id:4,
								name:'紫砂壶',
								imgUrl:'./images/list1.jpeg'
							},
							{
								id:5,
								name:'龙井',
								imgUrl:'./images/list1.jpeg'
							},
							{
								id:6,
								name:'武夷岩茶',
								imgUrl:'./images/list1.jpeg'
							}
						]
					}
				]
			},
			{
				//一级
				id:1,
				name:'绿茶',
				data:[
					{
						//二级
						id:0,
						name:'绿茶',
						list:[
						//三级
							{
								id:0,
								name:'龙井',
								imgUrl:'./images/list1.jpeg'
							},
							{
								id:1,
								name:'碧螺春',
								imgUrl:'./images/list1.jpeg'
							},
							{
								id:3,
								name:'雀舌',
								imgUrl:'./images/list1.jpeg'
							},
							{
								id:4,
								name:'安吉白茶',
								imgUrl:'./images/list1.jpeg'
							},
							{
								id:5,
								name:'六安瓜片',
								imgUrl:'./images/list1.jpeg'
							}
						]
					}
				]
			},
			{
				//一级
				id:2,
				name:'乌龙',
				data:[
					{
						//二级
						id:0,
						name:'乌龙',
						list:[
						//三级
							{
								id:0,
								name:'龙井',
								imgUrl:'./images/list1.jpeg'
							},
							{
								id:1,
								name:'碧螺春',
								imgUrl:'./images/list1.jpeg'
							},
							{
								id:3,
								name:'雀舌',
								imgUrl:'./images/list1.jpeg'
							},
							{
								id:4,
								name:'安吉白茶',
								imgUrl:'./images/list1.jpeg'
							},
							{
								id:5,
								name:'六安瓜片',
								imgUrl:'./images/list1.jpeg'
							}
						]
					}
				]
			},
			{
				//一级
				id:3,
				name:'红茶',
				data:[
					{
						//二级
						id:0,
						name:'红茶',
						list:[
						//三级
							{
								id:0,
								name:'龙井',
								imgUrl:'./images/list1.jpeg'
							},
							{
								id:1,
								name:'碧螺春',
								imgUrl:'./images/list1.jpeg'
							},
							{
								id:3,
								name:'雀舌',
								imgUrl:'./images/list1.jpeg'
							},
							{
								id:4,
								name:'安吉白茶',
								imgUrl:'./images/list1.jpeg'
							},
							{
								id:5,
								name:'六安瓜片',
								imgUrl:'./images/list1.jpeg'
							}
						]
					}
				]
			},
			{
				//一级
				id:4,
				name:'白茶',
				data:[
					{
						//二级
						id:0,
						name:'白茶',
						list:[
						//三级
							{
								id:0,
								name:'龙井',
								imgUrl:'./images/list1.jpeg'
							},
							{
								id:1,
								name:'碧螺春',
								imgUrl:'./images/list1.jpeg'
							},
							{
								id:3,
								name:'雀舌',
								imgUrl:'./images/list1.jpeg'
							},
							{
								id:4,
								name:'安吉白茶',
								imgUrl:'./images/list1.jpeg'
							},
							{
								id:5,
								name:'六安瓜片',
								imgUrl:'./images/list1.jpeg'
							}
						]
					}
				]
			},
			{
				//一级
				id:5,
				name:'普洱',
				data:[
					{
						//二级
						id:0,
						name:'普洱',
						list:[
						//三级
							{
								id:0,
								name:'龙井',
								imgUrl:'./images/list1.jpeg'
							},
							{
								id:1,
								name:'碧螺春',
								imgUrl:'./images/list1.jpeg'
							},
							{
								id:3,
								name:'雀舌',
								imgUrl:'./images/list1.jpeg'
							},
							{
								id:4,
								name:'安吉白茶',
								imgUrl:'./images/list1.jpeg'
							},
							{
								id:5,
								name:'六安瓜片',
								imgUrl:'./images/list1.jpeg'
							}
						]
					}
				]
			}
			
		]
	})
})

//首页铁观音的数据
router.get('/api/index_list/2/data/1', function(req, res, next) {
	res.send({
		code:0,
		data:[
			{
				id:1,
				type:'adList',
				data:[
					{
						id:1,
						imgUrl:'./images/tgy.jpeg'
					},
					{
						id:2,
						imgUrl:'./images/tgy.jpeg'
					}
				]
			},
			{
				id:2,
				type:'iconsList',
				data:[
					{
						id:1,
						title:'自饮茶',
						imgUrl:'./images/icons1.png'
					},
					{
						id:2,
						title:'茶具',
						imgUrl:'./images/icons2.png'
					},
					{
						id:3,
						title:'茶礼盒',
						imgUrl:'./images/icons3.png'
					},
					{
						id:4,
						title:'领福利',
						imgUrl:'./images/icons4.png'
					},
					{
						id:5,
						title:'官方验证',
						imgUrl:'./images/icons5.png'
					}
				]
			},
			{
				id:3,
				type:'likeList',
				data:[
					{
						id:1,
						imgUrl:'./images/like.jpeg',
						name:'建盏茶具套装 红色芝麻毫 12件套',
						price:299
					},
					{
						id:2,
						imgUrl:'./images/like.jpeg',
						name:'建盏茶具套装 红色芝麻毫 12件套',
						price:299
					},
					{
						id:3,
						imgUrl:'./images/like.jpeg',
						name:'建盏茶具套装 红色芝麻毫 12件套',
						price:299
					}
				]
			}
			
		]
	})
})
//首页大红袍的数据
router.get('/api/index_list/1/data/1', function(req, res, next) {
	res.send({
		code:0,
		data:[
			{
				id:1,
				type:'adList',
				data:[
					{
						id:1,
						imgUrl:'./images/dhp.jpeg'
					},
					{
						id:2,
						imgUrl:'./images/dhp.jpeg'
					}
				]
			},
			{
				id:2,
				type:'likeList',
				data:[
					{
						id:1,
						imgUrl:'./images/like.jpeg',
						name:'建盏茶具套装 红色芝麻毫 12件套',
						price:299
					},
					{
						id:2,
						imgUrl:'./images/like.jpeg',
						name:'建盏茶具套装 红色芝麻毫 12件套',
						price:299
					},
					{
						id:3,
						imgUrl:'./images/like.jpeg',
						name:'建盏茶具套装 红色芝麻毫 12件套',
						price:299
					}
				]
			}
			
		]
	})
})
//首页推荐的数据
router.get('/api/index_list/0/data/1', function(req, res, next) {
	res.send({
		code:0,
		data:{
			topBar:[
				{id:"0",label:'推荐'},
				{id:"1",label:'大红袍'},
				{id:"2",label:'铁观音'},
				{id:"3",label:'绿茶'},
				{id:"4",label:'普洱'},
				{id:"5",label:'茶具'},
				{id:"6",label:'花茶'},
			],
			data:[
				//这是swiper
				{
					id:0,
					type:'swiperList',
					data:[
						{id:0,imgUrl:'/images/swiper1.jpeg'},
						{id:1,imgUrl:'/images/swiper2.jpeg'},
						{id:3,imgUrl:'/images/swiper3.jpeg'}
					]
				},
				//这是icons
				{
					id:1,
					type:'iconsList',
					data:[
						{
							id:1,
							title:'自饮茶',
							imgUrl:'./images/icons1.png'
						},
						{
							id:2,
							title:'茶具',
							imgUrl:'./images/icons2.png'
						},
						{
							id:3,
							title:'茶礼盒',
							imgUrl:'./images/icons3.png'
						},
						{
							id:4,
							title:'领福利',
							imgUrl:'./images/icons4.png'
						},
						{
							id:5,
							title:'官方验证',
							imgUrl:'./images/icons5.png'
						}
					]
				},
				//爆款推荐
				{
					id:2,
					type:'recommendList',
					data:[
						{
							id:1,
							name:'龙井1號铁罐250g',
							content:'鲜爽甘醇 口粮首选',
							price:'68',
							imgUrl:'./images/recommend.jpeg'
						},
						{
							id:2,
							name:'龙井1號铁罐250g',
							content:'鲜爽甘醇 口粮首选',
							price:'68',
							imgUrl:'./images/recommend.jpeg'
						}
					]
				},
				//猜你喜欢
				{
					id:3,
					type:'likeList',
					data:[
						{
							id:1,
							imgUrl:'./images/goods1.jpg',
							name:'赛事茶-第三届武夷山茶叶交易会暨仙店杯-优质奖肉桂160g',
							price:238
						},
						{
							id:2,
							imgUrl:'./images/goods2.jpg',
							name:'茶具-中式陶瓷茶叶罐 2色可选',
							price:26
						},
						{
							id:3,
							imgUrl:'./images/goods3.jpg',
							name:'绿茶  远致龙井3号 150g 清爽甘醇',
							price:118
						},
						{
							id:4,
							imgUrl:'./images/goods4.jpg',
							name:'明前春茶 绿茶 龙井破春系列80g罐装',
							price:98
						},
						{
							id:5,
							imgUrl:'./images/like.jpeg',
							name:'建盏茶具套装 红色芝麻毫 12件套',
							price:299
						},
						{
							id:6,
							imgUrl:'./images/like.jpeg',
							name:'建盏茶具套装 红色芝麻毫 12件套',
							price:299
						},
						{
							id:7,
							imgUrl:'./images/like2.jpeg',
							name:'建盏茶具套装 红色芝麻毫 12件套',
							price:299
						},
						{
							id:8,
							imgUrl:'./images/like3.jpeg',
							name:'建盏茶具套装 红色芝麻毫 12件套',
							price:299
						},
						{
							id:9,
							imgUrl:'./images/like2.jpeg',
							name:'建盏茶具套装 红色芝麻毫 12件套',
							price:299
						},
						{
							id:10,
							imgUrl:'./images/like3.jpeg',
							name:'建盏茶具套装 红色芝麻毫 12件套',
							price:299
						}
					]
				}
				
			]
		}
	})
});


module.exports = router;
