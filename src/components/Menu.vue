<script setup lang="ts">
import {shallowRef} from "vue";
import {ElButton, ElSwitch, ElDrawer, ElMessage} from "element-plus";
import {useStore} from "../stores";
import {Download, Operation, Upload} from "@element-plus/icons-vue";
import {openFileInBrowser, merge, jsonToBase64} from "../helpers.ts";
import {Directory, Filesystem} from "@capacitor/filesystem";
import {Share} from "@capacitor/share";

const store = useStore();
const isShow = shallowRef(false);

const onOpen = () => {
  store.isStart = false;
  store.backHandler(() => {
    isShow.value = false;
  })
}

const onClose = () => {
  store.isStart = true;
}

const exportData = () => {
  const {groups, order} = store;
  const filename = 'attendance_backup_' + new Date().toDateString().replaceAll(' ', '_') + '.json';
  const json = JSON.stringify({groups, order});
  const data = jsonToBase64(json);

  Filesystem.writeFile({
    path: filename,
    data: data,
    directory: Directory.Cache
  }).then(() => {
    return Filesystem.getUri({
      directory: Directory.Cache,
      path: filename
    });
  }).then((uriResult) => {
    return Share.share({
      title: filename,
      text: filename,
      url: uriResult.uri,
    });
  }).then(() => {
    ElMessage({
      message: 'Данные отправлены',
      type: 'success',
      showClose: true,
    })
  });

  isShow.value = false;
}

const importData = async () => {
  try {
    const json = await openFileInBrowser('.json');
    const file = JSON.parse(json!);
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

    <el-drawer v-model="isShow" size="100%" @opened="onOpen" @closed="onClose">
      <template #header>
        <h4>Настройки</h4>
      </template>
      <template #default>
        <div class="d-flex flex-column">
          <el-switch v-model="store.dark" size="large" class="mb-5" active-text="Светлая тема" inactive-text="Темная" @change="changeTheme as any"/>

          <el-button type="primary" size="large" class=" mb-3" :icon="Upload" @click="exportData">Экспорт данных</el-button>
          <el-button type="primary" size="large" class="m-0" :icon="Download" @click="importData">Импорт данных</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">

</style>