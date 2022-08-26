<template>
  <div class='login container'>
    <Header title="修改密码"></Header>
    <section>
      <div class='login-tel'>
        <input type="text" placeholder="请输入新密码" pattern="[0-9]*" v-model="pwdVal">
      </div>
      <div class='login-btn' @click='submitBtn'>修 改</div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script lang="ts">
import { Notify } from 'vant';
import { reactive, ref } from '@vue/reactivity'
import { useRoute, useRouter } from 'vue-router';
import { inject } from '@vue/runtime-core';
import Header from '@/views/Login/Header.vue'
import Tabbar from '@/components/common/Tabbar.vue'
export default{
  name:'Login',
  setup(){
    const route = useRoute();
    const router = useRouter();
    const axios:any = inject('axios');
    const pwdVal = ref('');
    const telVal = ref(route.params.tel as string);
    const rules = reactive({
      pwd:{
        rule:/[0-9A-Za-z_\\W]{6,20}/,
        msg:'密码由数字字母以及_下划线 各种常规符号组成且6~20位限制'
      }
    })

    const submitBtn = async ()=>{
      if(!rules.pwd.rule.test(telVal.value)){
        Notify(rules.pwd.msg);
        return;
      }

      const {data:res} = await axios.post('/api/recovery',{
          tel:telVal.value,
          pwd:pwdVal.value
      });
      if(res.success){
        Notify({type:'success',message:'修改成功，请重新登录'})
        router.push('/userLogin');
      }else{
        Notify(res.msg)
      }
      console.log(res);
    }
  
    return{
      pwdVal,
      submitBtn
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
