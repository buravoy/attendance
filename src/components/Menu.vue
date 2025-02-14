<script setup lang="ts">
import {shallowRef} from "vue";
import {ElButton, ElSwitch, ElDrawer, ElMessage} from "element-plus";
import {useStore} from "../stores";
import {Download, Operation, Upload} from "@element-plus/icons-vue";
import {helpers, merge} from "../helpers.ts";

const store = useStore();
const isShow = shallowRef(false);

const onOpen = () => {
  store.backHandler(() => {
    isShow.value = false;
  })
}

const exportData = () => {
  const {groups, order} = store;

  const blob = new Blob([
    JSON.stringify({groups, order})
  ]);
  const fileUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = 'attendance_backup_' + new Date().toDateString().replaceAll(' ', '_') + '.json';
  link.href = fileUrl;
  link.click();

  ElMessage({
    message: 'Данные сохранены в файл',
    type: 'success',
    showClose: true,
  })

  isShow.value = false;

}

const importData = async () => {
  try {
    const file = await helpers('.json');
    const {groups, order} = JSON.parse(file!)
    Object.assign(store.groups, groups);
    store.order = merge(store.order, order);
    store.keys = store.order;
    await store.fullSync();
    isShow.value = false;

    ElMessage({
      message: 'Данные загружены',
      type: 'success',
      showClose: true,
    })
  } catch (e) {
    ElMessage({
      message: 'Ошибка импорта',
      type: 'error',
      showClose: true,
    })
  }
}

const changeTheme = (val: boolean) => {
  document.documentElement.classList.toggle('dark', !val);

  if (val) {
    localStorage.setItem('dark', '1');
  } else {
    localStorage.removeItem('dark');
  }
}
</script>

<template>
  <div>
    <el-button size="large" class="menu" :icon="Operation" @click="isShow = true" plain circle style="font-size: 20px"/>

    <el-drawer v-model="isShow" size="100%" @opened="onOpen">
      <template #header>
        <h4>Настройки</h4>
      </template>
      <template #default>
        <div class="d-flex flex-column">
          <el-switch v-model="store.dark" size="large" class="mb-5" active-text="Светлая тема" inactive-text="Темная" @change="changeTheme as any"/>

          <el-button type="primary" size="large" class=" mb-3" :icon="Download" @click="exportData">Экспорт данных</el-button>
          <el-button type="primary" size="large" class="m-0" :icon="Upload" @click="importData">Импорт данных</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">

</style>