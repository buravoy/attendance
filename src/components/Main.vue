<script setup lang="ts">
import Groups from "./Groups.vue";
import {ElScrollbar} from "element-plus";

</script>

<template>
  <el-scrollbar class="scroll">
    <main>
      <Groups/>
    </main>
  </el-scrollbar>
</template>

<style scoped lang="scss">
.scroll {
  height: calc(100vh - var(--at-header-height) - 1px);
}
</style>