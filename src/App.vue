<script setup lang="ts">
import Header from "./components/Header.vue";
import Main from "./components/Main.vue";
import {onBeforeMount, onMounted, shallowRef} from "vue";
import {App as CapacitorApp} from '@capacitor/app';
import {Toast} from "@capacitor/toast";
import {useStore} from "./stores";

const confirmExit = shallowRef(false);
const store = useStore();

onBeforeMount(() => {
  const dark = localStorage.getItem('dark');
  if (dark) {
    store.dark = true;
    document.documentElement.classList.toggle('dark', !store.dark);
  }
})

onMounted(async () => {
  await CapacitorApp.addListener('backButton', async () => {
    if (!window.location.hash) {
      if (confirmExit.value) {
        await CapacitorApp.exitApp();
      } else {
        confirmExit.value = true;
        await Toast.show({
          text: 'Нажмите еше раз для выхода'
        });
        setTimeout(() => confirmExit.value = false, 2000);
      }
      return;
    }

    window.history.back();
  });

  window.onpopstate = () => {
    store.popStateHandler();
  }
})
</script>

<template>
  <div class="common-layout">
    <Header />
    <Main />
  </div>
</template>

<style scoped lang="scss">
.common-layout {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}

.scroll {
  height: calc(100vh - 60px);
}
</style>
