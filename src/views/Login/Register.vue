<template>
  <div class='login container'>
    <Header title="注册"></Header>
    <section>
      <div class='login-tel'>
        <input type="text" placeholder="请输入手机号" pattern="[0-9]*" v-model="telVal">
      </div>
      <div class='login-code'>
        <input type="text" placeholder="请输入短信验证码" pattern="[0-9]*" v-model="codeVal">
        <button @click="sendCode" v-if="disable">发送验证码</button>
        <button v-else disabled>过{{codeNum}}秒重新发送</button>
      </div>
      <div class='login-tel'>
        <input type="text" placeholder="请输入密码" v-model="pwdVal">
      </div>
      <div class='login-btn' @click='register'>注 册</div>
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
export default{
  name:'Login',
  setup(){
    const router = useRouter();
    const axios:any = inject('axios');
    const telVal = ref('');
    const pwdVal = ref('');
    const user = reactive({data:{}});
    const disable = ref(true);
    const codeNum = ref(5);
    const code = ref(NaN);
    const codeVal = ref('');
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


    const register = async ()=>{
      if(!rules.tel.rule.test(telVal.value)){
        Notify(rules.tel.msg);
        return;
      }
      if(parseInt(codeVal.value) == code.value){
        const {data:res} = await axios.post('/api/register',{
          tel:telVal.value,
          pwd:pwdVal.value
        });

        if(res.success){
          Notify({type:'success',message:'注册成功'});
          user.data = res.data;
          router.push('/userLogin');
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
      register,
      disable,
      codeNum,
      sendCode,
      codeVal
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
