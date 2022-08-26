<template>
  <div class='my container'>
    <header>
      <div class='user-info'>
        <div class='user-info' v-if='userStore.loginStatus'>
          <img :src="userStore.userInfo.imgUrl" alt="">
          <span>{{userStore.userInfo.nickName}}</span>
        </div>
        <div class="login" @click="goLogin" v-else>登录/注册</div>
      </div>
    </header>
    <section>
      <ul>
        <li @click="goPath">地址管理</li>
        <li v-if="userStore.loginStatus" @click="userStore.loginOut">退出登录</li>
      </ul>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Tabbar from '@/components/common/Tabbar.vue'
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user";
export default defineComponent({
  name: "My",
  components: {
    Tabbar
  },
  setup(){
    const router = useRouter();
		const userStore = useUserStore();
    const goLogin = ()=>{
      router.push('/login');
    }
		const goPath = ()=>{
			router.push('/path')
		}
    return {
      goLogin,
			userStore,
			goPath
    }
  }
});
</script>

<style scoped lang='scss'>
header{
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 4.266666rem;
	background-color: #B0352F;
	.login{
		padding:0.16rem 0.4rem;
		font-size:0.426666rem;
		color:#fff;
		background-color:#F6AB32;
		border-radius: 6px;
	}
	.user-info{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		img{
			width: 1.76rem;
			height:1.76rem;
			border-radius: 50%;
		}
		span{
			padding:0.533333rem 0;
			font-size:0.48rem;
			color:#fff;
		}
	}
}
section{
	flex:1;
	overflow: hidden;
	ul li{
		padding:0.4rem;
		font-size:0.426666rem;
	}
}
</style>
