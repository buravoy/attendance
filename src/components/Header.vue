<script setup lang="ts">
import {ElIcon} from "element-plus";
import {Back} from "@element-plus/icons-vue";
import NewGroup from "./NewGroup.vue";

defineProps({
  title: String
})

</script>

<template>
  <header class="pe-3">
    <el-icon :size="20">
      <Back />
    </el-icon>
    <p>{{ title }}</p>
    <NewGroup />
  </header>
</template>

<style scoped lang="scss">
header {
  height: 60px;
  display: flex;
  align-items: center;
}
</style>