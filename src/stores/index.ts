import {defineStore} from 'pinia';
import {IndexDb} from "./indexDb.ts";
import {toRaw} from "vue";
import {ElMessage} from "element-plus";

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
    title: 'Группы',
    desc: '',
    currentGroup: <any>undefined,
    currentID: <any>undefined,
    backCb: <Function | undefined>undefined,
    scroll: <number>0,
    scrollRef: <any>undefined,
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


    async deleteGroup(id: string) {


      const name = this.groups[id].meta?.name

      console.log(name);
      // return

      const io = this.order.findIndex((k: string) => k == id);
      if (io >= 0) this.order.splice(io, 1);
      else return;

      const ik = this.keys.findIndex((k: string) => k == id);
      if (ik >= 0) this.keys.splice(ik, 1);
      else return;

      delete this.groups[id];
      await idb.del(id);
      await this.changeOrder();

      ElMessage({
        message: `Группа ${name} удалена`,
        type: 'warning',
        showClose: true,
      });
    },

    openGroup(id: string) {
      this.currentGroup = this.groups[id];
      this.currentID = id;
      this.title = this.groups[id].meta.name;
      this.desc = this.groups[id].meta.desc;
      this.backCb = () => {
        this.currentGroup = undefined;
        this.currentID = undefined;
        this.title = 'Группы';
        this.desc = '';
        this.backCb = undefined;
      }
    },

    async syncGroup() {
      const data = toRaw(this.groups[this.currentID]);
      await idb.set(this.currentID, data);
    }
  },
})