<template>
  <div class='ad'>
    <ul>
      <li v-for='(item,index) in adList' :key='index'>
        <img :src="item.imgUrl" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
export default{
  name:'ad',
	props:{
		adList:Array
	}
}
</script>

<style scoped>
.ad{
	width: 100%;
}
.ad img{
	width: 100%;
	height:100%;
}
</style>
