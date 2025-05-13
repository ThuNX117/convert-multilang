<template>
  <n-config-provider>
    <n-global-style />
    <div class="menu"> Input CSV

      <n-button @click="convertToJson"> <n-icon>
          <Upload />
        </n-icon> Upload Vietnamese reference</n-button>
      <n-button @click="convertToJson">
        EN: Upload English reference</n-button>
      <n-button @click="convertToJson"> Upload Japanese reference</n-button>
      <n-button @click="convertToJson" type="primary">> Convert</n-button>
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
      </div>

    </div>
    <div class="table-data" style="--left-width: 1200px; --right-width: calc(100% - var(--left-width) - 20px);">

      <div class="ht-theme-main-dark-auto">
        <div class="header">

        </div>
        <hot-table :data="data" :rowHeaders="true" :setting="settings" licenseKey="non-commercial-and-evaluation"
          :colHeaders="['Key', 'Vietnameses', 'Japanese', 'English', 'Thailend', 'Chinese',]" :renderer="renderderFunc">
        </hot-table>
      </div>
      <div class="preview">


        <PreviewJson :object="jsonObject" :logger="warnLog" />

      </div>

    </div>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
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
import { Upload, Error, Warning } from '@vicons/carbon'

registerAllModules();
// @ts-ignore
function renderderFunc(instance, td, row, col, prop, value, cellProperties) {
  // @ts-ignore
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  td.innerHTML = `<div class="truncated">${value}</div>`

}
const data = ref(sampleData);
const jsonObject = ref({})
watch(data, () => {
  convertToJson()
}, { deep: true });
type KeyLang = 'vie' | 'thai' | 'eng' | 'jap' | 'cn'
const configHeader: Array<KeyLang> = ['vie', 'thai', 'eng', 'jap', 'cn']
const errorLog = ref<string[]>([])
const warnLog = ref<Record<KeyLang, string[]>>({
  vie: [],
  thai: [],
  eng: [],
  jap: [],
  cn: []


})
const errorHandler = () => {
  const log = (error: string) => {
    errorLog.value.push(error)
  }
  const warn = (key: KeyLang, name: string, msg: string) => {
    warnLog.value[key].push(`${name}  ${msg}`)
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

  let result: Record<KeyLang, any> = {
    vie: {},
    thai: {},
    jap: {},
    eng: {},
    cn: {},
  }
  dataRaw.forEach((row) => {
    const [name, vie, thai, eng, jap, cn] = row
    const config = { vie, thai, eng, jap, cn }
    configHeader.forEach((key) => {
      if (config[key]) { result[key] = combineNestedObjects(result[key], translateObjectName(name, config[key])) } else {
        _errorHandler.log(`${key} is missing value`)
        _errorHandler.warn(key, name, 'missing value')
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


const download = () => {
  const Json = jsonObject.value
  const blob = new Blob([JSON.stringify(Json, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = 'data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  console.log('Json', Json)
}
</script>
<style>
.table-data {
  display: grid;
  gap: 20px;
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
</style>
