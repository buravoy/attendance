<script setup lang="ts">
import {useStore} from "../stores";
import {onMounted, ref} from "vue";
import {type CollapseModelValue, ElButton, ElCollapse, ElCollapseItem, ElMessage, ElPopconfirm} from "element-plus";
import Calendar from "./Calendar.vue";
import {Delete} from "@element-plus/icons-vue";

const store = useStore();
const activeName = ref<string>()
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

const initCalendar = (id: CollapseModelValue) => {
  if (typeof id != 'number') return;
  renderKeys.value[id]++;
}

const studentAttendance = (attendance: any) => {
  let html = '';
  let count = 0;

  const sortedAttendance = Object.keys(attendance).sort((a: string, b: string) => {
    const _a = a.split('.');
    const _b = a.split('.');

    return new Date().getTime() - new Date(a).getTime()
  });

  console.log(sortedAttendance)

  for (const date in attendance) {
    for (const i in attendance[date]) {
      html += `<span class="${attendance[date][i] == 'Н' ? 'red' : ''}">${attendance[date][i]}</span>`;
      count++
      if (count >= 5) break;
    }
    if (count >= 5) break;
  }
  return html
}

const removeStudent = (key: number) => {
  store.currentGroup?.students.splice(key, 1);
  store.syncGroup();
}

onMounted(() => {
  renderKeys.value = store.currentGroup?.students.map(() => 0);
})
</script>

<template>
  <div class="p-3">
    <el-collapse v-if="store.currentGroup?.students.length" v-model="activeName" accordion @change="initCalendar" >
      <el-collapse-item v-for="(student, key) in store.currentGroup?.students" :name="key" >
        <template #title>
          <span>{{activeName == key.toString() ? `${student.surname} ${student.name} ${student.patroname}` : studentTitle(student)}}</span>
          <div class="d-inline-flex ms-auto me-2" v-html="studentAttendance(student.attendance)"/>
          <el-popconfirm width="220" :title="`Удалить ${studentTitle(student)} и все его данные?`" @confirm="removeStudent(key)" hide-icon>
            <template #reference>
              <el-button class="me-2" :icon="Delete" text type="danger" @click.stop circle/>
            </template>
            <template #actions="{ confirm, cancel }">
              <el-button size="small" @click="cancel">Нет</el-button>
              <el-button type="danger" size="small" @click="confirm">Удалить</el-button>
            </template>
          </el-popconfirm>
        </template>
        <template #default>
          <Calendar :student="student" @addEvent="(data) => addEstToStudent(key, data)" :renderKey="renderKeys[key]"/>
        </template>
      </el-collapse-item>
    </el-collapse>
    <div v-else class="text-center p-5">В группе нет студентов</div>
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
      width: 100%;

      .el-collapse-item__arrow {
        margin: 0;
      }
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