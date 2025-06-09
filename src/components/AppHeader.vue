<script setup lang="ts">
import { onMounted, ref } from "vue";
import PopupButton from "./PopupLogButton.vue";
import { useLoadingBar } from "naive-ui";
import useMainStore from "../stores/index";
import { storeToRefs } from "pinia";
import LogImporter from "./LogImporter.vue";
import TooltipWrapper from "./TooltipWrapper.vue";
import { DataBase, } from "@vicons/carbon";
import { tooltipTextHelper } from '../constants/index'
import SearchPlugin from "./SearchPlugin.vue";
import type { LanguageKeyType } from "../types";


const emit = defineEmits([
    "logError",
    "loadOldData",
    "clearData",
    "handleSaveData",
    "checkingUi",
    "convertToJson",
    "generateTestCase",
    "onShowSearch",
]);
const mainStore = useMainStore();
const {
    selectedOption,
    backupname,
    options,
    UILog,
    needUpdate,
    translateData,
    ignoreSmallerText
} = storeToRefs(mainStore);
const showModal = ref(false)
const handleUpdateValue = (value: string) => {
    selectedOption.value = value;
};
const loadOldData = () => {
    emit("loadOldData", selectedOption.value);
};
const clearData = () => {
    emit("clearData");
};
const handleSaveData = () => {
    emit("handleSaveData", backupname.value);
};
const loadJsonData = (json: any, parentKey?: string) => {
    const map = new Map();
    const keys: string[] = [];
    // Recursively convert nested objects to Maps

    Object.entries(json).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
            const { map: newMap, keys: newKeys } = loadJsonData(
                value,
                parentKey ? `${parentKey}.${key}` : key
            );
            newMap.forEach((v: string, k: string) => {
                map.set(k, v);
            });
            keys.push(...newKeys);
        } else {
            keys.push(`${parentKey}.${key}`);
            map.set(`${parentKey}.${key}`, value);
        }
    });
    return { map, keys };
};
const importShare = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = ".json"; // only accept JSON files
    input.onchange = async (event: Event) => {
        const files = (event.target as HTMLInputElement).files;
        if (!files) return;
        let result: any[] = [];
        const keyTotal: string[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            try {
                const text = await file.text();
                const json = JSON.parse(text);
                const { map, keys } = loadJsonData(json); // emit as object
                keyTotal.push(...keys);
                result.push({ fileName: file.name, map });
                // console.log("Parsed JSON:", map,keys);
            } catch (e) {
                emit("logError", e, i);
            }
        }
        const uniqueKeys = Array.from(new Set(keyTotal));
        const final = uniqueKeys
            .sort((a, b) => a.localeCompare(b))
            .map((key) => {
                const data = result.map((item) => {
                    return item.map.get(key) || null; // Get the value for the key or null if not found
                });
                return [key, ...data];
            });
        translateData.value = final;
        const csvRows = [];
        const header = ["Key", ...result.map((item) => item.fileName)];
        csvRows.push(header.join(","));
        final.forEach((row) => {
            csvRows.push(
                row
                    .map((cell) => {
                        if (
                            typeof cell === "string" &&
                            (cell.includes(",") ||
                                cell.includes('"') ||
                                cell.includes("\n"))
                        ) {
                            return `"${cell.replace(/"/g, '""')}"`;
                        }
                        return cell ?? "";
                    })
                    .join(",")
            );
        });
        const csvContent = csvRows.join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "imported_data.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    input.click();
};
const checkingUi = () => {
    emit("checkingUi");
};
const convertToJson = () => {
    emit("convertToJson");
};


