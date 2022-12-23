// export default axios
import { useUserStore } from "@/store/user";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import router from '@/router'
import { ElLoading } from 'element-plus'
import { Notify } from 'vant';
const jwt = require("jsonwebtoken");

let loadingInstance:any;

function startLoading(){
  interface Options{
    lock: boolean;
    text: string;
    background: string;
  }
  const options:Options = {
    lock:true,
    text:'加载中...',
    background:'rgba(0.0.0.0.7)'
  }
  loadingInstance = ElLoading.service(options);
}

function endLoading(){
  loadingInstance.close();
}

//请求拦截
axios.interceptors.request.use((config:AxiosRequestConfig<any>) => {
  startLoading();
  if(config.headers.token){
    const userStore = useUserStore()
    config.headers.token = userStore.token;
    const tokenObj = jwt.decode(config.headers.token);
    if(!config.headers.token){
      router.push('/login')
      Notify('请先登录')
      return;
    }
    if(tokenObj.exp - new Date().getTime() /1000 < 0){
      router.push('/login')
      Notify('登录已过期,请用手机号重新登录')
      return;
    }
  }
  
  return config;
})


//响应拦截
axios.interceptors.response.use((response:AxiosResponse<any,any>) =>{
  endLoading();
  return response;
},error => {
  endLoading();
  //错误提醒
  return error;
})
export default axios