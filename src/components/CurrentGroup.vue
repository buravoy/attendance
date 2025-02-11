<script setup lang="ts">
import {useStore} from "../stores";
import {ref} from "vue";
import {ElCollapse, ElCollapseItem, ElMessage} from "element-plus";
import Calendar from "./Calendar.vue";

const store = useStore();
const activeNames = ref([])

const studentTitle = (student: any) => {
  return `${student.surname} ${student.name ? student.name[0] + '.' : ''} ${student.patroname ? student.patroname[0] + '.' : ''}`
}

const addEstToStudent = (key: number, data: any) => {
  const {date, est} = data;

  if (store.currentGroup?.students[key]?.attendance[date]) {
    store.currentGroup?.students[key]?.attendance[date].push(est);
  } else {
    store.currentGroup.students[key].attendance[date] = [];
    store.currentGroup?.students[key]?.attendance[date].push(est);
  }

  store.syncGroup();

  ElMessage({
    message: `${date}\nСтуденту ${studentTitle(store.currentGroup?.students[key])} поставлено ${est}`,
    type: 'success',
    showClose: true,
  });
}
</script>

<template>
  <div class="p-3">
    <el-collapse v-if="store.currentGroup?.students.length" v-model="activeNames" accordion>
      <el-collapse-item v-for="(student, key) in store.currentGroup?.students" :title="studentTitle(student)" :name="key">
        <Calendar :student="student" @addEvent="(data) => addEstToStudent(key, data)"/>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-collapse-item) {
  .el-collapse-item__header {
    padding: 0 10px;
    border-bottom: none;
    text-transform: capitalize;
  }

  .el-collapse-item__content {
    padding: 0 10px 5px;
  }

  &:nth-child(odd) {
    background-color: var(--el-color-info-light-7);
  }
  &:nth-child(even) {
    background-color: var(--el-color-info-light-9);
  }
}
</style>