<template>
  <div class='cart container'>
    <header>
      <i class='iconfont icon-fanhui' @click="goback"></i>
      <span>购物车</span>
      <span v-text="isNav ? '编辑' : '完成'" @click="isNav = !isNav"></span>
    </header>
    <section v-if="cartStore.list.length > 0">
      <div class='cart-title'>
        <van-checkbox :checked="cartStore.allChecked" @click="cartStore.checkall_fn"></van-checkbox>
        <span>商品</span>
      </div>
      <ul>
        <li v-for="(item,index) in cartStore.list" :key="item.id">
          <div class='check'>
            <van-checkbox v-model="item.checked" @click="cartStore.change_checked(item.id)"></van-checkbox>
          </div>
          <h2>
            <img :src="item.goods_imgUrl" alt="">
          </h2>
          <div class='goods'>
            <div class='goods-title'>
              <span>{{item.goods_name}}</span>
              <i class='iconfont icon-lajitong' @click="delgoods(item.id)"></i>
            </div>
            <div class='goods-price'>¥{{item.goods_price}}</div>
            <van-stepper v-model="item.goods_num" @change="changeNum($event,item.id)" integer />
          </div>
        </li>
      </ul>
    </section>
    <section v-else>
      没有购物车数据
      <router-link to='/home'>去首页逛逛吧</router-link>
    </section>
    <footer v-if="cartStore.list.length > 0">
      <div class='radio'>
        <van-checkbox :checked="cartStore.allChecked" @click="cartStore.checkall_fn"></van-checkbox>
      </div>
      <div class='total' v-show="isNav">
        <div>
          共有
          <span class='total-active'>{{cartStore.total.count}}</span>
          件商品
        </div>
        <div>
          <span>总计：</span>
          <span class='total-active'>¥{{cartStore.total.price.toFixed(2)}} + 0茶币</span>
        </div>
      </div>
      <div class='order' v-show="isNav" @click="goOrder">去结算</div>
      <div class='order' v-show="!isNav" @click="delgoods">删除</div>
    </footer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, reactive, ref } from "vue";
import Tabbar from '@/components/common/Tabbar.vue'
import { useRouter } from "vue-router";
import { useCartStore } from "@/store/cart";
import { Dialog, Toast } from 'vant';
import { useOrderStore } from "@/store/order";
interface List{
  id:number,
  uId:number,
  goods_id:string,
  goods_name:string,
  goods_price:number,
  goods_imgUrl:string,
  goods_num:number,
  checked:boolean
}
export default defineComponent({
  name: "Cart",
  components: {
    Tabbar
  },
  setup(){
    const cartStore = useCartStore();
    const axios:any = inject("axios");
    const router = useRouter();
    const isNav = ref(true);
    const orerStore = useOrderStore()
    const goodsList = computed(()=>{
      return cartStore.selectList.map((id)=>{
        return cartStore.list.find(item=>{     
          return item.id == parseInt(id)
        })
      })
    })
    const goback = ()=>{      
      router.push('/');
    }
    const getData = async ()=>{
      const {data:res} = await axios({
        method:'post',
        url:'/api/selectCart',
        headers:{
          token:true
        }
      })
      res.data.forEach(ele => {
        ele.checked = false;
      });
      cartStore.initList(res.data);
    }
    const delgoods = (id)=>{
      Dialog.confirm({
      message:
        '确认要删除吗?',
      })
      .then(() => {
        cartStore.delgoods_fn(id);
        isNav.value = !isNav;
      })
    }
     const changeNum = (val,id)=>{
      axios({
        method:'post',
        url:'/api/updateNum',
        data:{
          val,
          id
        },
        headers:{
          token:true
        }
      })
    }
    const goOrder = ()=>{     
      if(cartStore.selectList.length <= 0){
        Toast('请先勾选商品');
        return;
      }      
      axios({
        url:'/api/addOrder',
        method:'post',
        headers:{
          token:true
        },
        data:{
          goodsList:goodsList.value
        }
      }).then(({data:res})=>{
        orerStore.initOrder(res.data.order_id)
        if(res.success){
          router.push({
            path:'/order',
            query:{
              goodsList:JSON.stringify(goodsList.value)
            }
          })
        }        
      })
      
    }
    getData();
    return{
      goback,
      cartStore,
      isNav,
      delgoods,
      changeNum,
      goOrder
    }
  }
});
</script>
<style scoped lang="scss">
header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 1.173333rem;
    color:#fff;
    background-color: #b0352f;
    i{
        padding:0 0.4rem;
        font-size:0.586666rem;
    }
    span{
        padding:0 0.4rem;
        font-size:0.426666rem;
    }
}
section{
    background-color: #f5f5f5;
    .cart-title{
        display: flex;
        padding:0.533333rem;
        span{
            padding:0 0.4rem;
            font-weight: 500;
            font-size:0.48rem;
        }
    }
    ul{
        display: flex;
        flex-direction: column;
        li{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding:0.16rem 0.533333rem;
            margin:0.213333rem 0;
            background-color: #fff;
            .check{
                padding-right:0.373333rem;
            }
            .goods{
                display: flex;
                flex-direction: column;
                padding-left: .4rem;
                font-size:0.32rem;
                .goods-title{
                    display: flex;
                    i{
                        font-size:0.586666rem;
                    }
                }
                .goods-price{
                    padding:0.08rem 0;
                    color:#b0352f;
                }
                ::v-deep .van-stepper{
                    text-align: right;
                }
            }
            img{
                width: 1.973333rem;
                height: 1.973333rem;
            }
        }
    }
}
footer{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 1.28rem;
    border-top:0.053333rem solid #ccc;
    .radio{
        padding:0 0.4rem;
    }
    .total{
        flex:1;
        font-size:0.32rem;
        .total-active{
            color:#b0352f;
        }
    }
    .order{
        width: 3.2rem;
        line-height: 1.28rem;
        color:#fff;
        text-align: center;
        font-size: 0.426666rem;
        background-color: #b0352f;
    }
}
</style>