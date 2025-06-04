<script setup lang="ts">
import { computed, ref, watch } from "vue";
import useMainStore from "../stores";
import { storeToRefs } from "pinia";

const mainStore = useMainStore();
const { translateData } = storeToRefs(mainStore)
const keyword = ref('')
const filteredData = ref<Array<{ data: string[], id: number }>>([]);
const handleSearch = (() => {
    if (keyword.value.length == 0) {
        return []
    }
    const result = translateData.value
        .filter(data => data[1] && String(data[1] || '')?.search(keyword.value) != -1)
        ?.map(item => {
            return { data: item, id: Math.floor(Math.random() * 10000) + 1 }
        }) || []
    return JSON.parse(JSON.stringify(result));
})
watch(keyword, () => {
    filteredData.value = handleSearch();
    console.log("Search result:", filteredData.value);

}, { immediate: true });
defineExpose({
    show: () => (showModal.value = true),
    hide: () => {
        showModal.value = false;

    },
});
const showModal = ref(false);
</script>
<template>
    <n-modal v-model:show="showModal" width="1000">
        <n-card style="width: 1000px" title="Modal" :bordered="false" size="huge" role="dialog" aria-modal="true">


            <n-flex vertical>
                <n-input v-model:value="keyword" type="text" placeholder="Enter your text here" />
            </n-flex>
            <n-divider />
            Preview: {{ filteredData.length }} results found for "{{ keyword }}"

            <div style="height: 500px; width: 100%; overflow: auto;">

               
                <table>
                    <tbody>
                        <tr v-for="row in filteredData" :key="row.id">
                            <td v-for="item in row.data" :key="item">
                                <n-highlight :text="item" :patterns="[keyword]" />
                              
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </n-card>
    </n-modal>
</template>