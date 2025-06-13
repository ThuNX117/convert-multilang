<template>

    <div class="app-container">
        <AppHeader :tableRef="hottable?.hotInstance" @logError="logError" @loadOldData="loadOldData"
            @clearData="clearData" @handleSaveData="handleSaveData" @checkingUi="checkingUi"
            @convertToJson="convertToJson" @updateValue="handleUpdateValue">
            <input @change="searchText" type="text" />
        </AppHeader>

        <SearchModal ref="searchModalRef" />
        <div class="main-container">
            <div class="data-table">
                <div class="ht-theme-main-dark-auto">
                    <hot-table ref="hottable" :data="translateData" :colHeaders="['Key', ...configHeader, 'Export']"
                        :columns="tableColumns" :renderer="renderderFunc" :afterChange="syncData" :setting="settings"
                         v-bind="tableProps" />
                </div>
            </div>


        </div>
    </div>
    <n-drawer v-model:show="activeDrawer" :width="502" :placement="'right'">
        <n-drawer-content title="JSON ">
            <div class="preview-json">
                <PreviewJson @focus-on="handleFocusOn" :object="jsonObject" :logger="warnLog"
                    @download="handleDownload" />
            </div>
        </n-drawer-content>
    </n-drawer>
    <ModalTest :show-modal="modal.show" :data="modal.data" :onClose="() => (modal.show = false)"
        @previous="previousIssue" @next="nextIssue" />

</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import Handsontable from 'handsontable';
import { HotTable } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';
import useMainStore from './stores/index';
import { useDb } from './plugins/useDB';
import { layoutChecking } from './plugins/layoutChecking';
import { translateObjectName } from './plugins/convert';
import { configHeader, type LanguageKeyType } from './types';

import AppHeader from './components/AppHeader.vue';
import PreviewJson from './PreviewJson.vue';
import ModalTest from './ModalTest.vue';
import SearchModal from './components/SearchModal.vue';

import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';

registerAllModules();

const modal = reactive({ show: false, data: undefined, message: '', index: 0 });
const searchModalRef = ref<InstanceType<typeof SearchModal> | null>(null);
const renderKey = ref(0);
const hottable = ref<Handsontable & { hotInstance: any } | null>(null);

const mainStore = useMainStore();
const {
    ignoreSmallerText,
    selectedOption,
    backupname,
    needUpdate,
    UILog,
    translateData,
} = storeToRefs(mainStore);

watch(selectedOption, (newValue) => {
    if (newValue) backupname.value = newValue;
}, { immediate: true });

watch(translateData, () => {
    needUpdate.value = true;
}, { immediate: true });

const jsonObject = ref<Partial<Record<LanguageKeyType, any>>>({});
const errorLog = ref<string[]>([]);
const progressValue = ref(0);

const warnLog = ref<Record<LanguageKeyType, { msg: string; line: number; column: number }[]>>({
    vie: [],
    thai: [],
    eng: [],
    jap: [],
    cn: [],
});

const options = ref([{ label: 'Sample Option', value: 'sample' }]);

const settings = computed(() => ({
    width: '100%',
    height: 'auto',
    colWidths: 190,
    licenseKey: 'non-commercial-and-evaluation',
    manualColumnFreeze: true,
    search: { searchResultClass: 'customClass' },
    contextMenu: true,
    navigableHeaders: true,
    tabNavigation: true,
    autoWrapRow: true,
    autoWrapCol: true,
    multiColumnSorting: true,
    filters: true,
    rowHeaders: true,
    manualRowMove: true,
    headerClassName: 'htLeft',
    autoRowSize: true,
}));
const activeDrawer = ref(false)
const tableColumns = [
    { type: 'text' },
    { type: 'text' },
    { type: 'text' },
    { type: 'text' },
    { type: 'text' },
    { type: 'text' },
    { data: 'available', type: 'checkbox' },
];
const columnWidth = ref((window.innerWidth - 120) / 6)
onMounted(() => {
    window.addEventListener('resize', () => {
        columnWidth.value = (window.innerWidth - 120) / 6;
    });
})
const tableProps = computed(() => ({
    width: '100%',
    height: 'auto',
    colWidths: [columnWidth.value, columnWidth.value, columnWidth.value, columnWidth.value, columnWidth.value, columnWidth.value, 50],
    licenseKey: 'non-commercial-and-evaluation',
    manualColumnFreeze: true,
    contextMenu: true,
    navigableHeaders: true,
    tabNavigation: true,
    autoWrapRow: true,
    autoWrapCol: true,
    multiColumnSorting: true,
    filters: true,
    rowHeaders: true,
    manualRowMove: true,
    headerClassName: 'htLeft',
    autoRowSize: true,
    search: true,
}));

