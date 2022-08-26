<template>
  <div id="nav">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" v-if="$route.meta.keepAlive" />
      </keep-alive>
      <component :is="Component" v-if="!$route.meta.keepAlive" />
    </router-view>
  </div>
</template>

<style>
</style>
<script lang="ts">
import { useUserStore } from "./store/user"
export default{
  setup() {
    const userStore = useUserStore();
    userStore.initUser();
    return{

    }
  }
}
</script>
