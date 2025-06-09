import { defineStore } from "pinia";
import { ref } from "vue";
import type { UILogType } from "../types";
import { useDb } from "../plugins/useDB";
import { emptyData } from "../data";
export type RowData = Array<string | null | boolean>;
const useMainStore = defineStore("main", () => {
    
    const ignoreSmallerText = ref(true);
    const selectedOption = ref("");
    const backupname = ref("");
    const options = ref<Array<{ label: string; value: string }>>([]);
    const UILog = ref<Array<UILogType>>([]);
    const needUpdate = ref(false);
    const { getDataList, clearDB } = useDb();
    const translateData = ref<Array<RowData>>(emptyData);
    const getListDB = async () => {
        options.value = await getDataList();
    };
    const searchText = ref("");

    return {
        ignoreSmallerText,
        selectedOption,
        backupname,
        options,
        UILog,
        needUpdate,
        getListDB,
        translateData,
        clearDB,
        searchText,
    };
});
export default useMainStore;
