<script setup lang="ts">
import {useStore} from "../stores";
import {onMounted, ref} from "vue";
import {type CollapseModelValue, ElCollapse, ElCollapseItem, ElMessage} from "element-plus";
import Calendar from "./Calendar.vue";

const store = useStore();
const activeNames = ref([])
const renderKeys = ref<number[]>([]);

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

onMounted(() => {
  renderKeys.value = store.currentGroup?.students.map(() => 0);
})

const test = (id: CollapseModelValue) => {
  if (typeof id != 'number') return;
  if (renderKeys.value[id] == 0) renderKeys.value[id]++;
}
</script>

<template>
  <div class="p-3">
    <el-collapse v-if="store.currentGroup?.students.length" v-model="activeNames" accordion @change="test" >
      <el-collapse-item v-for="(student, key) in store.currentGroup?.students" :title="studentTitle(student)" :name="key" >
        <Calendar :student="student" @addEvent="(data) => addEstToStudent(key, data)" :key="renderKeys[key]"/>
      </el-collapse-item>
    </el-collapse>
    <div v-else class="text-center p-5">
      В группе нет студентов
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-collapse) {
  border-bottom: none;
  border-top: none;
  border-radius: 4px;
  overflow: hidden;

  .el-collapse-item {
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
}
</style>