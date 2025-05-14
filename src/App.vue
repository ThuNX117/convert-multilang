<template>
  <n-message-provider>
    <n-config-provider>
      <n-global-style />
      <div class="table-data" style="--left-width: 1400px; --right-width: calc(100% - var(--left-width) - 20px)">
        <n-progress style="position: absolute; top: 0; margin: 0; padding: 0; left: 0" v-if="progressValue > 0"
          type="line" :percentage="progressValue" indicator-placement="inside" processing :height="10"
          :border-radius="2" :fill-border-radius="0" />

        <div class="table-container">
          <div class="header" style="position: relative">
            <div class="actions">

              <n-space vertical>
                <n-select style="min-width: 300px" v-model:value="selectedOption" :options="options"
                  :on-update:value="handleUpdateValue" />
              </n-space>
              <n-button @click="loadOldData" type="info">Mở</n-button>
              <n-button @click="clearData" type="info">Xóa</n-button>
              <n-input v-model:value="backupname" type="text" placeholder="Basic Input" />
            </div>
            <div class="actions">
              <n-checkbox v-model:checked="ignoreSmallerText">Bỏ qua text ngắn hơn</n-checkbox>
              <n-button @click="checkingUi" type="default">Kiểm tra vỡ layout</n-button>
              <n-button @click="convertToJson" type="info">Chuyển sang dạng JSON</n-button>
              <n-button @click="handleSaveData" type="primary"> Lưu (offline) </n-button>
            </div>
          </div>

          <div class="ht-theme-main-dark-auto">
            <hot-table ref="hottable" :data="translateData" :search="true" :rowHeaders="true" :setting="settings"
              :key="renderKey" licenseKey="non-commercial-and-evaluation" :colHeaders="[
                'Key',
                'Vietnameses',
                'Japanese',
                'English',
                'Thailend',
                'Chinese',
              ]" :renderer="renderderFunc">
            </hot-table>
          </div>
        </div>
        <div class="preview">
          <div class="header">
            <div class="construct-feedback">
              <n-badge :value="errorLog.length">
                <n-icon class="badge-btn error error-c">
                  <Error color="red" style="height: 24px; width: 24px ;" />
                </n-icon>
              </n-badge>
              <n-badge :value="warnLog.vie.length +
                warnLog.thai.length +
                warnLog.eng.length +
                warnLog.jap.length +
                warnLog.cn.length
                ">
                <n-icon class="badge-btn warning warning-c">
                  <Warning style="height: 24px; width: 24px ;" />
                </n-icon>
              </n-badge>

              <n-popover trigger="click">
                <template #trigger>
                  <n-badge :value="UILog.length">
                    <n-icon class="badge-btn">
                      <Warning style="height: 24px; width: 24px ;" />
                    </n-icon>
                  </n-badge>
                </template>
                <div class="scroller">
                  <div class="error-log" v-for="value in UILog">
                    <div class="text" v-html="value.msg.replace(/\n/g, '<br>')">
                    </div>

                    <n-icon @click="logError(value)">
                      <Language style="height: 32px; width: 32px ;" />
                    </n-icon>
                  </div>
                </div>
              </n-popover>
            </div>
          </div>
          <PreviewJson :object="jsonObject" :logger="warnLog" @download="handleDownload" />
        </div>
      </div>
      <ModalTest :show-modal="modal.show" :data="modal.data" :onClose="() => (modal.show = false)" />
    </n-config-provider>
  </n-message-provider>
</template>

<script lang="ts" setup>
import ModalTest from "./ModalTest.vue";
import { onMounted, reactive, ref, watch } from "vue";
import PreviewJson from "./PreviewJson.vue";
import { HotTable } from "@handsontable/vue3";
import { registerAllModules } from "handsontable/registry";
import Handsontable from "handsontable";
import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-main.min.css";
import { translateObjectName } from "./plugins/convert";
import { sampleData } from "./data";
import { Error, Warning, Language } from "@vicons/carbon";
import { useDb } from "./plugins/useDB";
import { layoutChecking } from "./plugins/layoutChecking";

registerAllModules();
const ignoreSmallerText = ref(true);
const modal = reactive({ show: false, data: undefined, message: "" });
const renderKey = ref(0);
const hottable = ref<Handsontable | null>(null);
const selectedOption = ref("");
const backupname = ref("");
watch(
  selectedOption,
  (newValue) => {
    if (newValue) {
      backupname.value = newValue;
    }
  },
  { immediate: true }
);
const translateData = ref(sampleData);
const jsonObject = ref<Partial<Record<LanguageKeyType, any>>>({});
const errorLog = ref<string[]>([]);
type UILogType = {
  msg: string;
  data: any;
};

