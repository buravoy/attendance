import {openDB} from 'idb';

class IndexDb {
  // private key: string;
  private readonly name: string;
  private dbPromise: Promise<any>;

  constructor(key: string, name: string) {
    // this.key = key;
    this.name = name;
    this.dbPromise = openDB(key, 1, {
      upgrade: (db) => db.createObjectStore(name),
    });
  }

  async get(key: string) {
    return (await this.dbPromise).get(this.name, key);
  }

  async set(key: string, value: any) {
    return (await this.dbPromise).put(this.name, value, key);
  }

  async del(key: string) {
    return (await this.dbPromise).delete(this.name, key);
  }

  async keys(): Promise<string[]> {
    return (await this.dbPromise).getAllKeys(this.name);
  }
}

export {IndexDb}