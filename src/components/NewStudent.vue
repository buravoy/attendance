<script setup lang="ts">
import {ref, shallowRef} from "vue";
import {ElButton, ElDialog, ElDrawer, ElInput, ElMessage, ElScrollbar} from "element-plus";
import {useStore} from "../stores";
import {Plus} from "@element-plus/icons-vue";

const store = useStore();
const inputRef = ref();
const isShow = shallowRef(false);
const dialogVisible = ref(false);
const fileArray = ref<string[][]>();

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
}

const openImport = () => {
  isShow.value = false;
  dialogVisible.value = true;
  fileArray.value = [];
}

const openFileInBrowser = (accept: string | null): Promise<string | null > => new Promise((resolve) => {
  const link = document.createElement("input");
  link.type = 'file';
  link.accept = accept ?? '*.*';
  link.onchange = async (event) => {
    if (event.target != null) {
      const target = (event.target as HTMLInputElement);
      const file = target.files?.item(0)
      const text = await file?.text();
      if (text) resolve(text);
      else resolve(null);

    }
    resolve(null);
  }

  link.click();
})


function CSVToArray( strData: string, strDelimiter: string ){
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

const openFile = async () => {
  const file: string | null = await openFileInBrowser('.csv');

  if (!file) {
    return ElMessage({
      message: `Файл не поддерживается`,
      type: 'error',
      showClose: true,
    });
  }

  fileArray.value = CSVToArray(file, ';');
}

</script>

<template>
  <el-button size="large" :icon="Plus" @click="isShow = true" plain circle class="add-student"/>

  <el-drawer v-model="isShow" size="100%" @opened="onOpen">
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
        <el-button type="primary" size="large" @click="openImport">Импорт</el-button>
      </div>
    </template>
  </el-drawer>

  <el-dialog v-model="dialogVisible" title="Импорт">
    <p class="my-3 text-center">Импорт списка студентов из *.csv файла</p>

    <el-scrollbar v-if="fileArray?.length" class="table-preview">
      <table>
        <tbody>
          <tr v-for="row in fileArray">
            <th v-for="cell in row">{{ cell }}</th>
          </tr>
        </tbody>
      </table>
    </el-scrollbar>



    <div class="text-center">
      <el-button type="primary" size="large" @click="openFile">Выбрать файл</el-button>
    </div>


    <template #footer>
      <div class="dialog-footer mt-5 text-center">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>

</template>

<style scoped lang="scss">
.table-preview {
  height: 200px;

  table {
    min-width: 100%;
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