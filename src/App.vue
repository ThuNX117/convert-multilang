<template>
  <div class="table-data">

    <div class="ht-theme-main-dark-auto" style="height:100vh; width: 800px; overflow: auto;">
      <div class="header">
        Input CSV
        <button @click="convertToJson"> Convert</button>
      </div>
      <hot-table :data="data" :rowHeaders="true" :colHeaders="true"></hot-table>
    </div>
    <div class="preview" style="height:100vh; width: 800px; overflow: auto;">
      <div class="header">
       Preview JSON
        <button @click="download"> download</button>
      </div>
      <PreviewJson :object="jsonObject" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
// @ts-ignore
import PreviewJson from './PreviewJson.vue';
import { HotTable } from '@handsontable/vue3';
// @ts-ignore
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';
import { translateObjectName } from './plugins/convert';
import { sampleData } from './data';


registerAllModules();

const data = ref(sampleData);
const jsonObject=ref({})
watch(data, () => {
  convertToJson()
}, { deep: true });
const convertToJson = () => {
  const dataRaw = data.value
  console.log('dataRaw', dataRaw)
  let result = {}
  dataRaw.forEach((row) => {
    const [name, data]=row
    const res = translateObjectName(name, data)
    // result = { ...result, ...res }
    result=  combineNestedObjects(result, res)
  });
  jsonObject.value = result
  console.log('result', jsonObject)
  return result

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


const download =(Json:any)=>{
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
<style scoped>
.table-data {
  display: grid;
  grid-template-columns: 800px 800px;

}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
</style>
