import {defineStore} from 'pinia';
import {IndexDb} from "./indexDb.ts";
import {toRaw} from "vue";

const idb = new IndexDb('attendance', 'groups');
const keys: string[] = await idb.keys();
const order = await idb.get('_order');
const groups: { [key: string]: any } = {};

if (order) {
  const i = keys.findIndex(k => k == '_order');
  if (i >= 0) keys.splice(i, 1);
}

for (const k of keys) {
  groups[k] = await idb.get(k);
}

export const useStore = defineStore('Store', {
  state: () => ({
    keys: keys,
    groups: groups,
    order: order ?? keys,
    title: "Группы",
  }),

  actions: {
    async changeOrder() {
      await idb.set('_order', toRaw(this.order));
    },

    async addGroup(data: any) {
      const groupId = Date.now().toString(16);
      this.groups[groupId] = data;
      this.order.push(groupId);
      await this.changeOrder();
      await idb.set(groupId, data);
    },
  },
})