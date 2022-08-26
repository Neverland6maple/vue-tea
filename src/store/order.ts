import { defineStore } from "pinia";

export const useOrderStore = defineStore('order',{
  state:()=>{
    return{
      id:localStorage.getItem('tea_orderCode') ||''
    }
  },
  actions:{
    initOrder(id){
      this.id = id;
      console.log(id);
      
      localStorage.setItem('tea_orderCode',id)
    }
  }
})