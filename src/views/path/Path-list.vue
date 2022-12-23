<template>
  <div class='path-index container'>
    <Header>
      <span>添加地址</span>
    </Header>
    <section>
      <van-address-edit :area-list="areaList" show-set-default :search-result="searchResult" @save="onAdd" v-if="pathStatus" />

      <van-address-edit :area-list="areaList" show-delete show-set-default :search-result="searchResult" @save="onSave" @delete="onDelete" :address-info="addressEditInfo" v-else />
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script lang="ts">
import Tabbar from '@/components/common/Tabbar.vue';
import Header from '@/components/path/Header.vue'
import { inject, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
export default{
  name:'Path-list',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const pathStatus = ref(true);
    const axios:any = inject('axios');
    const searchResult = ref([]);
    const addressEditInfo = ref({});
    const areaList = {
      province_list: {
        110000: '北京市',
        120000: '天津市',
      },
      city_list: {
        110100: '北京市',
        120100: '天津市',
      },
      county_list: {
        110101: '东城区',
        110102: '西城区',
        120101: '塘沽区',
      },
    };
    onMounted(() => {
      const key = JSON.parse(route.query.key as string)
      if( key != 'add'){
        pathStatus.value = false;
        console.log(key);
        addressEditInfo.value = key;
        //@ts-ignore
        addressEditInfo.value.isDefault = addressEditInfo.value.isDefault == 1 ? true : false;     
      }
    })
    const onAdd = async (content)=>{
      content.isDefault = content.isDefault == true ? 1 : 0;
      console.log(content);
      const {data:res} = await axios({
        method:'post',
        url:'/api/addAddress',
        data:{
          ...content
        },
        headers:{
          token:true
        }
      })
      if(res.success){
        router.push('/path');
      }
    }
    const onDelete = async (content)=>{
      const {data:res} = await axios({
        method:'post',
        url:'/api/deleteAddress',
        data:{
          id:content.id
        },
        headers:{
          token:true
        }
      })
      if(res.success){
        router.push('/path');
      }
    }
    const onSave = async (content) =>{
      content.isDefault = content.isDefault == true ? 1 : 0;
      const {data:res} = await axios({
        method:'post',
        url:'/api/updateAddress',
        data:{
          ...content
        },
        headers:{
          token:true
        }
      })
      if(res.success){
        router.push('/path');
      }
    }

    return {
      onSave,
      areaList,
      searchResult,
      onDelete,
      pathStatus,
      addressEditInfo,
      onAdd
    };
  },
  components:{
    Tabbar,
    Header
  },

}
</script>

<style lang='scss' scoped>
section{
    background-color: #F7F7F7;
    .van-address-edit{
        padding: 0;
    }
    ::v-deep .van-address-edit__buttons{
        display: flex;
        justify-content: center;
        align-items:center;
        flex-wrap: wrap;
    }
    ::v-deep .van-button--danger{
        width: 8rem;
        height: 1.066666rem;
        background-color: #b0352f;
    }
    ::v-deep .van-button--default{
        width: 8rem;
        height: 1.066666rem;
    }
}
::v-deep .tabbar{
    border-top:2px solid #ccc;
}
</style>
