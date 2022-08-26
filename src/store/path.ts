import { defineStore } from "pinia";

export const usePathStore = defineStore('path',{
  state:()=>{
    return{
      address:[]
    }
  },
  getters:{
    defaultPath(state){
      return state.address.find(item=>{
        return item.isDefault == 1;
      })
    }
  },
  actions:{
    initAddress(data){   
      this.address = data;
    }
  }
})