<script setup lang="ts">

import {ElButton, ElDialog, ElRadio, ElRadioGroup, ElScrollbar} from "element-plus";
import {CaretLeft, CaretRight, Delete} from "@element-plus/icons-vue";
import {ref, shallowRef} from "vue";
import {useStore} from "../stores";

const props = defineProps({
  student: Object,
})

const eventDate = ref<Date | undefined>();
const isAddEvent = ref(false);
const currentDate = ref(new Date());
const events = shallowRef(['Н', '1', '2', '3', '4', '5']);
const currentEvent = shallowRef('Н')
const emit = defineEmits(['addEvent']);
const store = useStore();

const makeDate = (month: number, year: number, day: number) => {
  return new Date(`${year}-${month}-${day}`)
}

const daysInMonth =  (month: number, year: number) => {
  return new Date(year, month, 0).getDate();
}

const dayName =  (month: number, year: number, day: number) => {
  return makeDate(month, year, day).toLocaleDateString('default', { weekday: 'short' });
}

const nextMonth = () => {
  const currentMonth = currentDate.value.getMonth();
  const currentYear = currentDate.value.getFullYear();


  const nextMonth = (currentMonth + 1) > 11 ? 0 : currentMonth + 1;
  const nextYear = (currentMonth + 1) > 11 ? currentYear + 1 : currentYear;

  currentDate.value = new Date(nextYear, nextMonth)
}

const prevMonth = () => {
  const currentMonth = currentDate.value.getMonth();
  const currentYear = currentDate.value.getFullYear();
  const prevMonth = (currentMonth - 1) < 0 ? 11 : currentMonth - 1;
  const prevYear = (currentMonth - 1) < 0 ? currentYear - 1 : currentYear;

  currentDate.value = new Date(prevYear, prevMonth)
}

const isToday = (day: number) => {
  return new Date().toLocaleDateString() == makeDate(currentDate.value.getMonth() + 1, currentDate.value.getFullYear(), day).toLocaleDateString()
}

const openEvents = (date: Date) => {
  eventDate.value = date;
  isAddEvent.value = true;
}

const closeEvent = () => {
  isAddEvent.value = false;
  eventDate.value = undefined;
}

const addEvent = () => {
  const date = eventDate.value?.toLocaleDateString();
  const est = currentEvent.value;

  emit('addEvent', {date, est})

  currentEvent.value = 'Н';
  eventDate.value = undefined;
  closeEvent();
}

const removeEvent = (key: number) => {
  if (!eventDate.value) return;

  props.student?.attendance[eventDate.value.toLocaleDateString()].splice(key, 1);
  store.syncGroup();
}
</script>

<template>
  <div class="calendar">
    <div class="ym-control">
      <el-button :icon="CaretLeft" size="small" circle plain type="info" @click="prevMonth"/>

      <div class="y-m" @dblclick="currentDate = new Date()">
        <div class="month">{{currentDate.toLocaleString('default', { month: 'long' })}}</div>
        <div class="year ms-2">{{currentDate.getFullYear()}}</div>
      </div>


      <el-button :icon="CaretRight" size="small" circle plain type="info" @click="nextMonth"/>
    </div>

    <el-scrollbar>
      <div  class="days">
        <div v-for="day in daysInMonth(currentDate.getMonth() + 1, currentDate.getFullYear())"
             class="day"
             :class="{today: isToday(day)}"
             @click="isToday(day) ? openEvents(makeDate(currentDate.getMonth() + 1, currentDate.getFullYear(), day)) : false"
             @dblclick="openEvents(makeDate(currentDate.getMonth() + 1, currentDate.getFullYear(), day))"
        >
          <div class="day-name">
            {{day}} <span>{{dayName(currentDate.getMonth() + 1, currentDate.getFullYear(), day)}}</span>
          </div>

          <div class="event">
            <div v-for="est in student?.attendance[makeDate(currentDate.getMonth() + 1, currentDate.getFullYear(), day).toLocaleDateString()]"
                 class="est" :class="{red: est == 'Н'}"
            >{{est}}</div>
          </div>
        </div>
      </div>
    </el-scrollbar>

    <el-dialog v-model="isAddEvent" :title="eventDate?.toLocaleDateString('default', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })" destroy-on-close center :close-on-click-modal="false" :class="{today: currentDate.toLocaleDateString() == eventDate?.toLocaleDateString()}"
    >
      <div v-if="eventDate">
        <div>
          <div v-for="(est, key) in student?.attendance[eventDate.toLocaleDateString()]" class="estimate">
            <div>{{ est }}</div>
            <el-button @click="removeEvent(key)" :icon="Delete" text type="danger"/>
          </div>
        </div>



        <div class="d-flex flex-column justify-content-center align-items-center mt-4">
          <el-radio-group v-model="currentEvent" class="d-flex align-items-center">
            <el-radio v-for="(est, k) in events" :value="est" size="large"
                      class="d-flex flex-column justify-content-center align-items-center"
                      :class="!k ? 'me-5' : 'me-3'"
            >{{est}}</el-radio>
          </el-radio-group>
        </div>

      </div>
      <template #footer>
        <div class="dialog-footer mt-5">
          <el-button @click="closeEvent">Закрыть</el-button>
          <el-button type="primary" @click="addEvent">Добавить оценку</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.estimate {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 50px;
}

.event {
  display: flex;
  align-items: center;
  flex-direction: column;
  min-height: 10px;
  .est {
    width: 100%;
    text-align: center;
  }

  .red {
    background-color: var(--el-color-error);
  }
}

:deep(.today) {
  background-color: var(--el-color-primary-light-8);;
}

.day-name {
  white-space: nowrap;
  font-weight: 600;
  padding: 0 5px;
  span {
    opacity: 0.7;
    font-weight: 500;
  }
}

.ym-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 5px 0 10px;
}

.y-m {
  display: flex;
  align-items: center;
  justify-content: center;
}

.days {
  display: flex;
  padding-bottom: 15px;
}

.day {
  &:not(:last-child) {
    border-right: 1px solid var(--el-color-info-light-3);
  }

  &.today {
    background-color: var(--el-color-primary-light-8);
  }
}

.year {
  display: flex;
  justify-content: center;
  align-items: center;
}

.month {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>