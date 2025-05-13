import { db } from "./db";

export const useDb = () => {
    const checkValueExist=async()=>{

    }
  const saveTranslateDb = async () => {
    try {
        console.log("saveTranslateDb")
      // Add the new friend!
      const id="module name" + Date.now()
    const response = await db.translate.add({
      module: id,
      vie: "",
      jap: "",
      eng: "",
      thai: "",
      cn: "",
      create_at: new Date().toISOString(),
    });
      console.log({response})
      return id
    } catch (error) {
      console.error("saveTranslateDb",error);
    }
  };
  const getDetail=async (_id:string)=>{
    const res = await db.translate.where('module').equals(_id).first()
    console.log("getDetail",res)
    return res

  }
  const getDataList = async () => {
    const res = await db.translate.toArray();
    console.log({res})
    return res.map(item=>({
        label:`${item.module} | ${new Date(item.create_at).toLocaleString()}`,
        value:item.module
    }))
  };
  return { saveTranslateDb, getDataList , getDetail};
};
