<template>
  <n-config-provider>
    <n-global-style />
    <n-progress type="line" :percentage="progressValue" indicator-placement="inside" processing />
    <div class="table-data" style="--left-width: 1400px; --right-width: calc(100% - var(--left-width) - 20px);">

      <div class="table-container">
        <div class="header">
          <div class="actions">
            Input CSV
            <n-space vertical>
              <n-select v-model:value="value" :options="options" :on-update:value="handleUpdateValue" />
            </n-space>
          </div>
          <div class="actions">
            <n-button @click="convertToJson" type="info">Convert</n-button>
            <n-button @click="handleSaveData" type="primary"> Save </n-button>
            <n-button @click="clearData" type="default"> Clear database</n-button>
            <n-button @click="checkingUi" type="default"> CheckUi</n-button>
          </div>

        </div>

        <div class="ht-theme-main-dark-auto ">
          <hot-table :data="data" :search="true" :rowHeaders="true" :setting="settings"
            licenseKey="non-commercial-and-evaluation"
            :colHeaders="['Key', 'Vietnameses', 'Japanese', 'English', 'Thailend', 'Chinese',]"
            :renderer="renderderFunc">
          </hot-table>

        </div>
      </div>
      <div class="preview">

        <div class="header">
          <div class="construct-feedback">
            <n-badge :value="errorLog.length">
              <n-icon class="badge-btn error error-c">
                <Error color="red" style="height: 24px; width: 24px;;;" />
              </n-icon>
            </n-badge>
            <n-badge
              :value="warnLog.vie.length + warnLog.thai.length + warnLog.eng.length + warnLog.jap.length + warnLog.cn.length">
              <n-icon class="badge-btn warning warning-c">
                <Warning style="height: 24px; width: 24px;;;" />
              </n-icon>
            </n-badge>

            <n-popover trigger="click">
              <template #trigger>
                <n-badge :value="UILog.length">
                  <n-icon class="badge-btn ">
                    <Warning style="height: 24px; width: 24px;;;" />
                  </n-icon>
                </n-badge>
              </template>
              <div class="error-log">
                <div v-for="value in UILog">{{ value }}</div>
              </div>
            </n-popover>
          </div>
        </div>
        <PreviewJson :object="jsonObject" :logger="warnLog" @download="handleDownload" />

      </div>

    </div>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
// @ts-ignore
import PreviewJson from './PreviewJson.vue';
import { HotTable } from '@handsontable/vue3';
// @ts-ignore
import { registerAllModules } from 'handsontable/registry';
import Handsontable from 'handsontable';
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';
import { translateObjectName } from './plugins/convert';
import { sampleData } from './data';
import { Error, Warning } from '@vicons/carbon'
import { useDb } from './plugins/useDB';
import { layoutChecking } from './plugins/layoutChecking';

registerAllModules();
// @ts-ignore
function renderderFunc(instance, td, row, col, prop, value, cellProperties) {
  // @ts-ignore
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  td.innerHTML = `<div class="truncated">${value}</div>`

}

