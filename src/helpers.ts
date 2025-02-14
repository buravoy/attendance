import {Buffer} from "buffer";

export const openFileInBrowser = (accept: string | null): Promise<string | null > => new Promise((resolve) => {
  const link = document.createElement("input");
  link.type = 'file';
  link.accept = accept ?? '*.*';
  link.onchange = async (event) => {
    if (event.target != null) {
      const target = (event.target as HTMLInputElement);
      const file = target.files?.item(0)
      const text = await file?.text();
      if (text) resolve(text);
      else resolve(null);

    }
    resolve(null);
  }

  link.click();
})

export const merge = (a: any, b: any, predicate = (a: any, b: any) => a === b) => {
  const c = [...a]; // copy to avoid side effects
  // add all items from B to copy C if they're not already present
  b.forEach((bItem: any) => (c.some((cItem) => predicate(bItem, cItem)) ? null : c.push(bItem)))
  return c;
}

export const getColorByBgColor = (bgColor: string) => {
  if (!bgColor) { return ''; }
  return (parseInt(bgColor.replace('#', ''), 16) > 0xffffff / 2) ? '#000' : '#fff';
}

export function jsonToBase64(object: any) {
  const json = JSON.stringify(object);
  return Buffer.from(json).toString("base64");
}

export function base64ToJson(base64String: string) {
  const json = Buffer.from(base64String, "base64").toString();
  return JSON.parse(json);
}