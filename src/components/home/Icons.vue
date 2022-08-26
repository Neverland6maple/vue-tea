<template>
  <ul class="icons">
    <li v-for='(item,index) in iconsList' :key='index'>
      <img :src="item.imgUrl" alt="">
      <span>{{item.title}}</span>
    </li>
  </ul>
</template>

<script lang="ts">
import { reactive } from '@vue/reactivity';

export default {
  name: 'Icons',
  props:{
    iconsList:{
      type:Array,
      require:true
    }
  },
  setup() {
      const iconsList = reactive([
        {id:1,title:"自饮差",imgUrl:"./images/icons1.png"},
        {id:2,title:"茶具",imgUrl:"./images/icons2.png"},
        {id:3,title:"茶礼盒",imgUrl:"./images/icons3.png"},
        {id:4,title:"领福利",imgUrl:"./images/icons4.png"},
        {id:5,title:"官方验证",imgUrl:"./images/icons5.png"},
        ])
      return {
        iconsList
      };
    },
  components: {
  },
}
</script>

<style scoped>
.icons{
	display: flex;
	justify-content: space-around;
	padding:0.4rem 0;
}
.icons li{
	display: flex;
	flex-direction: column;
	align-items: center;
}
.icons img{
	width: 1.013333rem;
	height: 1.013333rem;
}
.icons span{
	padding:0.16rem 0;
	font-size:0.426666rem;
}
</style>
