<template>
  <div class='order container'>
    <header>
      <i class='iconfont icon-fanhui' @click='router.back()'></i>
      <span>提交订单</span>
      <i class='iconfont icon-kefu'></i>
    </header>
    <section>
      <div class='path' @click="goPath">
        <h3 class='path-title'>收货信息</h3>
        <div class='path-content' @click='goPath'>
          <div>
            <span>{{path.name}}</span>
            <span>{{path.tel}}</span>
          </div>
          <div>
            <span>{{path.province}}</span>
            <span>{{path.city}}</span>
            <span>{{path.county}}</span>
            <span>{{path.addressDetail}}</span>
          </div>
        </div>
      </div>
      <div class='payment'>
        <div class='payment-title'>支付方式：</div>
        <van-radio-group v-model="radioPayment">
          <van-radio name="wx">微信支付</van-radio>
          <van-radio name="ali">支付宝支付</van-radio>
        </van-radio-group>
      </div>
      <div class='goods'>
        <ul>
          <li v-for='(item,index) in goodsList' :key='index'>
            <div>
              <img :src="item.goods_imgUrl" alt="">
            </div>
            <div class='goods-content'>
              <h4>{{item.goods_name}}</h4>
              <div class='goods-total'>
                <span>¥{{item.goods_price}}</span>
                <span>x{{item.goods_num}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <footer>
      <div class='order-total'>
        <span>共</span>
        <b>{{total.num}}</b>
        <span>件,</span>
        <span>总金额：</span>
        <em>¥{{total.price}}</em>
      </div>
      <div class='order-topay' @click='goPayment'>
        提交订单
      </div>
    </footer>
  </div>
</template>
<script lang="ts">
import { onMounted, ref } from 'vue-demi'
import { useRoute, useRouter } from 'vue-router'
import { usePathStore } from '@/store/path';
import { inject, reactive } from 'vue';
import { useCartStore } from '@/store/cart';
import { useOrderStore } from '@/store/order';
 import qs from 'qs'

export default {
  setup(){
    const route = useRoute();
    const router = useRouter();
    const pathStore = usePathStore();
    const cartStore = useCartStore();
    const path = ref({});
    const axios:any = inject('axios');
    const radioPayment = ref('wx');
    const orderStore = useOrderStore();
    const total = reactive({
      price:0,
      num:0
    })
    const goodsList = reactive(JSON.parse(route.query.goodsList as string))
    onMounted(async ()=>{
      const {data:res} = await axios({
        method:'post',
        url:'/api/selectAddress',
        headers:{
          token:true
        }
      })
      getOrder();
      if(res.success) pathStore.initAddress(res.data);
      if('name' in path.value){
        return;
      }
      if(pathStore.defaultPath){
        path.value = pathStore.defaultPath;
      }else if(res.data.length > 0){
        path.value = res.data[0];
      }
      
    })
    const getOrder = async ()=>{
      const orderId = orderStore.id;
      const {data:res} =await axios({
        method:'post',
        url:'/api/selectOrder',
        headers:{
          token:true
        },
        data:{
          orderId
        }
      })
      if(res.success){
        total.num = res.data.goods_num;
        total.price = res.data.goods_price
      }
    }
    const goPayment = async ()=>{
      const {data:res} = await axios({
        url:'/api/submitOrder',
        method:'post',
        headers:{
          token:true
        },
        data:{
          orderId:orderStore.id,
          shopArr:cartStore.selectList
        }
      })
      if(res.success){
        const arr = [];
        goodsList.forEach(item=>{
          arr.push(item.goods_name);
        })

        const dataOrder = {
          orderId:orderStore.id,
          name:arr.join(''),
          price:total.price
        }
        
        const {data:res} = await axios({
          url:'/api/payment',
          method:'post',
          headers:{
            token:true,
            'Content-Type':'application/x-www-form-urlencoded'
          },
          data:qs.stringify(dataOrder)
        })
        if(res.success){
          window.location.href = res.paymentUrl
        }
      }
    }
    const goPath = ()=>{
      router.push({
        path:'/path',
        query:{
          type:'select'
        }
      })
    }
    return{
      goPayment,
      path,
      cartStore,
      router,
      radioPayment,
      goodsList,
      total,
      goPath,
    }
  },
  
  beforeRouteEnter(to,from,next){
    let np = {};
    if(from.name == 'Path-index'){
      np = JSON.parse(from.params.newPath);    
    }
    next((vm)=>{
      vm.path  = np;    
    });
  }
}
</script>

<style lang='scss' scoped>
header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 1.173333rem;
    color:#fff;
    background-color: #b0352f;
    i{
        padding:0 0.4rem;
        font-size:0.586666rem;
    }
    span{
        font-weight:300;
        font-size:0.48rem;
    }
}
section{
    background-color: #f7f7f7;
    .path-title{
        padding: 0.4rem;
        font-size:0.48rem;
    }
    .path-content{
        padding:0.16rem 0.4rem;
        font-size:0.373333rem;
        background-color: #FFFFFF;
        span{
            padding-right:0.16rem;
        }
    }
    .payment{
        padding:0.16rem 0.4rem;
        margin-top:0.4rem;
        font-size:0.426666rem;
        background-color: #FFFFFF;
        .van-radio-group{
            display: flex;
            padding:0.16rem 0;
            .van-radio{
                padding-right:0.266666rem;
            }
        }
    }
    .goods{
        padding:0.16rem 0.4rem;
        margin-top:0.4rem;
        font-size:0.426666rem;
        background-color: #FFFFFF;
        ul{
            width: 100%;
            li{
                display: flex;
                 width: 100%;
                img{
                    width: 1.973333rem;
                    height: 1.973333rem;
                }
                .goods-content{
                    flex:1;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding-left:0.4rem;
                    .goods-total{
                        display: flex;
                        justify-content: space-between;
                    }
                }
            }
        }
        
    }
}
footer{
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 1.2rem;
    border-top:1px solid #ccc;
    .order-total{
        font-size:0.426666rem;
        span{
            padding:0 0.16rem;
        }
        b{
            color:#b0352f;
        }
        em{
            font-size:0.48rem;
            color:#b0352f;
        }
    }
    .order-topay{
        width: 3.2rem;
        line-height: 1.2rem;
        color:#fff;
        font-size:0.426666rem;
        text-align: center;
        background-color: #b0352f;
    }
   
}
</style>

  function inject(arg0: string): any {
    throw new Error('Function not implemented.');
  }
