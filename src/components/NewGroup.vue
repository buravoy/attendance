<script setup lang="ts">
import {shallowRef} from "vue";
import {ElButton, ElColorPicker, ElDrawer, ElInput, ElMessage} from "element-plus";
import {useStore} from "../stores";
import {Plus} from "@element-plus/icons-vue";

const store = useStore();

const isShow = shallowRef(false);
const groupColor = shallowRef('#2c2d2e');

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
  groupColor.value = '#2c2d2e';

  ElMessage({
    message: `Создана группа ${groupName.value}`,
    type: 'success',
    showClose: true,
  });

  isShow.value = false;
}

</script>

<template>
  <el-button type="primary" size="large" :icon="Plus" @click="isShow = true" plain circle />

  <el-drawer v-model="isShow" size="100%">
    <template #header>
      <h4>Добавление группы</h4>
    </template>
    <template #default>
      <div class="item mb-5">
        <label>Наименование</label>
        <div class="d-flex align-items-center justify-content-start">
          <el-input v-model="groupName" class="me-2" placeholder="Новая группа" size="large"/>
          <el-color-picker v-model="groupColor"
                           size="large"
                           :predefine="['#2c2d2e', '#409eff', '#6f42c1', '#d63384', '#67c23a', '#fd7e14', '#ffc107', '#20c997', '#0dcaf0']"
          />
        </div>
      </div>

      <div class="item">
        <label>Примечание</label>
        <div class="d-flex align-items-center justify-content-start">
          <el-input v-model="groupDescription" type="textarea" :autosize="{minRows: 3, maxRows: 5}" size="large"/>
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
.item {
  label {
    display: block;
    font-size: 14px;
    margin-bottom: 5px;
  }
}
</style>