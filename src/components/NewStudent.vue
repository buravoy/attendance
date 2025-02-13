<script setup lang="ts">
import {computed, ref, shallowRef} from "vue";
import {ElButton, ElCheckbox, ElDialog, ElDrawer, ElInput, ElMessage, ElOption, ElScrollbar, ElSelect} from "element-plus";
import {useStore} from "../stores";
import {Plus, Upload} from "@element-plus/icons-vue";
import {openFileInBrowser} from "../openFileInBrowser.ts";

const store = useStore();
const inputRef = ref();
const isShow = shallowRef(false);
const dialogVisible = ref(false);
const fileStr = ref<string | null >();
const fileArray = ref<string[][]>();
const csvDelimiter = ref<string>(';');
const ignoreFirstLine = shallowRef(true);
const chunkFIO = shallowRef(true);
const cellOptions = shallowRef(['---', 'ФИО', 'Фамилия', 'Имя', 'Отчество']);
const cellOptVal = ref<string[]>([]);
const studentName = shallowRef('');
const studentSurname = shallowRef('');
const studentPatroname = shallowRef('');

const addStudent = async () => {
  const data = {
    name: studentName.value,
    surname: studentSurname.value,
    patroname: studentPatroname.value,
    attendance: {},
  }

  store.currentGroup.students.push(data);

  studentName.value = '';
  studentSurname.value = '';
  studentPatroname.value = '';

  await store.syncGroup()

  ElMessage({
    message: `Студент добавлен`,
    type: 'success',
    showClose: true,
  });
}

const onOpen = () => {
  setTimeout(inputRef.value?.focus, 200);

  store.backHandler(() => {
    isShow.value = false;
  })
}

const openImport = () => {
  isShow.value = false;
  dialogVisible.value = true;
  fileArray.value = [];
  fileStr.value = '';
}

const CSVToArray = ( strData: string, strDelimiter: string ) => {
  strDelimiter = (strDelimiter || ",");
  const objPattern = new RegExp(("(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
      "([^\"\\" + strDelimiter + "\\r\\n]*))"),"gi");

  const arrData: any[] = [[]];
  let arrMatches = null;
  let strMatchedValue: any;
  while (arrMatches = objPattern.exec( strData )){
    const strMatchedDelimiter = arrMatches[ 1 ];
    if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)){
      arrData.push( [] );
    }
    if (arrMatches[ 2 ]){
      strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g" ),"\"");
    } else {
      strMatchedValue = arrMatches[3];
    }
    arrData[arrData.length - 1].push( strMatchedValue );
  }
  return(arrData);
}

const convertToArray = () => {
  if (!fileStr.value) return;
  fileArray.value = CSVToArray(fileStr.value, csvDelimiter.value);
  cellOptVal.value = fileArray.value[0].map((_, i) => i == 0 ? 'ФИО' : '---');
}

const openFile = async () => {
  fileStr.value = await openFileInBrowser('.csv');

  if (!fileStr.value) {
    fileStr.value = '';
    return ElMessage({
      message: `Файл не поддерживается`,
      type: 'error',
      showClose: true,
    });
  }

  convertToArray()
}

const changeOpt = (key: number, val: string) => {
  if (val == 'ФИО') {
    cellOptVal.value.forEach((_, i) => {
      cellOptVal.value[i] = '---';
    })
  }

  if (val == 'Фамилия') {
    cellOptVal.value.forEach((_, i) => {
      if (cellOptVal.value[i] == 'Фамилия' || cellOptVal.value[i] == 'ФИО') cellOptVal.value[i] = '---';
    })
  }

  if (val == 'Имя') {
    cellOptVal.value.forEach((_, i) => {
      if (cellOptVal.value[i] == 'Имя' || cellOptVal.value[i] == 'ФИО')cellOptVal.value[i] = '---';
    })
  }

  if (val == 'Отчество') {
    cellOptVal.value.forEach((_, i) => {
      if (cellOptVal.value[i] == 'Отчество' || cellOptVal.value[i] == 'ФИО')cellOptVal.value[i] = '---';
    })
  }

  cellOptVal.value[key] = val;
}

const addStudentsFromCSV = async () => {
  if (!fileArray?.value?.length) return;
  let count = 0;

  const indexFIO = cellOptVal.value.findIndex(i => i == 'ФИО');
  const indexSurname = cellOptVal.value.findIndex(i => i == 'Фамилия');
  const indexName = cellOptVal.value.findIndex(i => i == 'Имя');
  const indexPatroname = cellOptVal.value.findIndex(i => i == 'Отчество');

  for (let i = 0; i < fileArray.value.length; i++) {
    if (ignoreFirstLine.value && i == 0) continue;

    const row = fileArray.value[i];
    let student: any = {
      name: '',
      patroname: '',
      attendance: {}
    };

    if (indexFIO >= 0) {
      if (chunkFIO.value) {
        if (!row[indexFIO]) continue;

        const fio: string[] = row[indexFIO].split(' ');
        student.surname = fio[0] || '';
        student.name = fio[1] || '';
        student.patroname = fio[2] || '';
      } else {
        student.surname = row[indexFIO] || '';
      }
    } else {
      student.surname = row[indexSurname] || '';
      student.name = row[indexName] || '';
      student.patroname = row[indexPatroname] || '';
    }

    if (!student.surname) continue;

    store.currentGroup.students.push(student);
    count++
  }

  await store.syncGroup()

  ElMessage({
    message: `Добавлено ${count} студентов`,
    type: 'success',
    showClose: true,
  });

  dialogVisible.value = false;
}

