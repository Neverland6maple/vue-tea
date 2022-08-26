<template>
  <div class='like'>
    <Card title="猜你喜欢"></Card>
    <div>
      <ul>
        <li v-for='(item,index) in likeList' :key='item.id' @click="goDetail(item.id)">
          <h2>
            <img v-lazy="item.imgUrl" alt="">
          </h2>
          <h3>{{item.name}}</h3>
          <div>
            <span>¥</span>
            <b>{{item.price}}</b>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Card from '@/components/home/Card.vue';
import { useRouter } from 'vue-router';

export default {
  name: 'Like',
  props:{
    likeList:{
      typeL:Array,
      require:true
    }
  },
  setup() {
    const router = useRouter();
    const goDetail = (id:string)=>{      
      router.push({
        //隐式传参
        // name:'Detail',
        // params:{
        //   id
        // }
        //显示传参
        path:'/detail',
        query:{
          id
        }
      })
    }
    return {
      goDetail
    };
    },
  components: {
    Card
  },
}
</script>

<style scoped>
.like ul{
  display: flex;
  flex-wrap: wrap;
}
.like ul li {
  box-sizing: border-box;
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.08rem;
}
.like ul li img{
  width: 4.75rem;
	height: 4.75rem;
}

.like ul li >div{
  width: 100%;
  color:#FF0000;
  line-height: 18px;
}

.like h3{  
  width: 98%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 14px;
  padding: 0 0.08rem;
  color:#222;
}
.like ul li > div span{
	font-size:0.32rem;
}
.like ul li > div b{
	font-weight: 600;
	font-size:0.426666rem;
}
</style>
