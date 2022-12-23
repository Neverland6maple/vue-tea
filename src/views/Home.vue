<template>
  <div class="home">

    <div class="headers">
      <div class="headers-main">
        <Header @click="goSearch"></Header>
        <fun-tabs v-model="value" class="" @change="addData">
          <fun-tab-item v-for="(item,index) in items" :name="item.id" :title="item.label" :key="item.id" />
        </fun-tabs>
      </div>
    </div>
    <section class="wrapper">
      <div>
        <div v-for="(item,index) in newData" :key="index">
          <Swiper v-show="item.type == 'swiperList'" :swiperList="item.data"></Swiper>
          <Icons v-show="item.type == 'iconsList'" :iconsList="item.data"></Icons>
          <Recommend v-show="item.type == 'recommendList'" :recommendList="item.data"></Recommend>
          <Ad v-show="item.type == 'adList'" :adList="item.data"></Ad>
          <Like v-show=" item.type=='likeList'" :likeList="item.data"></Like>
        </div>
      </div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script lang="ts">
import Header from "@/components/home/Header.vue";
import Swiper from "@/components/home/Swiper.vue";
import Recommend from "@/components/home/Recommend.vue";
import BetterScroll from 'better-scroll'
import Ad from '@/components/home/Ad.vue'
import Like from '@/components/home/Like.vue'
import Icons from '@/components/home/Icons.vue'
import { defineComponent, inject, nextTick, onMounted, reactive, ref } from "vue";
import Tabbar from '@/components/common/Tabbar.vue'
import { useRouter } from "vue-router";
export default defineComponent({
  name: "Home",
  components: {
    Tabbar,
    Header,
    Swiper,
    Recommend,
    Icons,
    Like,
    Ad
  },
  setup(){
    const router = useRouter()
    const axios:any = inject('axios');
    const value = ref('0');
    let items:any =reactive([]); 
    let newData:any = reactive([])

    const addData = async (index:string)=>{
      const {data} = await axios.get('/api/index_list/'+index+'/data/1');
      if(index === '0'){
        newData.splice(0,newData.length,...data.data.data);
      }else if(data){
        newData.splice(0,newData.length,...data.data);
      }
      console.log(newData);

      nextTick(()=>{
        new BetterScroll('.wrapper', {
          movable: true,
          zoom: true,
          click:true
        })
      })
    }
    
    const goSearch = ()=>{
      router.push('/search');
    }
    onMounted(async ()=>{
      const {data} = await axios.get('/api/index_list/0/data/1');   
      items.push(...data.data.topBar);
      newData.push(...data.data.data)
      nextTick(()=>{
        new BetterScroll('.wrapper', {
          movable: true,
          zoom: true,
          click:true
        })
      })
    })
    
    return{
      value,
      items,
      newData,
      addData,
      goSearch
    }
  },
});
</script>
<style scoped>
.headers{
  width: 100%;
  height: 2.6rem;
}
.headers-main{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
}
.home{
  display: flex;
	flex-direction: column;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
}
section{
	flex:1;
	overflow: hidden;
}
</style>