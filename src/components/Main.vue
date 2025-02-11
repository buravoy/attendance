<script setup lang="ts">
import Groups from "./Groups.vue";
import {ElScrollbar} from "element-plus";
import {useStore} from "../stores";
import CurrentGroup from "./CurrentGroup.vue";
import {nextTick, onMounted, ref} from "vue";

const store = useStore();
const scrollRef = ref();

const parseScroll = ({scrollTop}: {scrollTop: number}) => {
  if (!store.currentGroup) {
    store.scroll = scrollTop;
  }
};

onMounted(() => {
  nextTick(() => {
    store.scrollRef = scrollRef.value;
  })
})
</script>

<template>
  <el-scrollbar ref="scrollRef" class="scroll" @scroll="parseScroll">
    <main>
      <Groups v-if="!store.currentGroup"/>
      <CurrentGroup v-if="store.currentGroup"/>
    </main>
  </el-scrollbar>
</template>

<style scoped lang="scss">
.scroll {
  height: calc(100vh - var(--at-header-height) - 1px);
}
</style>