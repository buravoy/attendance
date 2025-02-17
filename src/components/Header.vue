<script setup lang="ts">
import {Back} from "@element-plus/icons-vue";
import NewGroup from "./NewGroup.vue";
import {useStore} from "../stores";
import NewStudent from "./NewStudent.vue";
import {nextTick, onMounted, ref} from "vue";
import Menu from "./Menu.vue";
import {getColorByBgColor} from "../helpers.ts";

const store = useStore();
const newGroupRef = ref();

onMounted(() => {
  nextTick(() => {
    store.newGroupRef = newGroupRef.value;
  })
})
</script>

<template>
  <div class="header-wrap" :style="{backgroundColor: store.currentGroup?.meta.color}">
    <header>
      <div v-if="store.backCb" class="back header-btn" @click="store.backCb()" :style="{color: getColorByBgColor(store.currentGroup?.meta.color)}">
        <Back class="icon"/>
      </div>
      <div class="title" :class="{'ms-3': !store.backCb}" :style="{color: getColorByBgColor(store.currentGroup?.meta.color)}">
        <h4>{{ store.title }} {{`${!store.currentGroup ? '(' + store.order.length + ')' : '(' + store.currentGroup.students.length + ')'}`}}</h4>
        <p v-if="store.desc">{{store.desc}}</p>
      </div>
      <div class="control ms-auto">
        <NewGroup ref="newGroupRef" v-show="!store.currentGroup" />
        <NewStudent v-if="store.currentGroup" />
        <Menu />
      </div>
    </header>
  </div>
</template>

<style scoped lang="scss">
.header-wrap {
  background-color: var(--el-color-primary-light-9);
}

:deep(.header-btn) {
  min-width: var(--at-header-height);
  height: var(--at-header-height);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  z-index: 1;

  &:before {
    position: absolute;
    content: '';
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: transparent;
    transition: .2s;
    opacity: 0;
    z-index: 0;
  }

  &:hover {
    &:before {
      background-color: var(--el-color-black);
      opacity: .1;
    }
  }

  .el-button {
    border: none;
    position: relative;
    overflow: hidden;
    pointer-events: none;

    &:before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: var(--el-mask-color-extra-light);
    }
  }
}

.icon {
  width: 20px;
  height: 20px;
  z-index: 1;
}


header {
  height: var(--at-header-height);
  display: flex;
  align-items: center;
  max-width: 800px;
  margin: auto;
}


.back, .control {
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: calc(100vw - var(--at-header-height) - var(--at-header-height) - var(--at-header-height));

  h4 {
    white-space: nowrap;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-left: 10px;
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