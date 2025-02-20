<script setup lang="ts">
import {shallowRef} from "vue";
import {ElButton, ElSwitch, ElDrawer, ElMessage} from "element-plus";
import {useStore} from "../stores";
import {Download, List, Operation, Upload} from "@element-plus/icons-vue";
import {openFileInBrowser, merge, isMobile, getDateTimeString, saveFile} from "../helpers.ts";
import {writeXLSX} from "xlsx";

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

const exportData = async () => {
  const {groups, order} = store;
  const filename = 'progulschik_backup_' + getDateTimeString() + '.json';
  const json = JSON.stringify({groups, order});
  await saveFile(json, filename);
  isShow.value = false;
}

const importData = async () => {
  try {
    const [file] = await openFileInBrowser('.json') as unknown as File[];

    const {groups, order} = JSON.parse(await file.text())
    Object.assign(store.groups, groups);
    store.order = merge(store.order, order);
    store.keys = JSON.parse(JSON.stringify(store.order));
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
  return val ? localStorage.setItem('dark', '1') : localStorage.removeItem('dark');
}

const changeMulti = (val: boolean) => {
  return val ? localStorage.setItem('multi', '1') : localStorage.removeItem('multi');
}

const changeSync = (val: boolean) => {
  return val ? localStorage.setItem('sync', '1') : localStorage.removeItem('sync');
}

const exportToXLS = async () => {
  const filename = 'progulschik_export_' +  getDateTimeString() + '.xlsx';
  let Sheets: any = {};

  const SheetNames = store.order.map((i: string) => {
    const {meta, students} = store.groups[i];
    Sheets[meta.name] = {
      '!ref': 'A1:B9999',
      '!cols': [{wpx: 300}, {wpx: 600}],
      '!rows': []
    };

    for (const s of students) {
      const s_i: number = students.indexOf(s) + 1;
      const name = 'A' + s_i;
      const att = 'B' + s_i;
      const {attendance} = s;

      let att_val = '';

      const sortedAttendance = Object.keys(attendance).sort((a: string, b: string) => {
        const _a = a.split('.');
        const _b = b.split('.');
        return new Date(+_a[2], +_a[1] - 1, +_a[0]).getTime() - new Date(+_b[2], +_b[1] - 1, +_b[0]).getTime()
      });

      let count = 1;
      let hpx = 19;



      for (const a of sortedAttendance) {
        att_val += `${a}: ${attendance[a].join(', ')} ${count == sortedAttendance.length ? '' : '\n'}`;

        if (count > 1 && count <= sortedAttendance.length) hpx += 12;
        count++
      }

      Sheets[meta.name]['!rows'].push({hpx});

      Sheets[meta.name][name] = {
        v: `${s.surname} ${s.name} ${s.patroname}`
      }
      Sheets[meta.name][att] = {
        v: att_val
      }
    }

    return meta.name
  });

  const workBook = {
    Sheets,
    SheetNames
  }

  const data = writeXLSX(workBook, {type: "array"});
  await saveFile(data, filename);
  isShow.value = false;
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
                     @change="changeTheme as any"
          />

          <el-switch v-model="store.multiCollapse" size="large" class="mb-3"
                     :active-text="`Разворачивать ${store.multiCollapse ? 'по одному' : 'всех'}`"
                     @change="changeMulti as any"
          />

          <el-switch v-model="store.calendarSync" size="large" class="mb-5"
                     active-text="Синхронизировать календари"
                     @change="changeSync as any"
          />

          <el-button type="primary" size="large"  :icon="List" @click="exportToXLS">Экспорт в Excel</el-button>

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