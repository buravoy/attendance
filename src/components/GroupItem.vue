<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useStore} from "../stores";
import {DCaret, MoreFilled} from "@element-plus/icons-vue";
import {ElButton} from "element-plus";

const props = defineProps({
  data: Object,
})

// const data = ref();
const store = useStore();

onMounted(async () => {
  // data.value = await store.iDb.get(props.id);
})
</script>

<template>
  <div class="group-item mx-3">

    <div class="group-info">
      {{data}}

      <p class="title">{{data?.meta?.name}}</p>
      <p class="desc">{{data?.meta?.desc}}</p>
      <p>{{data?.students?.length}}</p>
    </div>

    <div class="group-control">
      <el-button :icon="MoreFilled" circle />



    </div>
  </div>


</template>

<style scoped lang="scss">
.group-item {
  display: flex;
  border: 1px solid;
  border-radius: 4px;
  margin: 5px 20px;
}

.group-control {
  display: flex;
  flex-direction: column;
  margin-left: auto;
}

.icon {
  width: 1em;
  height: 1em;
  margin-right: 8px
}
</style>