<template>
  <div class='list'>
    <header v-show="isshow">
      <div class='returns'>
        <i class='iconfont icon-fanhui'></i>
      </div>
      <div class='search'>
        <i class='iconfont icon-fangdajing'></i>
        <span>搜您喜欢的...</span>
      </div>
      <div class='go-home'>
        <img src="@/assets/images/home.png" alt="">
      </div>
    </header>

    <section>
      <div class='list-l' ref='left'>
        <ul class='l-item'>
          <li v-for="(item,index) in leftArr" :key="index" @click="goScroll(index)" :class="{active:index==currentIndex}">{{item}}</li>
        </ul>
      </div>

      <div class='list-r' ref="right">
        <div>
          <ul class='shop-list' v-for="(item,index) in rightArr" :key="index">
            <li>
              <h2>{{item.name}}</h2>
              <ul class='r-content'>
                <li v-for="(k,i) in item.list" :key="k.id">
                  <img v-lazy="k.imgUrl" alt="">
                  <span>{{k.name}}</span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script lang="ts">

import { computed, defineComponent, inject, nextTick, reactive, ref, watch } from "vue";
import BetterScroll from 'better-scroll'
import Tabbar from '@/components/common/Tabbar.vue'
import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll";
export default defineComponent({
  name: "List",
	setup(){
		interface List{
			code:number,
			name:string,
			list:any
		}
		interface Data{
			code:number,
			name:string,
			data:List[]
		}
		
		const left = ref(null);
		const right = ref(null);
		const leftArr = reactive<string[]>([]);
		const rightArr = reactive<List[]>([]);
		const allHeight = reactive<number[]>([])
		const isshow = ref(true)
		let scrollY = ref(0);
		let rightScroll: BScrollConstructor<{}>;
		const currentIndex = computed(()=>{
			return allHeight.findIndex((item,index)=>{
				return scrollY.value>= allHeight[index]-120  && scrollY.value < allHeight[index+1]-120;
			})
		})
		const axios:any = inject('axios');
		watch(scrollY,(newVal,oldVal)=>{
			if(scrollY.value > 150){
				isshow.value = false
			}else{
				isshow.value = true
			}
		})
		const getData = async ()=>{
			const {data:res} = await axios.get('/api/goods/list');
			const la: string[] = [];
			const ra: List[] = [];		
				
			res.data.forEach((ele:Data) => {
				la.push(ele.name)
				ele.data.forEach((ele)=>{
					ra.push(ele);
				})
			});			
			leftArr.push(...la);
			rightArr.push(...ra);
			nextTick(()=>{
				// @ts-ignore
				new BetterScroll(left.value, {
				click:true
				})
				// @ts-ignore
				rightScroll = new BetterScroll(right.value, {
								probeType:3,
											bounce:false
								})

				rightScroll.on('scroll',(pos:any)=>{
					scrollY.value = Math.abs(pos.y);
				})

				// @ts-ignore
				const eleArr = right.value.getElementsByClassName('shop-list');
				let height:number = 0;
				Array.from(eleArr).forEach((ele:any)=>{
					allHeight.push(height);
					height += ele.clientHeight;
				})
				console.log(allHeight);
				
			})
		}
		const goScroll = (index:number)=>{
			rightScroll.scrollTo(0,-allHeight[index]);
		}
		getData();
		return {
			left,
			right,
			leftArr,
			rightArr,
			goScroll,
			currentIndex,
			isshow
		}
	},
  components: {
    Tabbar
  },
});
</script>

<style lang="scss" scoped>
  .list{
	display: flex;
	flex-direction: column;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
}
header{
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 1.173333rem;
	background-color: #b0352f;
	.returns{
		line-height: 1.173333rem;
		padding:0 0.533333rem;
		i{
			color:#fff;
			font-size:0.693333rem;
		}
	}
	.search{
		display: flex;
		align-items: center;
		flex: 1;
		padding:0.16rem 0.266666rem;
		background-color: #FFFFFF;
		border-radius: 0.64rem;
		i{
			padding-right: 0.16rem;
			color:#666;
			font-size:0.48rem;
		}
		span{
			color:#666;
			font-size:0.373333rem;
		}
	}
	.go-home{
		padding: 0 0.266666rem;
		line-height: 1.173333rem;
		img{
			width: 0.48rem;
			height: 0.48rem;
		}
	}
}
section{
	display: flex;
	flex:1;
	overflow:hidden;
}
.list-l{
	width: 2.48rem;
	background-color: #fff;
	border-right: 1px solid #CCCCCC;
	overflow: hidden;
	.l-item{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		li{
			width: 100%;
			padding:0.08rem 0;
			margin:0.533333rem 0;
			text-align: center;
			font-size:0.373333rem;
			&.active{
				color:#b54f4a;
				border-left:6px solid #b54f4a;
			}
		}
	}
}

.list-r{
	flex:1;
	overflow: hidden;
	.shop-list{
		text-align: center;
		h2{
			padding:0.533333rem 0;
			font-size:0.64rem;
			font-weight: 400;
		}
		.r-content{
			display: flex;
			flex-wrap: wrap;
			li{
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				width: 33.33%;
				padding:0.266666rem 0;
				img{
					width: 1.413333rem;
					height: 1.413333rem;
				}
				span{
					font-size:0.426666rem;
				}
			}
		}
	}
}
::v-deep.tabbar{
	border-top:1px solid #CCCCCC;
}
</style>