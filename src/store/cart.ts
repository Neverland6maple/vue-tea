import { defineStore } from "pinia";
import { List } from "vant";
import axios from '@/common/api/request'
interface List{
  id:number,
  uId:number,
  goods_id:string,
  goods_name:string,
  goods_price:number,
  goods_num:number,
  goods_imgUrl:string,
  checked:boolean
}

export const useCartStore = defineStore('cart',{
  state:()=>{
    return {
      list:[] as List[],
      selectList:[]
    }
  },
  getters:{
    allChecked(state){
      return state.list.length == state.selectList.length
    },
    total(state){
      const total = {
        price:0,
        count:0
      }
      state.list.forEach(ele => {
        if(ele.checked){
          total.price += ele.goods_price * ele.goods_num;
          total.count += ele.goods_num;
        }
      });
      return total;
    }
  },
  actions:{
    initList(cart){
      this.list = cart;
      this.selectList = [];
    },
    check_all(){
      this.list.forEach(ele => {
        ele.checked = true;
        this.selectList.push(ele.id);
      });
    },
    un_check_all(){
      this.list.forEach(ele => {
        ele.checked = false;
      });
      this.selectList = [];
    },
    checkall_fn(){
      this.allChecked ? this.un_check_all() : this.check_all();
    },
    change_checked(id){
      const i = this.selectList.indexOf(id);
      //能在selectList找到对应的id，就删除
      if( i > -1){
          return this.selectList.splice(i,1);
      }
      //如果之前没有选中，就给selectList添加一个id进去
      this.selectList.push( id );
    },
    delgoods_fn(id){
      let idCart = [];
      if(typeof id == 'number'){
        idCart.push(id);
      }else{
        idCart = this.selectList;
      }
      
      axios({
        method:'post',
        url:'/api/deleteCart',
        data:{
          idCart
        }
      }).then((res)=>{
        for(const {index,item} of idCart){
          const ind = this.list.findIndex((ele)=>{
              return ele.id == item
          })
          this.list.splice(ind,1);
        }
        this.selectList = [];
        this.list.forEach((item)=>{
          if(item.checked){
            this.selectList.push(item.id)
          }
        })

        console.log(res);
      })
      
    }

  }
})