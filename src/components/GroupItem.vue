<script setup lang="ts">
import {Delete, Edit, MoreFilled} from "@element-plus/icons-vue";
import {ElButton, ElDialog, ElDropdown, ElDropdownItem, ElDropdownMenu} from "element-plus";
import {ref} from "vue";

defineProps({
  data: Object,
})

const centerDialogVisible = ref(false)

</script>

<template>
  <div class="group-item mx-3" :class="{bordered: !data?.meta?.color}" :style="{backgroundColor: data?.meta?.color}">

    <div class="group-info">
      <p class="title">{{data?.meta?.name}}</p>
      <p class="desc mb-1">{{data?.meta?.desc}}</p>
      <p class="count"><span class="count-desc me-1">Студентов в группе:</span> <b>{{data?.students?.length}}</b></p>
    </div>

    <el-dropdown placement="top-start" class="ms-auto" trigger="click">
      <div class="group-control">
        <MoreFilled class="icon" size="24"/>
      </div>

      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :icon="Edit">Редактировать</el-dropdown-item>
          <el-dropdown-item @click="centerDialogVisible = true" :icon="Delete" divided style="color: var(--el-color-error)">Удалить группу</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

      <el-dialog v-model="centerDialogVisible" title="Внимание" destroy-on-close center>
        <div>Удалить группу <strong>{{data?.meta?.name}}</strong> со всеми студентами?</div>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="centerDialogVisible = false">Отмена</el-button>
            <el-button type="danger" @click="centerDialogVisible = false">Удалить</el-button>
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

  &.sortable-chosen:not(.sortable-ghost) {
    filter: brightness(1.2);
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
  background: rgba(0, 0, 0, 0.5);
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