const logError = (value: any, index: number) => {
    emit("logError", value, index);
};
const loadingBar = useLoadingBar();
const loadingBarTargetRef = ref<HTMLElement | null>(null);
defineExpose({
    loadingBarTargetRef,
    startLoading: loadingBar.start,
    finishLoading: loadingBar.finish,
});
onMounted(() => {
    loadingBar.start();
    mainStore.getListDB();
    setTimeout(() => {
        loadingBar.finish();
    }, 1000);
});
const props = defineProps<{ tableRef: any }>();
const searchResult = ref<any[]>([]);
const searchIndex = ref(0);
const nextSearch = () => {
    const nextIndex = searchIndex.value + 1;
    if (nextIndex >= searchResult.value.length) {
        searchIndex.value = 0; // wrap around to the first item
    } else {
        searchIndex.value = nextIndex;
    }
    const nextItem = searchResult.value[searchIndex.value]
    props.tableRef?.selectCell(nextItem.row, nextItem.col);
}
const prevSearch = () => {
    const prevIndex = searchIndex.value - 1;
    if (prevIndex < 0) {
        searchIndex.value = searchResult.value.length - 1; // wrap around to the last item
    } else {
        searchIndex.value = prevIndex;
    }
    const nextItem = searchResult.value[searchIndex.value]
    props.tableRef?.selectCell(nextItem.row, nextItem.col);
}
const clearSearch = () => {
    searchResult.value = [];
    searchIndex.value = 0;
    props.tableRef?.getPlugin('search').clear();
}
const onShowSearch = ({ language, keyword }: { language: LanguageKeyType, keyword: string }) => {
    // get the `Search` plugin's instance
    console.log("onShowSearch", language, keyword);
    if (!props.tableRef) {
        console.error("Table reference is not provided.");
        return;
    }
    const search = props.tableRef?.getPlugin('search');

    // use the `Search` plugin's `query()` method
    const queryResult = search.query(keyword);

    props.tableRef?.render();
    searchResult.value = queryResult;
}
const searchPluginRef = ref<InstanceType<typeof SearchPlugin> | null>(null);
</script>

<template>
    <n-loading-bar-provider :to="loadingBarTargetRef" container-style="position: absolute;">
        <div class="app-header" style="position: relative" ref="loadingBarTargetRef">
            <n-flex vertical>
                <div class="actions ">
                    <n-button-group>
                        <n-image src="/logo.png" style="height: 32px; width: 32px; margin:0 12px;"></n-image>

                        <n-select v-model:value="selectedOption" :options="options"
                            :on-update:value="handleUpdateValue">

                            <template #prefix>
                                <n-icon>
                                    <DataBase />
                                </n-icon>
                            </template>
                        </n-select>
                        <TooltipWrapper :content="tooltipTextHelper.open">
                            <n-button @click="loadOldData" default>Open</n-button>
                        </TooltipWrapper>
                        <TooltipWrapper :content="tooltipTextHelper.clear">
                            <n-button @click="clearData" type="warning">Clear table </n-button>
                        </TooltipWrapper>
                    </n-button-group>
                    <n-button-group>
                        <n-divider vertical />
                        <n-input v-model:value="backupname" type="text" placeholder="Nhập tên database" />
                        <TooltipWrapper :content="tooltipTextHelper.save">
                            <n-button @click="handleSaveData" default :disabled="backupname.length == 0">
                                Save DB
                            </n-button>
                        </TooltipWrapper>
                    </n-button-group>
                    <n-flex>


                    </n-flex>

                </div>
                <div class="actions ">
                    <SearchPlugin @onSearch="onShowSearch" :tableRef="props.tableRef" ref="searchPluginRef"
                        :ignoreSmallerText="ignoreSmallerText" @next="nextSearch" @prev="prevSearch"
                        @clear="clearSearch">
                        <n-label v-if="searchResult.length">
                            {{ searchIndex }} / {{ searchResult.length }} found</n-label>
                    </SearchPlugin>




                </div>
            </n-flex>
            <n-flex vertical align="flex-end">
                <n-flex>
                    <n-badge dot :show="needUpdate">
                        <n-button @click="convertToJson" default>Convert JSON</n-button>
                    </n-badge>


                    <LogImporter :data="translateData" v-model:show-modal="showModal" />
                    <TooltipWrapper :content="tooltipTextHelper.importShare">
                        <n-button @click="importShare"> Import share </n-button>
                    </TooltipWrapper>
                </n-flex>
                <n-flex>

                    <TooltipWrapper :content="tooltipTextHelper.checkingUi">
                        <n-badge dot :show="needUpdate">
                            <n-button @click="checkingUi" type="default">Checking layout</n-button>
                        </n-badge>
                    </TooltipWrapper>


                    <PopupButton :UILog="UILog" @logError="logError" />
                </n-flex>
            </n-flex>
        </div>
    </n-loading-bar-provider>
</template>
<style scoped lang="scss">
.app-header {
    display: flex;
    align-items: flex-start;
    display: grid;
    padding: 10px;
    --left-width: 768px;
    --right-width: calc(100vw - var(--left-width));
    grid-template-columns: var(--left-width) auto;
    height: 100%;
    max-width: calc(100vw - 30px);

    .actions {
        align-items: flex-start;
        display: flex;
        padding: 0 10px;

        .n-select {
            min-width: 300px;
        }
    }



}
</style>
