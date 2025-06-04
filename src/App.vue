<template>
    <n-loading-bar-provider>
        <n-message-provider>
            <n-config-provider>

                <n-global-style />
                <div class="app-container">
                    <AppHeader @logError="logError" @loadOldData="loadOldData" @clearData="clearData"
                        @handleSaveData="handleSaveData" @checkingUi="checkingUi" @convertToJson="convertToJson"
                        @updateValue="handleUpdateValue" @generate-test-case="generateTestCase" 
                        @onShowSearch="onShowSearch"/>
                    <GenerateLogModal ref="testcaseRef" :data="selectedData"></GenerateLogModal>
                    <SearchModal ref="searchModal" :show="states.showSearch" />
                    <div class="main-container">
                        <div class="data-table">
                            <div class="ht-theme-main-dark-auto">
                                <hot-table ref="hottable" :data="translateData" :colHeaders="[
                                    'Key',
                                    ...configHeader, 'Export'
                                ]" :columns="[
                                    { type: 'text' },
                                    { type: 'text' },
                                    { type: 'text' },
                                    { type: 'text' },
                                    { type: 'text' },
                                    { type: 'text' },
                                    {
                                        data: 'available',
                                        type: 'checkbox',
                                    },
                                    // {
                                    //     data: 'export',
                                    //     renderer: buttonRenderer,
                                    // },
                                ]" :renderer="renderderFunc" :afterChange="syncData" :setting="settings" v-bind="{
                                    width: '100%',
                                    height: 'auto',
                                    colWidths: [190, 190, 190, 190, 190, 190, 50],
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
                                }" />
                            </div>
                        </div>
                        <div class="preview-json">
                            <PreviewJson @focus-on="handleFocusOn" :object="jsonObject" :logger="warnLog"
                                @download="handleDownload" />
                        </div>
                    </div>
                </div>
                <ModalTest :show-modal="modal.show" :data="modal.data" :onClose="() => (modal.show = false)"
                    @previous="previousIssue" @next="nextIssue" />
            </n-config-provider>

        </n-message-provider></n-loading-bar-provider>
</template>

<script lang="ts" setup>
import ModalTest from './ModalTest.vue';
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import PreviewJson from './PreviewJson.vue';
import { HotTable } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';
import Handsontable from 'handsontable';
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';
import { translateObjectName } from './plugins/convert';
import { useDb } from './plugins/useDB';
import { layoutChecking } from './plugins/layoutChecking';
import AppHeader from './components/AppHeader.vue';
import { storeToRefs } from 'pinia';
import useMainStore from './stores/index';
import GenerateLogModal from './components/GenerateLogModal.vue';
import SearchModal from './components/SearchModal.vue';

registerAllModules();
const modal = reactive({ show: false, data: undefined, message: '', index: 0 });
const testcaseRef = ref<InstanceType<typeof GenerateLogModal> | null>(null);
const searchModalRef = ref<InstanceType<typeof SearchModal> | null>(null);
const renderKey = ref(0);
const hottable = ref<Handsontable | null>(null);
const mainStore = useMainStore();
const {
    ignoreSmallerText,
    selectedOption,
    backupname,
    needUpdate,
    UILog,
    translateData,
} = storeToRefs(mainStore);
watch(
    selectedOption,
    (newValue) => {
        if (newValue) {
            backupname.value = newValue;
        }
    },
    { immediate: true }
);
watch(
    translateData,
    () => {
        needUpdate.value = true;
    },
    { immediate: true }
);
const jsonObject = ref<Partial<Record<LanguageKeyType, any>>>({});
const errorLog = ref<string[]>([]);

const progressValue = ref(0);

const warnLog = ref<
    Record<LanguageKeyType, { msg: string; line: number; column: number }[]>
>({
    vie: [],
    thai: [],
    eng: [],
    jap: [],
    cn: [],
});

const configHeader: Array<LanguageKeyType> = ['jap', 'vie', 'eng', 'cn', 'thai',];

const options = ref([{ label: 'Sample Option', value: 'sample' }]);

const settings = computed(() => ({
    width: '100%',
    height: 'auto',
    colWidths: 190,
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
}));

type LanguageKeyType = 'vie' | 'thai' | 'eng' | 'jap' | 'cn';