const { getDataList, saveTranslateDb, getDetail } = useDb();
//@ts-ignore
function renderderFunc(instance, td, row, col, prop, value) {
    //@ts-ignore
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.innerHTML = `<div class="truncated">${value}</div>`;
}
//@ts-ignore

const syncData = (_changes: any, source: string) => {
    if (source !== 'loadData') {
        // @ts-ignore
        translateData.value = hottable.value?.hotInstance.getData();
    }
};

const logError = (value: any, index: number) => {
    if (value) {
        modal.data = value;
        modal.show = true;
        modal.index = index;
    } else {
        modal.show = false;
    }
};




const nextIssue = () => {
    const index = modal.index + 1;
    logError(UILog.value[index], index);
};

const previousIssue = () => {
    const index = modal.index - 1;
    logError(UILog.value[index], index);
};

const handleFocusOn = (value: any) => {
    if (value) {
        const row = value.line - 1;
        const col = value.column + 1;
        hottable.value?.hotInstance.selectCell(row, col);
        hottable.value?.hotInstance.getActiveEditor().beginEditing();
    }
};

const handleDownload = (type: LanguageKeyType) => {
    const Json = jsonObject.value[type];
    const blob = new Blob([JSON.stringify(Json, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

const handleUpdateValue = async (v: string) => {
    if (v) {
        selectedOption.value = v;
        const data = await getDetail(v);
        updateTable(JSON.parse(data?.data || '[["","","","","","",""],["","","","","","",""],["","","","","","",""],["","","","","","",""],]'));
        translateData.value = JSON.parse(data?.data || '[]');
    }
    renderKey.value++;
};

const handleSaveData = async () => {
    const dataString = JSON.stringify(translateData.value);
    const id = await saveTranslateDb(dataString, backupname.value);
    options.value = await getDataList();
    if (id) selectedOption.value = id;
};

const loadOldData = async () => {
    const res = await getDetail(selectedOption.value);
    updateTable(JSON.parse(res?.data || '[]'));
};

const updateTable = (...data: any) => {
    hottable.value?.hotInstance.updateData(...data);
};

const emptyData = Array.from({ length: 20 }).map(() => ['', '', '', '', '', '']);
const clearData = () => {
    translateData.value = emptyData;
    jsonObject.value = {};
    errorLog.value = [];
    warnLog.value = { vie: [], thai: [], eng: [], jap: [], cn: [] };
    updateTable(translateData.value, 'forceUpdate');
    renderKey.value++;
};

const convertToJson = () => {

    const _errorHandler = errorHandler();
    _errorHandler.clear();
    const dataRaw = translateData.value;
    needUpdate.value = false;
    const result: Record<LanguageKeyType, any> = {
        vie: {},
        thai: {},
        jap: {},
        eng: {},
        cn: {},
    };
    dataRaw.forEach((row, index) => {
        const [name, jap, vie, eng, cn, thai] = row;
        const config = { vie, thai, eng, jap, cn };
        configHeader.forEach((key) => {
            if (!name) return;
            if (config[key]) {
                result[key] = combineNestedObjects(result[key], translateObjectName(name, config[key]||config['jap']));
            } else {
                _errorHandler.log(`${key} is missing value`);
                _errorHandler.warn(key, String(name), index + 1, 'missing value');
            }
        });
    });
    jsonObject.value = result;
    activeDrawer.value = true
    return result;
};

const checkingUi = () => {
    const testData: Array<any> = JSON.parse(JSON.stringify(translateData.value));
    progressValue.value = 0;
    UILog.value = [];
    testData.forEach((row, index) => {
        const [key, jap, vie, eng, cn, thai] = row;
        if (!key) return;
        const res = layoutChecking({ vie, thai, eng, jap, cn });
        const { thai: isBreakingThai, cn: isBreakingCN } = res.result;
        const createLog = (res: any, lang: 'thai' | 'cn', type: string) => ({
            type: lang,
            msg: `${lang.toUpperCase()}: Line ${index + 1}:  UI issue detected. text is ${type.toUpperCase()} \n Measured/min/max=${res.measure[lang]}/${res.min} /${res.max} `,
            data: { ...res, lang },
        });
        if (isBreakingThai == 2) {
            UILog.value.push(createLog(res, 'thai', 'bigger'));
        } else if (isBreakingThai == 0 && !ignoreSmallerText.value) {
            UILog.value.push(createLog(res, 'thai', 'smaller'));
        }
        if (isBreakingCN == 2) {
            UILog.value.push(createLog(res, 'cn', 'bigger'));
        } else if (isBreakingCN == 0 && !ignoreSmallerText.value) {
            UILog.value.push(createLog(res, 'cn', 'smaller'));
        }
        progressValue.value = Number((((index + 1) / translateData.value.length) * 100).toFixed(2));
    });
    setTimeout(() => {
        progressValue.value = 0;
    }, 3000);
};

const errorHandler = () => {
    const log = (error: string) => errorLog.value.push(error);
    const warn = (key: LanguageKeyType, name: string, line: number, msg: string) => {
        warnLog.value[key].push({
            msg: `Line ${line}: ${name} has error: ${msg}`,
            line,
            column: configHeader.indexOf(key),
        });
    };
    const clear = () => {
        errorLog.value = [];
        warnLog.value = { vie: [], thai: [], eng: [], jap: [], cn: [] };
    };
    return { log, warn, clear };
};

const combineNestedObjects = (obj1: any, obj2: any) => {
    const result = { ...obj1 };
    const mergeObjects = (target: any, source: any) => {
        for (const key in source) {
            if (
                typeof source[key] === 'object' &&
                source[key] !== null &&
                !Array.isArray(source[key])
            ) {
                if (!target[key] || typeof target[key] !== 'object') {
                    target[key] = {}; // Initialize as an empty object if it's not an object
                }
                mergeObjects(target[key], source[key]);
            } else {
                try {
                    target[key] = source[key];
                } catch (error) {
                    console.error("Cannot map", error, key, target[key], source[key]);
                }
            }
        }
    };
    mergeObjects(result, obj2);
    return result;
};

onMounted(async () => {
    options.value = await getDataList();
    selectedOption.value = options.value[0]?.value || '';
});

const searchText = (event: Event) => {
    const hot = (hottable.value as any)?.hotInstance as Handsontable;
    const search = hot.getPlugin('search');
    const inputValue = (event.target as HTMLInputElement)?.value;
    search.query(inputValue);
    hot.render();
};
</script>

<style lang="scss" scoped>
.app-container {
    display: grid;
    --menu-height: 50px;
    --header-height: 100px;
    --available-height: calc(100vh - var(--menu-height));
    grid-template-rows: var(--header-height) calc(var(--available-height) - var(--header-height));
    width: 100vw;

    .main-container {
        display: grid;
        // --left-width: 1250px;
        // --right-width: calc(100vw - var(--left-width));
        // grid-template-columns: var(--left-width) var(--right-width);
        height: 100%;

        .data-table {
            height: 100%;
            overflow: auto;
            position: relative;
        }

    }
}
</style>
<style>
.table-data {
    display: grid;
    grid-template-columns: var(--left-width) var(--right-width);
}

.preview {
    min-height: calc(100vh);
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ccc;
}

.handsontable .truncated {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 190px;
}

.menu {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ccc;
    gap: 20px;
}

.construct-feedback {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
    flex: 1;
}

.warning-c {
    color: rgb(240, 138, 0);
}

.error-c {
    color: rgb(208, 58, 82);
}

.progress-status.n-progress.n-progress--circle {
    width: 80px;
    height: 80px;
}

.header {
    height: 50px;
}

.preview {
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-x: auto;
    overflow: auto;
    border-left: 1px solid #ccc;
}

.error-log {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 10px;
    padding: 4px 30px 0 10px;
    width: 400px;
    color: #721c24;
    border-bottom: 1px solid #f5c6cb;
}

.error-log:hover {
    background-color: #f8d7da;
    cursor: pointer;
}

.error-log:active {
    background-color: #f5c6cb;
}

.error-log>.text {
    word-break: break-all;
}

.scroller {
    max-height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>
