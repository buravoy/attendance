<script setup lang="ts">
import {useStore} from "../stores";
import {onMounted, type Ref, ref, watch} from "vue";
import {type CollapseModelValue, ElButton, ElCollapse, ElCollapseItem, ElMessage, ElPopconfirm} from "element-plus";
import Calendar from "./Calendar.vue";
import {Delete} from "@element-plus/icons-vue";

const store = useStore();
const activeName = ref<string | string[]>(store.multiCollapse ? '' : [])
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
  switch (typeof id) {
    case "number": return renderKeys.value[id]++;
    case "object": return id.forEach((i: number | string) => renderKeys.value[i as number]++);
  }
}

const studentAttendance = (attendance: any) => {
  let html = [];
  let count = 0;

  const sortedAttendance = Object.keys(attendance).sort((a: string, b: string) => {
    const _a = a.split('.');
    const _b = b.split('.');
    return new Date(+_a[2], +_a[1] - 1, +_a[0]).getTime() - new Date(+_b[2], +_b[1] - 1, +_b[0]).getTime()
  });

  for (const date of sortedAttendance) {
    for (const i in attendance[date]) {
      html.push(`<span class="att-prev ${attendance[date][i] == 'Н' ? 'red' : ''}">${attendance[date][i]}</span>`);
      count++
      if (count >= 5) break;
    }
    if (count >= 5) break;
  }
  return html.join('')
}

const removeStudent = (key: number) => {
  store.currentGroup?.students.splice(key, 1);
  store.syncGroup();
}

const syncScroll = (e: any) => {
  if (!store.calendarSync) return;

  renderKeys.value.forEach((_, i) => {
    const target = document.getElementsByClassName('scrollRef' + i)[0];

    store.syncScroll = e.scrollLeft;

    target?.scrollTo({
      left: store.syncScroll,
    })
  })
}

watch(() => store.currentGroup?.students, () => {
  renderKeys.value = store.currentGroup?.students.map((_: never, i: number) => (renderKeys.value[i] > 0) ? renderKeys.value[i] : 0);
}, { deep: true })

const refs = ref<Ref[]>([])

const setRef = (row: number) => {
  return refs.value[row] = ref()
}

const syncRefs = (direct: 'prev' | 'next' | 'today', key: number) => {
  if (!store.calendarSync) return;

  refs.value.forEach((ref, i) => {
    if (i == key) return ;

    switch (direct) {
      case "next": return ref.value[0].nextMonth();
      case "prev": return ref.value[0].prevMonth();
      case "today": return ref.value[0].goToToday();
    }
  })
}

onMounted(() => {
  renderKeys.value = store.currentGroup?.students.map(() => 0);
  store.backHandler(store.backCb!);
})
</script>

<template>
  <div class="p-3">
    <el-collapse v-if="store.currentGroup?.students.length" v-model="activeName" :accordion="store.multiCollapse" @change="initCalendar" >
      <el-collapse-item v-for="(student, key) in store.currentGroup?.students" :name="key" >
        <template #title>
          <span>{{student.surname}} {{student.name}} {{student.patroname}}</span>
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
          <Calendar :student="student"
                    @addEvent="(data) => addEstToStudent(key, data)"
                    @scroll="syncScroll"
                    @prev="syncRefs('prev', key)"
                    @next="syncRefs('next', key)"
                    @today="syncRefs('today', key)"
                    :renderKey="renderKeys[key]"
                    :id="key"
                    :ref="setRef(key)"
          />
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

      & span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 1px;
      }

      .att-prev {
        background-color: var(--el-color-info-light-3);
        height: 18px;
        min-width: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 3px;
        padding: 1px 4px;
        border-radius: 4px;
        line-height: 0;
        &.red {
          background-color: var(--el-color-error);
        }
      }

      .el-collapse-item__arrow {
        margin: 0;
      }
    }

    .el-collapse-item__content {
      padding: 0 10px 5px;
    }

    &:nth-child(odd) {
      --el-collapse-header-bg-color: var(--el-color-info-light-7);

      .el-collapse-item__header {
        &:hover {
          filter: brightness(0.9);
        }
      }
    }

    &:nth-child(even) {
      --el-collapse-header-bg-color: var(--el-color-info-light-9);

      .el-collapse-item__header {
        &:hover {
          filter: brightness(0.85);
        }
      }
    }
  }
}
</style>