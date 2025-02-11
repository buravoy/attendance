<script setup lang="ts">
import {useStore} from "../stores";
import {ref} from "vue";
import {ElCollapse, ElCollapseItem} from "element-plus";

const store = useStore();
const activeNames = ref([])

const studentTitle = (student: any) => {
  return `${student.surname} ${student.name ? student.name[0] + '.' : ''} ${student.patroname ? student.patroname[0] + '.' : ''}`
}
</script>

<template>
  <div class="p-3">
    <el-collapse v-if="store.currentGroup?.students.length" v-model="activeNames" >
      <el-collapse-item v-for="(student, key) in store.currentGroup?.students" :title="studentTitle(student)" :name="key">
        <div>
          Consistent with real life: in line with the process and logic of real
          life, and comply with languages and habits that the users are used to;
        </div>
        <div>
          Consistent within interface: all elements should be consistent, such
          as: design style, icons and texts, position of elements, etc.
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-collapse-item) {
  .el-collapse-item__header {
    padding: 0 10px;
    border-bottom: none;
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