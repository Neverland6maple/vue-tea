<template>
  <div class='search-list'>
    <div class='headers'>
      <Header></Header>
      <ul>
        <li v-for="(item,index) in searchList" :key="index" @click="changeTab(index)">
          <div :class="{active:index == currentIndex}">{{item.name}}</div>
          <div class='search-filter' v-if="'status' in item">
            <i class='iconfont icon-arrow_up_fat' :class="{active:1 == item.status}"></i>
            <i class='iconfont icon-xiajiantou' :class="{active:2 == item.status}"></i>
          </div>
        </li>
      </ul>
    </div>
    <section>
      <ul>
        <li v-for="(item,index) in shopList" :key="index">
          <img v-lazy="item.imgUrl">
          <h3>{{item.name}}</h3>
          <div class='price'>
            <div>
              <span>¥</span>
              <b>{{item.price}}</b>
            </div>
            <div>立即购买</div>
          </div>
        </li>
      </ul>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script lang="ts">
import Header from "@/components/search/Header.vue";
import Tabbar from "@/components/common/Tabbar.vue";
import { computed, inject, reactive } from '@vue/runtime-core';
import { useRoute } from 'vue-router';
import { ref, watch } from 'vue';
export default{
  name:"SearchList",
  components:{
    Header,
    Tabbar
  },
  setup(){
    const currentIndex = ref(0);
    const searchList = reactive([
					/*
					status:0 都不亮
					status:1 上箭头亮 降序
					status:2 下箭头亮 升序
					*/
					{name:'综合',key:'zh'},
					{name:'价格',status:0,key:'price'},
					{name:'销量',status:0,key:'num'}
				]);
    const orderName = computed<string>(()=>{
      return searchList[currentIndex.value].key
    })
    const orderVal = computed(()=>{
      return searchList[currentIndex.value].status == 1 ? 'desc' : 'asc'
    })
    const shopList = reactive<any>([]);
    const route = useRoute();
    const axios:any = inject('axios');
    const getData = ()=>{
      
      axios.get('/api/goods/shopList',{
        params:{
          searchName:route.query.key,
          [orderName.value]:orderVal.value
        }
      }).then((res:any)=>{
        shopList.splice(0,shopList.length,...res.data.data)    
      }).catch((error: any)=>{
        console.log(error);
        
      })
    }
    const changeTab = (index:number)=>{
      currentIndex.value = index;
      const item = searchList[index];
      searchList.forEach((item,i)=>{
        if(index != i && 'status' in item){
          item.status = 0;
        }
      })
      if('status' in item){
        item.status = item.status == 1 ? 2 : 1;
      }
      getData();
    }
    getData();
    watch(route,(cur,pre)=>{
			getData();
		})
    return {
      shopList,
      searchList,
      currentIndex,
      changeTab
    }
  }
}
</script>

<style scoped lang="scss">
.search-list{
	display: flex;
	flex-direction: column;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
}
.headers ul{
	display: flex;
	justify-content: space-around;
	padding:0.533333rem 0;
	font-size:0.426666rem;
}
.headers ul li{
	display: flex;
	align-items: center;
}
.headers ul li > div{
	padding:0 0.08rem;
}
.headers ul li .search-filter{
	display: flex;
	flex-direction: column;
}
section{
	flex:1;
	overflow: hidden;
}
section ul {
display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
}
section ul li {
display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			box-sizing: border-box;
			width: 50%;
			padding:0.266666rem;
}
section ul li img{
	width: 4.533333rem;
	height: 4.533333rem;
}
section ul li img[lazy=loading] {
  background-color: #f7f7f7;
}
section ul li h3{
	width: 100%;
	font-size:0.373333rem;
	color:#222;
	font-weight: 400;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
section ul li .price{
	display: flex;
	justify-content: space-between;
	padding:0.266666rem 0;
	width: 100%;
	font-size:14px;
}
section ul li .price div:first-child span{
	font-size: 0.32rem;
	color:#b0352f;
}
section ul li .price div:first-child b{
	color:#b0352f;
	font-size:0.426666rem;
}
section ul li .price div:last-child{
	padding:0.08rem 0.16rem;
	color:#fff;
	background-color: #b0352f;
	border-radius: 0.16rem;
}
.active{
	color:red;
}
</style>
