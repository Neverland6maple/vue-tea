<template>
  <header>
    <h1>
      <img src="@/assets/images/gdut.png" alt="">
    </h1>
    <div class='search'>
      <i class='iconfont icon-fangdajing'></i>
      <span>搜您喜欢的...</span>
    </div>
    <div class='kefu'>
      <i class='iconfont icon-kefu'></i>
    </div>
  </header>
</template>

<script lang="ts">
import {defineComponent,reactive} from 'vue';
import { useRoute, useRouter } from 'vue-router';
export default defineComponent({
  name: "Header",
  setup(){
		return{

		}
  }
});

</script>

<style scoped>
header{
	display: flex;
	justify-content: space-around;
	align-items: center;
	width: 100%;
	height: 1.6rem;
	background-color: #b0352f;
}
header h1{
  display: flex;
  align-items: center;
	/* padding:0 0.266666rem; */
	width:2.5rem;
	/* height: 1.333333rem; */
}
header h1 img{
	width: 1.8rem;
	height: 100%;
}
.search{
	display: flex;
	align-items: center;
	width: 5rem;
	height: 0.8rem;
	background-color: #FFFFFF;
	border-radius: 12px;
}
.search i {
	padding:0 0.16rem;
	color:#ccc;
}
.search span{
	font-size:0.373333rem;
	color:#ccc;
}
.kefu i{
	font-size:0.96rem;
	color:#fff;
}
</style>
