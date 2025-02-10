import {defineStore} from 'pinia';
import {IndexDb} from "./indexDb.ts";
import {toRaw} from "vue";

const idb = new IndexDb('attendance', 'groups');

const keys = await idb.keys();
const groups = await Promise.all(keys.map(async k => await idb.get(k)));

// const groups = keys.map(async (k) => {
//   console.log(k)
//   return await idb.get(k);
// })

export const useStore = defineStore('Store', {
  state: () => ({
    iDb: idb,
    groups: groups,
    title: "Extn",
  }),

  actions: {
    async refresh() {


      for (const g of this.groups) {
        console.log(g.key, toRaw(g))
        await idb.del(g.key);
      }

      setTimeout(async () => {
        for (const g of this.groups) {
          await idb.set(g.key, toRaw(g));
        }
      }, 10000)



    }
  },
})