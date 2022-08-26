<template>
  <div class='search-index container'>
    <Header></Header>
    <section>
      <div class='search-history'>
        <h2>
          <i class='iconfont icon-shijian'></i>
          <span>历史搜索</span>
          <span @click="clearList">清空历史记录</span>
        </h2>
        <ul v-if="searchList.length != 0">
          <li v-for="(item,index) in searchList" :key="index" @click="goSearchList(item)">{{item}}</li>
        </ul>
        <h2 v-else>暂无历时搜索记录。。。</h2>
      </div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script lang="ts">
import Header from "@/components/search/Header.vue";
import { defineComponent, reactive} from "vue";
import Tabbar from '@/components/common/Tabbar.vue'
import { Dialog } from 'vant';
import { useRouter } from "vue-router";
export default defineComponent({
  name: "Search-index",
  components: {
    Header,
    Tabbar
  },
  setup(){
    const router = useRouter();
    const searchList:any = reactive(JSON.parse(localStorage.getItem('searchList') || '[]'));
    const clearList = ()=>{
      Dialog.confirm({
        title: '标题',
        message: '代码是写出来给人看的，附带能在机器上运行。',
      }).then(() => {
        // on close
        localStorage.removeItem('searchList');
        searchList.splice(0);
      }).catch(() => {
        // on cancel
      });
    }
    const goSearchList = (key:string)=>{
      router.push({
				path:'/search/list',
				query:{
					key:key
				}
				});
    }
    return{
      searchList,
      clearList,
      goSearchList
    }
  },
});
</script>
<style scoped>.search-index{
	display: flex;
	flex-direction: column;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
}
section{
	flex:1;
	background-color: #f5f5f5;
	overflow: hidden;
}
.search-history h2{
	position: relative;
	padding:0.533333rem;
	font-weight: 400;
	font-size:0.48rem;
}
.search-history h2 i{
	padding-right:0.08rem;
	color:red;
	font-size:0.48rem;
}
.search-history h2 span:last-child{
	position: absolute;
	right:0.533333rem;
	
}
.search-history ul{
	display: flex;
	flex-wrap: wrap;
	padding:0 0.266666rem;
}
.search-history ul li{
	margin:0.266666rem;
	padding:0.08rem 0.16rem;
	font-size:0.373333rem;
	border:1px solid #ccc;
}
</style>