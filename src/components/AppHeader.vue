<script setup lang="ts">
    import { onMounted, ref } from "vue";
    import PopupButton from "./PopupLogButton.vue";
    import { useLoadingBar } from "naive-ui";
    import useMainStore from "../stores/index";
    import { storeToRefs } from "pinia";
    import LogImporter from "./LogImporter.vue";

    const emit = defineEmits([
        "logError",
        "loadOldData",
        "clearData",
        "handleSaveData",
        "checkingUi",
        "convertToJson",
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
            const keyTotal:string[] = [];
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
    <n-loading-bar-provider
        :to="loadingBarTargetRef"
        container-style="position: absolute;"
    >
        <div class="app-header" style="position: relative" ref="loadingBarTargetRef">
            <div class="actions db-controls">
                <n-space vertical>
                    <n-select
                        v-model:value="selectedOption"
                        :options="options"
                        :on-update:value="handleUpdateValue"
                    />
                </n-space>
                <n-button @click="loadOldData" type="info">Mở</n-button>
                <n-button @click="clearData" type="error">Xóa Bảng</n-button>
                <n-input
                    v-model:value="backupname"
                    type="text"
                    placeholder="Nhập tên database"
                />
                <n-button
                    @click="handleSaveData"
                    type="info"
                    :disabled="backupname.length == 0"
                >
                    Lưu (offline)
                </n-button>
            </div>
            <div class="actions data-controls">
                <n-badge dot :show="needUpdate">
                    <n-button @click="convertToJson" type="info"
                        >Chuyển sang dạng JSON</n-button
                    >
                </n-badge>
                <LogImporter :data="translateData" />
                <n-button @click="importShare"> Import share </n-button>
            </div>
            <div class="notifications">
                <n-switch v-model:value="ignoreSmallerText" />Bỏ qua text ngắn hơn

                <n-badge dot :show="needUpdate">
                    <n-button @click="checkingUi" type="default"
                        >Kiểm tra vỡ layout</n-button
                    >
                </n-badge>
                <!-- <n-button @click="mainStore.clearDB">clear DB</n-button> -->
                <PopupButton :UILog="UILog" @logError="logError" />
            </div></div
    ></n-loading-bar-provider>
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
            grid-template-columns: 300px 100px 100px 200px 100px;
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
