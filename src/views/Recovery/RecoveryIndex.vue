<template>
  <div class='login container'>
    <Header title="修改密码"></Header>
    <section>
      <div class='login-tel'>
        <input type="text" placeholder="请输入手机号" pattern="[0-9]*" v-model="telVal">
      </div>
      <div class='login-code'>
        <input type="text" placeholder="请输入短信验证码" pattern="[0-9]*" v-model="codeVal">
        <button @click="sendCode" v-if="disable">发送验证码</button>
        <button v-else disabled>过{{codeNum}}秒重新发送</button>
      </div>
      <div class='login-btn' @click='goBtn'>下 一 步</div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script lang="ts">
import { Notify } from 'vant';
import { reactive, ref } from '@vue/reactivity'
import { useRouter } from 'vue-router';
import { inject } from '@vue/runtime-core';
import Header from '@/views/Login/Header.vue'
import Tabbar from '@/components/common/Tabbar.vue'
export default{
  name:'Login',
  setup(){
    const router = useRouter();
    const axios:any = inject('axios');
    const telVal = ref('');
    const user = reactive({data:{}});
    const disable = ref(true);
    const codeNum = ref(5);
    const codeVal = ref('');
    const code = ref(NaN);
    const rules = reactive({
      tel:{
        rule:/^1[23456789]\d{9}$/,
				msg:'手机号不能为空，并且是11位数字'
      }
    })

    const goBtn = async ()=>{
      if(!rules.tel.rule.test(telVal.value)){
        Notify(rules.tel.msg);
        return;
      }
      if(parseInt(codeVal.value) == code.value){
        const {data:res} = await axios.post('/api/selectUser',{
          tel:telVal.value
        });
        if(res.success){
          router.push({
            name:'Btn',
            params:{
              tel:telVal.value
            }
          })
        }else{
          Notify(res.msg)
        }
        console.log(res);  
      }
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
      codeVal,
      goBtn,
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
