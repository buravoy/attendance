<script setup lang="ts">
import {shallowRef} from "vue";
import {ElButton, ElColorPicker, ElDrawer, ElInput, ElMessage} from "element-plus";
import {useStore} from "../stores";
import {Plus} from "@element-plus/icons-vue";

const store = useStore();

const isShow = shallowRef(false);
const groupColor = shallowRef('#1d1e1f');

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
  groupColor.value = '#1d1e1f';

  ElMessage({
    message: `Создана группа ${groupName.value}`,
    type: 'success',
    showClose: true,
  });

  isShow.value = false;
}

</script>

<template>
  <el-button type="primary" size="large" :icon="Plus" @click="isShow = true" class="ms-auto" plain circle/>

  <el-drawer v-model="isShow" size="100%">
    <template #header>
      <h4>Добавление группы</h4>
    </template>
    <template #default>
      <div class="item mb-5">
        <label>Наименование</label>
        <div class="d-flex align-items-center justify-content-start">
          <el-input v-model="groupName" class="me-2" placeholder="Новая группа" size="large"/>
          <el-color-picker v-model="groupColor" size="large" :predefine="['#409eff', '#6610f2', '#d63384']" />
        </div>
      </div>

      <div class="item">
        <label>Примечание</label>
        <div class="d-flex align-items-center justify-content-start">
          <el-input v-model="groupDescription" type="textarea" :autosize="{minRows: 3, maxRows: 9}" size="large"/>
        </div>
      </div>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button type="primary" size="large" :disabled="groupName.length < 3" @click="addNew">Добавить</el-button>
      </div>
    </template>
  </el-drawer>

</template>

<style scoped lang="scss">
.add-new {
  //width: 100%;
}

.item {
  label {
    display: block;
    font-size: 14px;
    margin-bottom: 5px;
  }
}
</style>