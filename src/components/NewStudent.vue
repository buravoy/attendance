<script setup lang="ts">
import {ref, shallowRef} from "vue";
import {ElButton, ElDrawer, ElInput, ElMessage} from "element-plus";
import {useStore} from "../stores";
import {Plus} from "@element-plus/icons-vue";

const store = useStore();
const inputRef = ref();
const isShow = shallowRef(false);

const studentName = shallowRef('')
const studentSurname = shallowRef('')
const studentPatroname = shallowRef('')

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
        <el-button type="primary" size="large">Импорт</el-button>
        <el-button type="primary" size="large" @click="addStudent" :disabled="!studentSurname.length">Добавить студента</el-button>
      </div>
    </template>
  </el-drawer>

</template>

<style scoped lang="scss">
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
</style>