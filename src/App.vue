<template>
  <div class="table-data">

    <div class="ht-theme-main-dark-auto" style="height:100vh; width: 800px; overflow: auto;">
      <div class="header">
        Input CSV
        <div @click="convert"> download</div>
      </div>
      <hot-table :data="data" :rowHeaders="true" :colHeaders="true"></hot-table>
    </div>
    <div class="preview" style="height:100vh; width: 800px;">
      <div class="header">
        Preview Json
        <button> download</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { HotTable } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';
import { translateObjectName } from './plugins/convert';


registerAllModules();

const data = ref(Array.from({ length: 10 }, () => Array(10).fill('')));

watch(data, (newValue) => {
  console.log('Data changed:', newValue);
}, { deep: true });
const convertToJson = () => {
  const dataRaw = data.value
  console.log('dataRaw', dataRaw)
  let result = {}
  dataRaw.forEach((row) => {
    const res = translateObjectName(row[0], row[1])
    // result = { ...result, ...res }
    result=  combineNestedObjects(result, res)
  });
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
const convert = () => {
  const Json = convertToJson()
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
