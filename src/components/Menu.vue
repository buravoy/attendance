<script setup lang="ts">
import {shallowRef} from "vue";
import {ElButton, ElSwitch, ElDrawer, ElMessage} from "element-plus";
import {useStore} from "../stores";
import {Download, List, Operation, Upload} from "@element-plus/icons-vue";
import {openFileInBrowser, merge, jsonToBase64, isMobile} from "../helpers.ts";
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
    <div class="header-btn" @click="isShow = true">
      <el-button size="large" class="menu" :icon="Operation"  plain circle style="font-size: 20px"/>
    </div>

    <el-drawer v-model="isShow" :size="isMobile() ? '100%' : '800px'" @opened="onOpen" @closed="onClose">
      <template #header>
        <h4>Настройки</h4>
      </template>
      <template #default>
        <div class="d-flex flex-column">
          <el-switch v-model="store.dark" size="large" class="mb-3"
                     :active-text="`${store.dark ? 'Светлая' : 'Темная'} тема`"
                     @change="changeTheme as any"/>
          <el-switch v-model="store.multiCollapse" size="large" class="mb-3" :active-text="`Разворачивать ${store.multiCollapse ? 'по одному' : 'всех'}`" />
          <el-switch v-model="store.calendarSync" size="large" class="mb-5" active-text="Синхронизировать календари" />

          <el-button type="primary" size="large"  :icon="List" @click="exportData">Экспорт в CSV</el-button>


          <div class="divider"></div>

          <div class="d-flex align-items-center justify-content-around">
            <el-button type="primary" size="large" class="w-100" :icon="Upload" @click="exportData">Бекап</el-button>
            <el-button type="primary" size="large" class="w-100" :icon="Download" @click="importData">Восстановление</el-button>
          </div>

        </div>
      </template>
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">
.divider {
  width: 85%;
  height: 1px;
  background-color: var(--el-color-info);
  margin: 20px auto;
}
</style>