<script setup lang="ts">
import {Delete, Edit, MoreFilled} from "@element-plus/icons-vue";
import {ElButton, ElDialog, ElDropdown, ElDropdownItem, ElDropdownMenu} from "element-plus";
import {ref} from "vue";
import {getColorByBgColor} from "../helpers.ts";

const emit = defineEmits(['open', 'remove', 'edit']);

defineProps({
  data: Object,
})

const centerDialogVisible = ref(false)

const deleteGroup = () => {
  centerDialogVisible.value = false;
  emit('remove');
}
</script>

<template>
  <div>
    <div class="group-item mx-3" :class="{bordered: !data?.meta?.color}"
         :style="{backgroundColor: data?.meta?.color, color: getColorByBgColor(data?.meta?.color)}">

      <div class="group-info" @click="emit('open')">
        <p class="title">{{data?.meta?.name}}</p>
        <p class="desc mb-1">{{data?.meta?.desc}}</p>
        <p class="count"><span class="count-desc me-1">Студентов в группе:</span> <b>{{data?.students?.length}}</b></p>
      </div>

      <el-dropdown placement="top-start" class="ms-auto" trigger="click">
        <div class="group-control" :style="{color: getColorByBgColor(data?.meta?.color)}">
          <MoreFilled class="icon" size="24"/>
        </div>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="emit('edit')" :icon="Edit">Редактировать</el-dropdown-item>
            <el-dropdown-item @click="centerDialogVisible = true" :icon="Delete" divided style="color: var(--el-color-error)">Удалить группу</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>


    </div>

    <el-dialog v-model="centerDialogVisible" title="Внимание" destroy-on-close center style="max-width: 300px">
      <div class="text-center" style="line-height: 28px">Удалить группу <strong>{{data?.meta?.name}}</strong> со всеми студентами?</div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="centerDialogVisible = false">Отмена</el-button>
          <el-button type="danger" @click="deleteGroup">Удалить</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.group-item {
  display: flex;
  border-radius: 4px;
  margin: 15px 20px 15px;
  overflow: hidden;
  border: 1px solid transparent;
  user-select: none;

  &:hover {
    cursor: pointer;
    filter: brightness(.9);
  }

  &.sortable-chosen:not(.sortable-ghost) {
    filter: brightness(1.2);
    cursor: grab;
  }

  &.sortable-chosen.sortable-ghost {
    filter: brightness(0.5);
  }

  &.bordered {
    border-color: var(--el-color-info-light-8);
    background-color: var(--el-color-info-light-8);
  }
}

.group-control {
  display: flex;
  flex-direction: column;
  color: white;
  width: 50px;
  background: var(--el-mask-color-extra-light);
  position: relative;
  align-items: center;
  justify-content: center;

  &:before {
    position: absolute;
    content: '';
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
  }
}

.icon {
  width: 20px;
  height: 20px;
  z-index: 1;
}

.group-info {
  padding: 5px;
  max-width: calc(100% - 50px);
  width: calc(100% - 50px);
}

.title {
  font-weight: 600;
  word-break: break-word;
}

.desc {
  opacity: .7;
  font-size: 14px;
  word-break: break-word;
}

.count {
  font-size: 14px;
}

.count-desc {
  opacity: .7;
}
</style>