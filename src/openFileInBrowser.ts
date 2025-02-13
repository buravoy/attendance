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

