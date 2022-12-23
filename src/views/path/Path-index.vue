<template>
  <div class='path-index container'>
    <Header></Header>
    <section>
      <ul v-if="pathStore.address.length > 0">
        <li v-for="(item,index) in pathStore.address" :key="item.id" @click="goAddPath(item)">
          <div>
            <span>{{item.name}}</span>
            <span>{{item.tel}}</span>
          </div>
          <div class='city'>
            <span class='active' v-if="item.isDefault == 1">[默认]</span>
            <span>{{item.province}}</span>
            <span>{{item.city}}</span>
            <span>{{item.county}}</span>
            <span>{{item.addressDetail}}</span>
          </div>
        </li>
      </ul>
      <h2 v-else>暂无数据，请添加地址</h2>
      <div class='add-path' @click="goAddPath('add')">添加地址</div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script lang="ts">
import Tabbar from '@/components/common/Tabbar.vue';
import Header from '@/components/path/Header.vue'
import { useRoute, useRouter } from 'vue-router';
import {usePathStore} from '@/store/path'
import { inject, provide, ref } from 'vue';

export default{
  name:'Path-index',
  setup() {
    const router = useRouter()
    const pathStore = usePathStore();
    const axios:any = inject('axios');
    const route = useRoute()

    const goAddPath = (data)=>{  
      if(route.query.type == 'select'){
        if(typeof data != 'string'){
          route.params.newPath = JSON.stringify(data);
          router.back();
          return;
        }
      }
      
      router.push({
        path:'/path-list',
        query:{
          key:JSON.stringify(data)
        }
      })
    }
    
    const getData = async ()=>{
      const {data:res} = await axios({
        method:'post',
        url:'/api/selectAddress',
        headers:{
          token:true
        }
      })
      if(res.success) pathStore.initAddress(res.data);
    }
    getData();
    return{
      goAddPath,
      pathStore,
    }
  },
  components:{
    Tabbar,
    Header
  }
}
</script>

<style lang='scss' scoped>
section{
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #F7F7F7;
    ul{
        width: 100%;
        li{
            padding:0.266666rem 0.4rem;
            margin:0.16rem 0;
            background-color: #FFFFFF;
            span{
                padding-right:0.4rem;
                font-size:0.426666rem;
            }
            .active{
                color:#b0352f;
            }
            .city{
                span{
                    padding-right:0.16rem;
                }
            }
        }
    }
    .add-path{
        margin-top:0.8rem;
        width: 3.2rem;
        line-height: 1.066666rem;
        font-size:0.48rem;
        text-align: center;
        color:#FFFFFF;
        background-color: #b0352f;
        border-radius: 6px;
    }
}
::v-deep .tabbar{
    border-top:2px solid #ccc;
}
</style>