const UILog = ref<UILogType[]>([]);
const progressValue = ref(0);

const warnLog = ref<Record<LanguageKeyType, string[]>>({
  vie: [],
  thai: [],
  eng: [],
  jap: [],
  cn: [],
});

const configHeader: Array<LanguageKeyType> = ["vie", "thai", "eng", "jap", "cn"];

const options = ref([{ label: "Sample Option", value: "sample" }]);

const settings = {
  licenseKey: "non-commercial-and-evaluation",
};

type LanguageKeyType = "vie" | "thai" | "eng" | "jap" | "cn";

const { getDataList, saveTranslateDb, getDetail } = useDb();
//@ts-ignore
function renderderFunc(instance, td, row, col, prop, value) {
  //@ts-ignore
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  td.innerHTML = `<div class="truncated">${value}</div>`;
}
const logError = (value: any) => {
  console.log(value);
  modal.data = value;
  modal.show = true;
};
const handleDownload = (type: LanguageKeyType) => {
  const Json = jsonObject.value[type];
  const blob = new Blob([JSON.stringify(Json, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
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
        '[["","","","","",""],["","","","","",""],["","","","","",""],["","","","","",""],]'
      )
    );
    translateData.value = JSON.parse(data?.data || "[]");
  }
  renderKey.value++;
};

const handleSaveData = async () => {
  const dataString = JSON.stringify(translateData.value);
  const id = await saveTranslateDb(dataString, backupname.value);
  options.value = await getDataList();
  if (id) {
    selectedOption.value = id;
  }
};

const loadNewestBackUp = async () => {
  const res = await getDetail(selectedOption.value);
  if (res) {
    translateData.value = JSON.parse(res.data);
  }
};

const loadOldData = async () => {
  const res = await getDetail(selectedOption.value);
  updateTable(JSON.parse(res?.data || "[]"));
};

const updateTable = (...data: any) => {
  //@ts-ignore
  hottable.value?.hotInstance.updateData(...data);
};

const emptyData = Array.from({ length: 20 }).map(() => ["", "", "", "", "", ""]);
const clearData = () => {
  translateData.value = emptyData;
  jsonObject.value = {};
  errorLog.value = [];
  warnLog.value = { vie: [], thai: [], eng: [], jap: [], cn: [] };
  updateTable(translateData.value, "forceUpdate");
  renderKey.value++;
};

const convertToJson = () => {
  const _errorHandler = errorHandler();
  _errorHandler.clear();
  const dataRaw = translateData.value;

  const result: Record<LanguageKeyType, any> = {
    vie: {},
    thai: {},
    jap: {},
    eng: {},
    cn: {},
  };

  dataRaw.forEach((row, index) => {
    const [name, vie, thai, eng, jap, cn] = row;
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
        _errorHandler.warn(key, name, index + 1, "missing value");
      }
    });
  });

  jsonObject.value = result;
  return result;
};

const checkingUi = () => {
  progressValue.value = 0;
  UILog.value = [];
  translateData.value.forEach((row, index) => {
    const [_, vie, jap, eng, thai, cn] = row;
    const res = layoutChecking({ vie, thai, eng, jap, cn });
    const { thai: isBreakingThai, cn: isBreakingCN } = res.result;
    const createLog = (res: any, lang: 'thai' | 'cn', type: string) => {
      return {
        msg: `${lang.toLocaleUpperCase()}: Line ${index + 1
          }:  UI issue detected. text is ${type.toLocaleUpperCase()} \n Measured/min/max=${res.measure[lang]}/${res.min} /${res.max} `,
        data: { ...res, lang },
      }
    }
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
    warnLog.value[key].push(`Line ${line}: ${name} has error: ${msg}`);
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
        typeof source[key] === "object" &&
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
  selectedOption.value = options.value[0]?.value || "";
  await loadNewestBackUp();
});
</script>
<style>
.table-data {
  display: grid;
  grid-template-columns: var(--left-width) var(--right-width);
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
  max-width: 200px;
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
  margin-bottom: 10px;
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

.error-log>.text {
  word-break: break-all;
}

.scroller {
  max-height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
