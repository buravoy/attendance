<script setup lang="ts">
import Header from "./components/Header.vue";
import Main from "./components/Main.vue";
import {useStore} from "./stores";

const store = useStore();


</script>

<template>
  <div class="common-layout">
    <Header :title="store.title"/>
    <Main/>
  </div>
</template>

<style scoped lang="scss">

</style>