const handleDownload = (type: LanguageKeyType) => {
  const Json = jsonObject.value[type]
  const blob = new Blob([JSON.stringify(Json, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = `${type}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  console.log('Json', Json)
}
const options = ref([{
  label: 'Everybody\'s Got Something to Hide Except Me and My Monkey',
  value: 'song0',
},])

const handleUpdateValue = async (v: string) => {
  console.log('value', v)
  const selectedOption = options.value.find(option => option.value === v);
  if (selectedOption) {
    console.log('Selected option:', selectedOption);
    value.value = selectedOption.value;
    await getDetail(selectedOption.value)
  } else {
    console.log('No option found with the given value.');
  }
}
const value = ref('')
const data = ref(import.meta.env.DEV?sampleData:[]);
const jsonObject = ref<Partial<Record<LanguageKeyType, any>>>({})
watch(data, () => {
  convertToJson()
}, { deep: true });
const clearData = () => {
  data.value = [[], [], [], [], []]
  jsonObject.value = {}
  errorLog.value = []
  warnLog.value = {
    vie: [],
    thai: [],
    eng: [],
    jap: [],
    cn: [],
  }
}

const handleSaveData = async () => {
  const id = await saveTranslateDb()
  if (id) {
    options.value = await getDataList()
    value.value = id
  }
}
const { getDataList, saveTranslateDb, getDetail } = useDb()
type LanguageKeyType = 'vie' | 'thai' | 'eng' | 'jap' | 'cn'
const configHeader: Array<LanguageKeyType> = ['vie', 'thai', 'eng', 'jap', 'cn']
const errorLog = ref<string[]>([])
const UILog = ref<string[]>([])

const warnLog = ref<Record<LanguageKeyType, string[]>>({
  vie: [],
  thai: [],
  eng: [],
  jap: [],
  cn: []


})
onMounted(async () => {
  console.log("onMount app ")
  // await saveTranslateDb()
  options.value = await getDataList()
  value.value = options.value[0].value || ''
})
const errorHandler = () => {
  const log = (error: string) => {
    errorLog.value.push(error)
  }
  const warn = (key: LanguageKeyType, name: string, line: number, msg: string) => {
    warnLog.value[key].push(`Line ${line}: ${name} has error: ${msg}`)
  }
  const clear = () => {
    errorLog.value = []
    warnLog.value = {
      vie: [],
      thai: [],
      eng: [],
      jap: [],
      cn: []
    }

  }
  return {
    log,
    warn, clear
  }
}
const convertToJson = () => {
  const _errorHandler = errorHandler()
  _errorHandler.clear()
  const dataRaw = data.value
  console.log('dataRaw', dataRaw)

  let result: Record<LanguageKeyType, any> = {
    vie: {},
    thai: {},
    jap: {},
    eng: {},
    cn: {},
  }
  dataRaw.forEach((row, index) => {
    const [name, vie, thai, eng, jap, cn] = row
    const config = { vie, thai, eng, jap, cn }
    configHeader.forEach((key) => {
      if (!name) { return }
      if (config[key]) { result[key] = combineNestedObjects(result[key], translateObjectName(name, config[key])) } else {
        _errorHandler.log(`${key} is missing value`)
        _errorHandler.warn(key, name, index + 1, 'missing value')
      }

    })



  });
  jsonObject.value = result
  console.log('result', jsonObject)
  return result

}
const settings = {
  licenseKey: 'non-commercial-and-evaluation',
  //... other options
}



const combineNestedObjects = (obj1: any, obj2: any) => {
  const result = { ...obj1 };

  const mergeObjects = (target: { [x: string]: any; }, source: { [x: string]: any; }) => {
    for (const key in source) {
      if (
        typeof source[key] === 'object' &&
        source[key] !== null &&
        !Array.isArray(source[key])
      ) {
        if (!target[key]) {
          target[key] = {};
        }
        mergeObjects(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  };

  mergeObjects(result, obj2);
  return result;
};



const progressValue = ref(0)
const checkingUi = () => {
  progressValue.value = 0
  UILog.value = []
  data.value.forEach((row, index) => {
    const [_, vie, thai, eng, jap, cn,] = row
    const res = layoutChecking({ vie, thai, eng, jap, cn })
    // const { thai: isBreakingThai, cn: isBreakingCN } = res
    const isBreakingThai = res.result.thai
    const isBreakingCN = res.result.cn
    console.warn(res)
    if (isBreakingThai === 2) {
      UILog.value.push(`Line ${index + 1}: Potential UI issue in Thai mode. Min: ${res.min.toFixed(1)}, Max: ${res.max.toFixed(1)}, Length: ${res.measure.thai.toFixed(1)}`);
    }
    if (isBreakingCN === 2) {
      UILog.value.push(`Line ${index + 1}: Potential UI issue in Chinese mode. Min: ${res.min.toFixed(1)}, Max: ${res.max.toFixed(1)}, Length: ${res.measure.cn.toFixed(1)}`);
    

    }
    progressValue.value = Number(((index + 1) / Number(data.value.length) * 100).toFixed(2));

  })
}
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
  color: rgb(240, 138, 0)
}

.error-c {
  color: rgb(208, 58, 82)
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
</style>
