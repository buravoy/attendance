<script setup lang="ts">
import {ref, shallowRef} from "vue";
import {ElButton, ElColorPicker, ElDrawer, ElInput, ElMessage} from "element-plus";
import {useStore} from "../stores";
import {Plus} from "@element-plus/icons-vue";
import {isMobile} from "../helpers.ts";

const store = useStore();
const inputRef = ref();
const isShow = shallowRef(false);
const editId = shallowRef<string | undefined>(undefined);
const groupColor = shallowRef<string | undefined>(store.dark ? '#E1E1E1' : '#2c2d2e');

const groupName = shallowRef('')
const groupDescription = shallowRef('')

const addNew = async () => {
  await store.addGroup({
    meta: {
      name: groupName.value,
      desc: groupDescription.value,
      color: groupColor.value,
    },
    students: [],
  })

  groupName.value = '';
  groupDescription.value = '';
  groupColor.value = store.dark ? '#E1E1E1' : '#2c2d2e';

  ElMessage({
    message: `Создана группа ${groupName.value}`,
    type: 'success',
    showClose: true,
  });

  isShow.value = false;
}

const onClose = () => {
  store.isStart = true;

  if (editId.value) {
    groupName.value = '';
    groupDescription.value = '';
    groupColor.value = store.dark ? '#E1E1E1' : '#2c2d2e';
    editId.value = undefined;
  }
}



const onOpen = () => {
  setTimeout(inputRef.value?.focus, 200);

  store.isStart = false;

  store.backHandler(() => {
    isShow.value = false;
  })
}

const openForEdit = (id: string) => {
  editId.value = id;
  const group = store.groups[id];
  groupName.value = group.meta.name;
  groupDescription.value = group.meta.decs;
  groupColor.value = group.meta.color;
  isShow.value = true;
}

const saveOnEdit = () => {
  Object.assign(store.groups[editId.value!].meta, {
    name: groupName.value,
    desc: groupDescription.value,
    color: groupColor.value,
  })

  store.syncGroup(editId.value);

  editId.value = undefined;
  groupName.value = '';
  groupDescription.value = '';
  groupColor.value = '#2c2d2e';
  isShow.value = false;
}

defineExpose({
  openForEdit
})
</script>

<template>
  <div>
    <div class="header-btn" @click="isShow = true">
      <el-button size="large" class="" :icon="Plus"  plain circle />
    </div>


    <el-drawer v-model="isShow" :size="isMobile() ? '100%' : '800px'"
               @open="editId ? false : groupColor = store.dark ? '#E1E1E1' : '#2c2d2e'"
               @opened="onOpen" @closed="onClose">
      <template #header>
        <h4 v-if="!editId">Добавление группы</h4>
        <h4 v-if="editId">Редактирование группы</h4>
      </template>
      <template #default>
        <div class="item mb-5">
          <label>Наименование</label>
          <div class="d-flex align-items-center justify-content-start">
            <el-input ref="inputRef" v-model="groupName" class="me-2" placeholder="Новая группа" size="large" @input="val => groupName = val"/>
            <el-color-picker v-model="groupColor"
                             size="large"
                             @activeChange="(val) => groupColor = val!"
                             :predefine="[ store.dark ? '#E1E1E1' : '#2c2d2e', '#409eff', '#6f42c1', '#d63384', '#67c23a', '#fd7e14', '#ffc107', '#20c997', '#0dcaf0']"
            />
          </div>
        </div>

        <div class="item">
          <label>Примечание</label>
          <div class="d-flex align-items-center justify-content-start">
            <el-input v-model="groupDescription" type="textarea" :autosize="{minRows: 3, maxRows: 5}" size="large" @input="val => groupDescription = val"/>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="text-center">
          <el-button v-if="!editId" type="primary" size="large" :disabled="groupName.length < 3" @click="addNew">Добавить</el-button>
          <el-button v-if="editId" type="primary" size="large" :disabled="groupName.length < 3" @click="saveOnEdit">Сохранить</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">
.item {
  label {
    display: block;
    font-size: 14px;
    margin-bottom: 5px;
  }
}
</style>