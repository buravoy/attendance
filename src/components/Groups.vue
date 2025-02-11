<script setup lang="ts">
import {useStore} from "../stores";
import {VueDraggableNext as Draggable} from 'vue-draggable-next'
import GroupItem from "./GroupItem.vue";
import {nextTick, onMounted} from "vue";
const store = useStore();

onMounted(() => {
  nextTick(() => {
    store.scrollRef?.scrollTo({top: store.scroll});
  })
})
</script>

<template>
  <Draggable :list="store.order" @change="store.changeOrder()" :delay="500" :animation="500">
    <GroupItem v-for="item in store.order" :data="store.groups[item]" :key="item" @open="store.openGroup(item)"/>
  </Draggable>
</template>

<style scoped lang="scss">

</style>