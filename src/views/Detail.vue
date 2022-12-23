<template>
  <div class='detail'>
    <header>
      <div class='header-returns' v-show='isShow'>
        <div @click='goBack'>
          <i class='iconfont icon-fanhui'></i>
        </div>
        <div>
          <i class='iconfont icon-kefu'></i>
        </div>
      </div>
      <div class='header-bar' v-show='!isShow' :style="styleOption">
        <div @click='goBack'>
          <i class='iconfont icon-fanhui'></i>
        </div>
        <div>
          <span>商品详情</span>
          <span>商品评价</span>
        </div>
        <div>
          <i class='iconfont icon-kefu'></i>
        </div>
      </div>
    </header>
    <section class='wrapper'>
      <div>
        <div class='swiper-main'>

          <van-swipe class="my-swipe" :autoplay="3000">
            <van-swipe-item v-for="(item,index) in swiperList" :key="index" class="swiper-container">
              <img :src="item.imgUrl" alt="">
            </van-swipe-item>
            <template #indicator="{ active, total }">
              <div class="custom-indicator">{{ active + 1 }}/{{ total }}</div>
            </template>
          </van-swipe>

        </div>

        <div class='goods-name'>
          <h1>{{data.data.name}}</h1>
          <div>{{data.data.content}}</div>
          <div>性价首选，茶感十足、鲜醇耐泡的大众口粮茶</div>
        </div>
        <div class='goods-price'>
          <div class='oprice'>
            <span>¥</span>
            <b>{{data.data.price}}</b>
          </div>
          <div class='pprice'>
            <span>价格:</span>
            <del>¥288</del>
          </div>
        </div>
        <div>
          <img style='width:100%;height: 500px;' :src="swiperList[0].imgUrl" alt="">
          <img style='width:100%;height: 500px;' :src="swiperList[0].imgUrl" alt="">
        </div>
      </div>
    </section>

    <footer>
      <div class='add-cart' @click="addCart">加入购物车</div>
      <div>立即购买</div>
    </footer>
  </div>
</template>

<script lang="ts">
import BetterScroll from 'better-scroll'
import { reactive, ref } from '@vue/reactivity'
import { inject, onActivated, onMounted } from '@vue/runtime-core';
import { nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Notify } from 'vant';

export default{
  name:'detail',
  setup(){
    const isShow = ref(true);
    const router = useRouter();
    const route = useRoute();
    const id = ref(route.query.id);       
    const axios:any = inject('axios');
    const value = ref('1');
    const data = reactive({
      data:{}
    });
    const styleOption = reactive({opacity:0});
    const swiperList = reactive([
      {imgUrl:'./images/goods-list1.jpeg'},
      {imgUrl:'./images/goods-list1.jpeg'},
      {imgUrl:'./images/goods-list1.jpeg'},
    ]);
    const goBack = ()=>{
      router.go(-1);
    };
    const addCart = async ()=>{
      const {data:res} = await axios({
        method:'post',
        url:'/api/addCart',
        data:{
          id:id.value
        },
        headers:{
          token:true
        }
      })
      if(res.success){
        Notify({type:'success',message:'添加成功'})
      }
    }
    const getData = async ()=>{
      const {data:res} = await axios.get('/api/goods/id',{
        params:{
          id:id.value
        }
      })
      data.data = res.data;
      // console.log(swiperList[0]);
      swiperList.unshift({imgUrl:res.data.imgUrl});
    }
    getData();
    onActivated(()=>{
      console.log(1);
      if(id.value != route.query.id){
        id.value = route.query.id;
        getData();
      }else{

        return;
      }
      
    })
    onMounted(()=>{
      nextTick(()=>{
        const bs = new BetterScroll('.wrapper', {
          bounce:false,
          probeType:3,
          click:true
        })
        bs.on('scroll',(pos:any)=>{
          let posY = Math.abs(pos.y)
          styleOption.opacity = (posY-50)/100 >= 1? 1 : (posY-50)/100;
          if(posY >= 50){
            isShow.value = false;
          }else{
            isShow.value = true;
          }
        })
      })
    })
    return{
      swiperList,
      value,
      goBack,
      isShow,
      styleOption,
      data,
      addCart
    }
  }
}
</script>

<style scoped lang="scss">
.custom-indicator {
    color: white;
    position: absolute;
    right: 8px;
    bottom: 5px;
    padding: 2px 6px;
    font-size: 16px;
    background: rgba(0, 0, 0, 0.1);
  }
.detail{
	display: flex;
	flex-direction: column;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
}
header{
	position:fixed;
	left:0;
	top:0;
	z-index: 999;
	width: 100%;
	height: 1.173333rem;
	.header-returns{
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 1.173333rem;
		div{
			margin:0 0.266666rem;
			width: 0.933333rem;
			line-height: 0.906666rem;
			text-align: center;
			background-color: rgba(0,0,0,0.3);
			border-radius: 50%;
		}
		i{
			font-size:0.693333rem;
			color:#fff;
		}
	}
	.header-bar{
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 1.173333rem;
		font-size:0.426666rem;
		background-color: #fff;
		span{
			padding:0 0.266666rem;
		}
		i{
			padding:0 0.266666rem;
			font-size:0.586666rem;
		}
	}
}
section{
	flex:1;
	overflow: hidden;
}
.swiper-main{
	position: relative;
	width: 100%;
	height:10rem;
	overflow: hidden;
}
.swiper-container{
	width: 100%;
	height: 10rem;
}
.swiper-container img{
	width: 100%;
	height: 10rem;
}
// .swiper-pagination{
// 	bottom:0.266666rem;
// 	width: 100%;
// 	text-align: right;
// 	color:#FFFFFF;
// 	font-size:0.426666rem;
// }
// .swiper-pagination-fraction, .swiper-pagination-custom, .swiper-container-horizontal > .swiper-pagination-bullets{
// 	left:-0.533333rem;
// }
.goods-name{
	padding:0.533333rem 0.266666rem;
	border-bottom:1px solid #CCCCCC;
	h1{
		font-size:0.533333rem;
		font-weight: 500;
	}
	div{
		padding:0.08rem 0;
		font-size:0.373333rem;
		color: #999999;
	}
}
.goods-price{
	padding:0.533333rem 0.266666rem;
	.oprice{
		color:red;
		span{
			font-size:0.32rem;
		}
	}
	.pprice{
		color:#999999;
		font-size:0.373333rem;
	}
}
footer{
	display: flex;
	justify-content: center;
	align-items: center;
	position: fixed;
	bottom:0;
	left: 0;
	width: 100%;
	height: 1.306666rem;
	border-top:1px solid #cccccc;
	background-color: #fff;
	div{
		width: 50%;
		line-height: 1.306666rem;
		font-size: 0.426666rem;
		text-align: center;
		color:#fff;
		background-color: red;
		&.add-cart{
			background-color: #FF9500;
		}
	}
	
}
</style>
