<template>
  <header>
    <div class='search-return' @click='goBack'>
      <i class='iconfont icon-fanhui'></i>
    </div>
    <div class='search-main'>
      <i class='iconfont icon-fangdajing'></i>
      <form action="" onsubmit="return false" @keyup.enter="goSearchList">
        <input type="search" placeholder="搜索您喜欢的产品..." v-model="searchVal">
      </form>
    </div>
    <div class='serach-btn' @click="goSearchList">搜索</div>
  </header>
</template>

<script lang="ts">
import {computed, defineComponent,reactive, ref} from 'vue';
import { useRoute, useRouter } from 'vue-router';
export default defineComponent({
  name: "Header",
  setup(){
    const router = useRouter();
		const route = useRoute();
		const searchVal = ref(route.query.key || '');
		const searchList:any = reactive(JSON.parse(localStorage.getItem('searchList') || '[]'));
    const goBack = ()=>{
      router.back();
    }
	const goSearchList = ()=>{
		if(!searchVal.value) return;
		searchList.splice(0,searchList.length,...JSON.parse(localStorage.getItem('searchList') || '[]'));
		searchList.unshift(searchVal.value);
		const newArr = new Set(searchList);
		searchList.splice(0,searchList.length,...Array.from(newArr));
		localStorage.setItem('searchList',JSON.stringify(searchList));
		router.push({
			path:'/search/list',
			query:{
				key:searchVal.value
			}
			});
	}
	return{
      	goBack,
		goSearchList,
		searchVal,
		searchList
	}
  }
});

</script>

<style scoped>

header{
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	height: 1.173333rem;
	color:#fff;
	background-color: #b0352f;
}
.search-return,.serach-btn{
	padding:0 0.266666rem;
}
.search-return i{
	font-size:0.746666rem;
}
.search-main{
	display: flex;
	align-items: center;
	width: 6.933333rem;
	height: 0.8rem;
	border-radius: 12px;
	background-color: #FFFFFF;
}
.search-main i{
	padding:0 0.266666rem;
	color:#666666;
}
.search-main form{
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
    
}
.search-main form input{
  width: 100%;
  font-size:0.426666rem;
  color:#000;
}
.serach-btn{
	font-size:0.426666rem;
}
</style>
