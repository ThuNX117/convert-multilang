<script setup lang="ts">
import { onMounted, ref } from "vue";
import PopupButton from "./PopupLogButton.vue";
import { useLoadingBar } from "naive-ui";
import useMainStore from "../stores/index";
import { storeToRefs } from "pinia";
import LogImporter from "./LogImporter.vue";
import TooltipWrapper from "./TooltipWrapper.vue";

const tooltipTextHelper = {
    search: `    FOR FRONTEND DEVELOPERS:
    Search for specific text in the database.
    1. Click on the "Search" button.
    2. Enter the text you want to search for in the input field.
    3. The app will filter the database and display the results in a table.
    4. You can click on a row to view the details of the selected item.`,

    testcatse: `    FOR TESTERS:
    Generate test case from data. 
    This will create a test case based on the current data in the database.
    1. Select the text you want to generate the test case for.
    2. Enter the language, context and scope of the test case.
    3. Click on the "Generate" button to create the test case.
    4. The generated test case will be displayed in the preview area.
    5. You can copy the generated test case to the clipboard by clicking on the "Copy" button.`,
    importShare: `    FOR FRONTEND DEVELOPERS:
    Import share data from JSON files.
    1. Click on the "Import share" button.
    2. Select one or more JSON files to import.
    3. The data from the selected files will be parsed and displayed in a table.
    4. You can download the imported data as a CSV file by clicking on the "Download CSV" button.`,
    convertJson: `    FOR FRONTEND DEVELOPERS:
    Convert the current data to JSON format.
    1. Click on the "Convert JSON" button.
    2. The current data will be converted to JSON format and displayed in a modal.
    3. You can copy the JSON data to the clipboard by clicking on the "Copy" button.`,
    checkingUi: `    FOR FRONTEND DEVELOPERS:
    Check the UI layout for any issues.
    1. Click on the "Checking layout" button.
    2. The UI will be checked for any issues and a report will be generated.        `,
    open: `Open an existing database.
    1. Select the database you want to open from the dropdown list.
    2. Click on the "Open" button to load the selected database.
    3. The data from the selected database will be loaded and displayed in the app.`,
    clear: `Clear the current database.
    1. Click on the "Clear" button to clear the current database.
    2. This will remove all data from the current database.
    3. You can then save a new database with the same name or a different name.`,
    save: `Save the current database.
    1. Enter a name for the database in the input field.
    2. Click on the "Save DB" button to save the current database.
    3. The current data will be saved to the database with the specified name.`,
    verifyLog: `    FOR FRONTEND DEVELOPERS:
    Verify the log data.
    1. Click on the "Verify log" button to check the log data for any issues.
    2. Imported log data will be checked for any issues and a report will be generated.
    3. You can view the report in the log viewer.`,
    ignoreSmallerText: `Ignore shorter text.
    1. Toggle the switch to ignore shorter text in the database.
    2. When enabled, the app will not consider shorter text when comparing translations.
    3. This can help in focusing on more relevant translations.`,

}
const emit = defineEmits([
    "logError",
    "loadOldData",
    "clearData",
    "handleSaveData",
    "checkingUi",
    "convertToJson",
    "generateTestCase",
    "onShowSearch"
]);
const mainStore = useMainStore();
const {
    ignoreSmallerText,
    selectedOption,
    backupname,
    options,
    UILog,
    needUpdate,
    translateData,
} = storeToRefs(mainStore);
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
        console.log(final);
        translateData.value = final;
        const csvRows = [];
        const header = ["Key", ...result.map((item) => item.fileName)];
        csvRows.push(header.join(","));
        final.forEach((row) => {
            csvRows.push(row.map((cell) => {
                if (typeof cell === "string" && (cell.includes(",") || cell.includes('"') || cell.includes("\n"))) {
                    return `"${cell.replace(/"/g, '""')}"`;
                }
                return cell ?? "";
            }).join(","));
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
const generateTestCase = () => {
    emit("generateTestCase");

};
const onShowSearch = () => {
    emit("onShowSearch");
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
</script>

<template>
    <n-loading-bar-provider :to="loadingBarTargetRef" container-style="position: absolute;">
        <div class="app-header" style="position: relative" ref="loadingBarTargetRef">
            <div class="actions db-controls">
                <n-space vertical>
                    <n-select v-model:value="selectedOption" :options="options" :on-update:value="handleUpdateValue" />
                </n-space>
                <TooltipWrapper :content="tooltipTextHelper.open">
                    <n-button @click="loadOldData" type="info">Open</n-button>
                </TooltipWrapper>
                <TooltipWrapper :content="tooltipTextHelper.clear">
                    <n-button @click="clearData" type="error">Clear </n-button>
                </TooltipWrapper>
                <TooltipWrapper :content="tooltipTextHelper.save">
                    <n-button @click="handleSaveData" type="info" :disabled="backupname.length == 0">
                        Save DB
                    </n-button>
                </TooltipWrapper>

                <n-input v-model:value="backupname" type="text" placeholder="Nhập tên database" />

            </div>
            <div class="actions data-controls">
                    <n-badge dot :show="needUpdate">
                        <n-button @click="convertToJson" type="info">Convert JSON</n-button>
                    </n-badge>
                <TooltipWrapper :content="tooltipTextHelper.testcatse">
                    <n-button @click="generateTestCase" type="info">Generate testcase</n-button>
                </TooltipWrapper>
                <TooltipWrapper :content="tooltipTextHelper.search">
                    <n-button @click="onShowSearch" type="info">Search</n-button>
                </TooltipWrapper>

                <LogImporter :data="translateData" />
                <TooltipWrapper :content="tooltipTextHelper.importShare">
                    <n-button @click="importShare"> Import share </n-button>
                </TooltipWrapper>
            </div>
            <div class="notifications">



                    <n-switch v-model:value="ignoreSmallerText" />Ignore shorter text
                <TooltipWrapper :content="tooltipTextHelper.checkingUi">
                    <n-badge dot :show="needUpdate">
                        <n-button @click="checkingUi" type="default">Checking layout</n-button>
                    </n-badge>
                </TooltipWrapper>
                <PopupButton :UILog="UILog" @logError="logError" />
            </div>
        </div>
    </n-loading-bar-provider>
</template>
<style scoped lang="scss">
.app-header {
    display: flex;
    align-items: center;
    padding: 10px 20px;

    .actions {
        align-items: center;
        padding: 0 10px;

        .n-select {
            min-width: 300px;
        }
    }

    .db-controls {
        display: grid;
        grid-template-columns: 300px 80px 80px 200px 80px;
    }

    .data-controls {
        display: flex;
        gap: 8px;
    }

    .notifications {
        justify-self: flex-end;
        flex: 1;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        display: grid;
        gap: 10px;
        grid-template-columns: 40px 150px auto auto;
    }
}
</style>
