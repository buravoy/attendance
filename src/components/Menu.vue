<script setup lang="ts">
import {shallowRef} from "vue";
import {ElButton, ElSwitch, ElDrawer} from "element-plus";
import {useStore} from "../stores";
import {Download, Operation} from "@element-plus/icons-vue";

const store = useStore();

const isShow = shallowRef(false);
const value1 = shallowRef(false);



</script>

<template>
  <div>
    <el-button type="primary" size="large" class="menu" :icon="Operation" @click="isShow = true" text circle style="font-size: 20px"/>

    <el-drawer v-model="isShow" size="100%">
      <template #header>
        <h4>Настройки</h4>
      </template>
      <template #default>
        <div class="d-flex flex-column">
          <el-switch v-model="value1" size="large" class="mb-5" active-text="Светлая тема" inactive-text="Темная"/>

          <el-button type="primary" size="large" class="" :icon="Download">Экспорт данных</el-button>
        </div>

      </template>
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">
.menu {
  margin: 0 10px;
}
</style>