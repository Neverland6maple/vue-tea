<template>
  <div class='swiper-main'>
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(item,index) in swiperList" :key="index">
        <img :src="item.imgUrl" alt="">
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Swiper',
  props:{
    swiperList:{
      type:Array,
      require:true
    }
  }
}
</script>

<style scoped>
.swiper-main{
	position: relative;
	width: 100%;
	height: 4.4rem;
}
.swiper-container{
	width: 100%;
	height: 4.4rem;
}
.swiper-main img{
	width: 100%;
	height: 4.4rem;
}
.swiper-pagination{
	width: 100%;
	bottom:0px;
}
::v-deep .swiper-pagination-bullet-active{
	background-color: #b0352f;
}
::v-deep .swiper-pagination-bullet{
	margin:0 0.08rem;
}

</style>