const { getDataList, saveTranslateDb, getDetail } = useDb();
//@ts-ignore
function renderderFunc(instance, td, row, col, prop, value) {
    //@ts-ignore
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.innerHTML = `<div class="truncated">${value}</div>`;
}
//@ts-ignore
const syncData = (changes, source) => {
    if (source !== 'loadData')
        // @ts-ignore
        translateData.value = hottable.value?.hotInstance.getData();
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

const getCheckedRows = () => {
    // Find rows where the 'available' checkbox is checked (true)
    return translateData.value
        .map((row, idx) => ({ row, idx }))
        .filter(({ row }) => row[6] === true)
        .map(({ row, idx }) => ({ row, idx }));
};
const states = reactive({
    showSearch: false,
});
const selectedData = ref()
const generateTestCase = () => {
    const data = getCheckedRows()
    const result = data.map(({ row, idx }) => {
        const re: Partial<Record<LanguageKeyType | 'key' | 'checked', string | null | boolean>> = {
            key: row[0],

            checked: row[6] || false,
        };
        ['key', ...configHeader, 'checked'].forEach((key, index) => {
            re[key as LanguageKeyType | 'key' | 'checked'] = row[index]; // +1 to skip the key column
        });

        return {
            data: re, idx
        }
    })
    selectedData.value = result
    nextTick(() => {
        if (testcaseRef.value) {
            testcaseRef.value.show()
        }
    })
    console.log(result)
}
const onShowSearch = () => {
    if (searchModalRef.value) {
        console.log('show search modal');
        states.showSearch = true;
    }
};
// function buttonRenderer(instance: any, td: HTMLElement, row: any, _col: any, _prop: any, _value: any, _cellProperties: any) {
//     // Clear the cell
//     Handsontable.dom.empty(td);
//     const rowData = instance.getSourceDataAtRow(row);

//     const hasData = rowData.some(Boolean)
//     // Create a button element

//     if (hasData) {
//         const button = document.createElement('button');
//         button.textContent = 'generate test case';
//         button.className = 'ht-button';

//         // Add an event listener to the button
//         button.addEventListener('click', () => {
//             if (testcaseRef.value) {
//                 testcaseRef.value.show()

//             }
//         });
//         // Display content if any previous column has data
//         td.appendChild(button);
//         Handsontable.dom.addClass(td, 'htCenter htMiddle');
//     } else {
//         // Leave the cell empty
//         td.textContent = '';
//     }
//     // Append the button to the cell


//     // Apply Handsontable's default cell properties
//     Handsontable.dom.addClass(td, 'htCenter htMiddle');
// }
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
        // @ts-ignore
        hottable.value?.hotInstance.selectCell(row, col);
        // @ts-ignore
        hottable.value?.hotInstance.getActiveEditor().beginEditing();
    }
};
const handleDownload = (type: LanguageKeyType) => {
    const Json = jsonObject.value[type];
    const blob = new Blob([JSON.stringify(Json, null, 2)], {
        type: 'application/json',
    });
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
        updateTable(
            JSON.parse(
                data?.data ||
                '[["","","","","","",""],["","","","","","",""],["","","","","","",""],["","","","","","",""],]'
            )
        );
        translateData.value = JSON.parse(data?.data || '[]');
    }
    renderKey.value++;
};

const handleSaveData = async () => {
    const dataString = JSON.stringify(translateData.value);
    const id = await saveTranslateDb(dataString, backupname.value);
    console.log('handleSaveData', id, dataString);
    options.value = await getDataList();
    if (id) {
        selectedOption.value = id;
    }
};

const loadOldData = async () => {
    const res = await getDetail(selectedOption.value);
    console.log(res);
    updateTable(JSON.parse(res?.data || '[]'));
};

const updateTable = (...data: any) => {
    //@ts-ignore
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
        const [name, vie, jap, eng, thai, cn] = row;
        const config = { vie, thai, eng, jap, cn };
        configHeader.forEach((key) => {
            if (!name) return;
            if (config[key]) {
                result[key] = combineNestedObjects(
                    result[key],
                    translateObjectName(name, config[key])
                );
            } else {
                _errorHandler.log(`${key} is missing value`);
                _errorHandler.warn(key, String(name), index + 1, 'missing value');
            }
        });
    });

    jsonObject.value = result;
    return result;
};

const checkingUi = () => {
    const testData: Array<any> = JSON.parse(JSON.stringify(translateData.value));
    progressValue.value = 0;
    UILog.value = [];
    testData.forEach((row, index) => {
        const [key, vie, jap, eng, thai, cn] = row;
        if (!key) {
            return;
        }
        const res = layoutChecking({ vie, thai, eng, jap, cn });
        const { thai: isBreakingThai, cn: isBreakingCN } = res.result;
        console.log(res);
        const createLog = (res: any, lang: 'thai' | 'cn', type: string) => {
            return {
                type: lang,
                msg: `${lang.toLocaleUpperCase()}: Line ${index + 1
                    }:  UI issue detected. text is ${type.toLocaleUpperCase()} \n Measured/min/max=${res.measure[lang]
                    }/${res.min} /${res.max} `,
                data: { ...res, lang },
            };
        };
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
        progressValue.value = Number(
            (((index + 1) / translateData.value.length) * 100).toFixed(2)
        );
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
                if (!target[key]) target[key] = {};
                mergeObjects(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
    };
    mergeObjects(result, obj2);
    return result;
};

onMounted(async () => {
    options.value = await getDataList();
    selectedOption.value = options.value[0]?.value || '';
    // await loadNewestBackUp();
});
</script>
<style lang="scss" scoped>
.app-container {
    display: grid;
    grid-template-rows: 70px calc(100vh - 70px);

    .main-container {
        display: grid;
        --left-width: 1250px;
        --right-width: calc(100vw - var(--left-width));
        grid-template-columns: var(--left-width) var(--right-width);
        height: 100%;

        .data-table {
            height: 100%;
            overflow: auto;
            position: relative;
        }

        .preview-json {
            max-height: 100%;
            overflow: auto;
            padding: 0 10px;
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

.actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
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
