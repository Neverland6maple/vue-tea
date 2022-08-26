<template>
  <div class='login container'>
    <Header></Header>
    <section>
      <div class='login-tel'>
        <input type="text" placeholder="请输入手机号" pattern="[0-9]*" v-model="telVal">
      </div>
      <div class='login-code'>
        <input type="text" placeholder="请输入密码" pattern="[0-9]*" v-model="pwdVal">
      </div>
      <div class='login-btn' @click='login'>登 录</div>
      <div class='tab'>
        <span @click='goLogin'>短信登录</span>
        <span @click="goRecovery">找回密码</span>
        <span @click='goRegister'>快速注册</span>
      </div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script lang="ts">
import { Notify } from 'vant';
import { reactive, ref } from '@vue/reactivity'
import { useRouter } from 'vue-router';
import { inject } from '@vue/runtime-core';
import Header from './Header.vue'
import Tabbar from '@/components/common/Tabbar.vue'
import {useUserStore}from '@/store/user'
export default{
  name:'Login',
  setup(){
    const router = useRouter();
    const userStore = useUserStore();
    const axios:any = inject('axios');
    const telVal = ref('');
    const pwdVal = ref('');
    const rules = reactive({
      tel:{
        rule:/^1[23456789]\d{9}$/,
				msg:'手机号不能为空，并且是11位数字'
      },
      pwd:{
        rule:/[0-9A-Za-z_\\W]{6,20}/,
        msg:'密码由数字字母以及_下划线 各种常规符号组成且6~20位限制'
      }
    })
    const login = async ()=>{
      if(rules.tel.rule.test(telVal.value)){
        if(rules.pwd.rule.test(pwdVal.value)){
          const {data:res} = await axios.post('/api/login',{
            tel:telVal.value,
            pwd:pwdVal.value
          })
          if(res.success == true){
            userStore.userLogin(res.data);
            console.log(userStore.userInfo);
            router.push('/my')
            // Notify({ type: 'success', message: '登陆成功' })
          }else{
            Notify(res.msg);
          }
          
        }else{
          Notify(rules.pwd.msg);
        }
      }else{
        Notify(rules.tel.msg);
      }
    }
    const goLogin = ()=>{
      router.push('/login')
    }
    const goRegister = ()=>{
      router.push('/register')
    }
    const goRecovery = ()=>{
      router.push('/recovery')
    }
    return{
      telVal,
      pwdVal,
      goLogin,
      goRegister,
      login,
      goRecovery
    }
  },
  components:{
    Header,
    Tabbar
  }
  
}
</script>

<style scoped lang='scss'>
section{
	display: flex;
	flex-direction: column;
	align-items: center;
    font-size:0.32rem;
	background-color:#f5f5f5;
	div{
		margin:0.266666rem 0;
		width: 8.933333rem;
		height: 1.173333rem;
	}
	input{
		box-sizing: border-box;
		padding:0 0.266666rem;
		line-height: 1.173333rem;
		background-color: #FFFFFF;
		border:1px solid #ccc;
		border-radius: 6px;
	}
	.login-tel{
		margin-top:0.8rem;
		input{
			width: 8.933333rem;
		}
	}
	.login-code{
		display: flex;
		input{
			flex:1;
		}
		button{
			padding:0 0.533333rem;
			line-height: 1.173333rem;
			color:#fff;
			background-color: #b0352f;
			border:0;
			border-radius: 6px;
		}
	}
	.login-btn{
		line-height: 44px;
		color:#fff;
        font-size: 0.48rem;
		text-align: center;
		background-color: #b0352f;
		border-radius: 6px;
	}
	.tab{
		display: flex;
		justify-content: space-between;
		font-size:0.373333rem;
	}
}
</style>