const isImportAvailable = computed(() => {
  if (!fileArray?.value?.length) return false
  if (!cellOptVal.value.includes('Фамилия') && !cellOptVal.value.includes('ФИО')) return false
  return true;
})

const onOpenImport = () => {
  store.backHandler(() => {
    dialogVisible.value = false;
  })
}

const onCloseImport = () => {
  store.backHandler(() => {
    store.backGroups();
  })
}
</script>

<template>
  <div>
    <el-button size="large" :icon="Plus" @click="isShow = true" plain circle />

    <el-drawer v-model="isShow" size="100%" @opened="onOpen" >
      <template #header>
        <div class="title">
          <h4>Добавление студентов</h4>
          <p>в группу: {{store.currentGroup.meta.name}}</p>
        </div>
      </template>
      <template #default>
        <div class="item mb-2">
          <label>Фамилия <span class="required">*</span></label>
          <div class="d-flex align-items-center justify-content-start">
            <el-input ref="inputRef" v-model="studentSurname" size="large"/>
          </div>
        </div>

        <div class="item mb-2">
          <label>Имя</label>
          <div class="d-flex align-items-center justify-content-start">
            <el-input v-model="studentName" size="large"/>
          </div>
        </div>

        <div class="item mb-3">
          <label>Отчество</label>
          <div class="d-flex align-items-center justify-content-start">
            <el-input v-model="studentPatroname" size="large"/>
          </div>
        </div>

        <p>Студентов в группе: {{store.currentGroup.students.length}}</p>
      </template>
      <template #footer>
        <div class="d-flex align-items-center justify-content-between">
          <el-button type="primary" size="large" @click="addStudent" :disabled="!studentSurname.length">Добавить студента</el-button>
          <el-button type="primary" size="large" :icon="Upload" @click="openImport">Импорт</el-button>
        </div>
      </template>
    </el-drawer>

    <el-dialog v-model="dialogVisible" title="Импорт из *.csv" @opened="onOpenImport" @closed="onCloseImport">
      <el-scrollbar v-if="fileArray?.length" class="table-preview">
        <table>
          <thead>
          <tr>
            <th v-for="(_, optKey) in fileArray[0]">
              <el-select v-model="cellOptVal[optKey]" style="width: 120px;" size="small" @change="(val) => changeOpt(optKey, val)" >
                <el-option v-for="opt in cellOptions" :key="opt" :label="opt" :value="opt" />
              </el-select>
            </th>
          </tr>
          </thead>
          <tbody>
            <tr v-for="row in fileArray">
              <th v-for="cell in row">{{ cell }}</th>
            </tr>
          </tbody>
        </table>
      </el-scrollbar>

      <div v-if="fileStr" class="d-flex align-items-center justify-content-center mt-3 mb-2">
        <p class="me-4">Разделитель: </p>

        <el-input v-model="csvDelimiter" style="width: 70px;" class="me-3"/>

        <el-select v-model="csvDelimiter" style="width: 120px;" @change="convertToArray">
          <el-option v-for="item in [{v: ',', d: ', (зпт.)'}, {v:';', d: '; (тчк.зпт.)'}]" :key="item.v" :label="item.d" :value="item.v" />
        </el-select>
      </div>

      <div class="d-flex flex-column align-items-center mb-5">
        <el-checkbox v-if="fileStr" v-model="ignoreFirstLine" label="Игнорировать первую строку" size="large" class="me-0" />
        <el-checkbox v-if="fileStr" v-model="chunkFIO" label="Разбить ФИО по пробелам" size="large" />
      </div>

      <div class="text-center">
        <el-button type="primary" size="large" @click="openFile">Выбрать {{fileStr ? 'другой' : ''}} файл</el-button>
      </div>


      <template #footer>
        <div class="dialog-footer mt-5 text-center">
          <el-button @click="dialogVisible = false">Отмена</el-button>
          <el-button type="primary" @click="addStudentsFromCSV" :disabled="!isImportAvailable">Импортировать</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.table-preview {
  height: 200px;
  padding-bottom: 15px;

  table {
    min-width: 100%;
    border-collapse: collapse;
    tbody {
      th {
        padding: 1px 2px;
      }
    }

    thead th {
      position: sticky;
      top: 0;
      z-index: 1;
      background-color: var(--el-dialog-bg-color);
      padding: 0 2px;
    }
  }
}

.required {
  color: var(--el-color-error);
}

.item {
  label {
    display: block;
    font-size: 14px;
    margin-bottom: 5px;
  }
}

.title {
  max-width: 100%;
  width: calc(100vw - var(--el-drawer-padding-primary) - var(--el-drawer-padding-primary) - var(--el-font-size-extra-large));

  h4 {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    font-size: 14px;
    white-space: nowrap;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.add-student {
  border: none;
  position: relative;
  overflow: hidden;

  :deep(.el-icon) {
    z-index: 1;
    color: var(--el-text-color-primary);
  }

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

:deep(.el-dialog) {
  max-height: 100vh;
}
</style>