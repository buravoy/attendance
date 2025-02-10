<script setup lang="ts">
import {useStore} from "../stores";
import {VueDraggableNext as Draggable} from 'vue-draggable-next'
import GroupItem from "./GroupItem.vue";

const store = useStore();

const changeOrder = () => {

  setTimeout(() => {
    store.refresh();
  }, 3000)
}

</script>

<template>
  <Draggable :list="store.groups" @change="changeOrder">
    <GroupItem v-for="item in store.groups" :data="item" />
  </Draggable>

</template>

<style scoped lang="scss">

</style>