import { db } from "./db";

export const useDb = () => {
  

  const updateTranslateDb = async (value: string, name?: string) => {
    try {
      // Add the new friend!
      const id = name ?? "backup" + Date.now();
      const response = await db.translate.update(id, {
        vie: "",
        jap: "",
        eng: "",
        thai: "",
        cn: "",
        data: value,
        create_at: new Date().toISOString(),
      });
      return id;
    } catch (error) {
      console.error("saveTranslateDb", error);
    }
  };
  const saveTranslateDb = async (value: string, name?: string) => {
    try {
      // Add the new friend!
      const id = name ?? "backup" + Date.now();
      const response = await db.translate.add({
        module: id,
        vie: "",
        jap: "",
        eng: "",
        thai: "",
        cn: "",
        data: value,
        create_at: new Date().toISOString(),
      });
      return id;
    } catch (error) {
      console.error("saveTranslateDb", error);
      updateTranslateDb(value, name);
    }
  };
  const getDetail = async (_id: string) => {
    const res = await db.translate.where("module").equals(_id).first();
    return res;
  };
  const getDataList = async () => {
    const res = await db.translate.toArray();
    return res.map((item) => ({
      label: `${item.module} | ${new Date(item.create_at).toLocaleString()}`,
      value: item.module,
    }));
  };
  return { saveTranslateDb, getDataList, getDetail };
};
