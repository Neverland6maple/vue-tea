<template>
  <div class='login container'>
    <Header></Header>
    <section>
      <div class='login-tel'>
        <input type="text" placeholder="请输入手机号" pattern="[0-9]*" v-model="telVal">
      </div>
      <div class='login-code'>
        <input type="text" placeholder="请输入短信验证码" pattern="[0-9]*" v-model="pwdVal">
        <button @click="sendCode" v-if="disable">发送验证码</button>
        <button v-else disabled>过{{codeNum}}秒重新发送</button>
      </div>
      <div class='login-btn' @click='login'>登 录</div>
      <div class='tab'>
        <span @click='goUserLogin'>密码登录</span>
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
import { useUserStore } from '@/store/user';
export default{
  name:'Login',
  setup(){
    const userStore = useUserStore()
    const router = useRouter();
    const axios:any = inject('axios');
    const telVal = ref('');
    const pwdVal = ref('');
    const disable = ref(true);
    const codeNum = ref(5);
    const code = ref(NaN);
    const rules = reactive({
      tel:{
        rule:/^1[23456789]\d{9}$/,
				msg:'手机号不能为空，并且是11位数字'
      }
    })

    const login = async ()=>{
      if(!rules.tel.rule.test(telVal.value)){
        Notify(rules.tel.msg);
        return;
      }
      if(parseInt(pwdVal.value) == code.value){
        const {data:res} = await axios.post('/api/addUser',{
          tel:telVal.value
        });
        if(res.success){
          console.log(res.data);
          
          userStore.userLogin(res.data);
          router.push('/my')
        }else{
          Notify(res.msg);
        }
        console.log(res);        
      }
    }

    const goUserLogin = ()=>{
      router.push('/userLogin')
    }
    const goRegister = ()=>{
      router.push('/register')
    }
    const sendCode = ()=>{
      if(rules.tel.rule.test(telVal.value)){
        axios.post('/api/code').then((res:any)=>{
          code.value = res.data.data.data;
          console.log(code.value);
        }).catch((err:any)=>{
          console.log(err);
        })

        Notify({ type: 'success', message: '短信已发送' });
        disable.value = false;
        const timer = setInterval(()=>{
          --codeNum.value;
        },1000)
        setTimeout(()=>{
          clearInterval(timer);
          codeNum.value = 5;
          disable.value = true;
        },5000)
      }else{
        Notify(rules.tel.msg);
      }
      
    }
  
    return{
      telVal,
      pwdVal,
      goUserLogin,
      goRegister,
      login,
      disable,
      codeNum,
      sendCode
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
