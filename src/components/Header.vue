<script setup lang="ts">
import {Back} from "@element-plus/icons-vue";
import NewGroup from "./NewGroup.vue";

defineProps({
  title: String
})

</script>

<template>
  <header class="pe-3">
    <div class="back">
      <Back class="icon"/>
    </div>
    <div class="d-flex align-items-center justify-content-start">
      <h4>{{ title }}</h4>
    </div>
    <NewGroup />
  </header>
</template>

<style scoped lang="scss">
.icon {
  width: 20px;
  height: 20px;
  z-index: 1;
}

h4 {
  color: rgb(114, 118, 123);
}
header {
  height: var(--at-header-height);
  display: flex;
  align-items: center;
  background-color: var(--el-color-primary-light-9);
}
.back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--at-header-height);
}
</style>