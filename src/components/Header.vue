<script setup lang="ts">
import {Back} from "@element-plus/icons-vue";
import NewGroup from "./NewGroup.vue";
import {useStore} from "../stores";
import NewStudent from "./NewStudent.vue";

const store = useStore();
</script>

<template>
  <header :style="{backgroundColor: store.currentGroup?.meta.color}">
    <div v-if="store.backCb" class="back" @click="store.backCb()">
      <Back class="icon"/>
    </div>
    <div class="title" :class="{'ms-3': !store.backCb}">
      <h4>{{ store.title }} {{`${!store.currentGroup ? '(' + store.order.length + ')' : '(' + store.currentGroup.students.length + ')'}`}}</h4>
      <p v-if="store.desc">{{store.desc}}</p>
    </div>
    <div class="control ms-auto">
      <NewGroup v-if="!store.currentGroup"/>
      <NewStudent v-if="store.currentGroup"/>
    </div>
  </header>
</template>

<style scoped lang="scss">
.icon {
  width: 20px;
  height: 20px;
  z-index: 1;
}


header {
  height: var(--at-header-height);
  display: flex;
  align-items: center;
  background-color: var(--el-color-primary-light-9);
}


.back, .control {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--at-header-height);
  min-width: var(--at-header-height);
}

.title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: calc(100vw - var(--at-header-height) - var(--at-header-height));

  h4 {
    white-space: nowrap;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    font-size: 12px;
    margin-top: 3px;
    color: var(--el-color-info-light-3);
    white-space: nowrap;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>