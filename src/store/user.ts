import { defineStore } from "pinia";

interface User{
  id: number
  imgUrl: string
  nickName: string
  pwd: string
  tel: string
  token: string
}

export const useUserStore = defineStore('user',{
  state:()=>{
    return{
      loginStatus:false,
      token:'',
      userInfo:{} as User
    }
  },
  getters:{

  },
  actions:{
    userLogin(user:User){
      this.loginStatus = true;
      this.token = user.token;
      this.userInfo = user;
      localStorage.setItem('teaUserInfo',JSON.stringify(user));
    },
    initUser(){
      const user = JSON.parse(localStorage.getItem('teaUserInfo') as string);
      if(user){
        this.loginStatus = true;
        this.token = user.token;
        this.userInfo = user;
      }
    },
    loginOut(){
      this.loginStatus = false;
      this.token = '';
      this.userInfo = {} as User;
      localStorage.removeItem('teaUserInfo');
    }
  }
})