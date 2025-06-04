<script setup lang="ts">
import { computed, ref } from "vue";
import useMainStore from "../stores";
import { storeToRefs } from "pinia";
const showModal = ref(false);
const mainStore = useMainStore();
const { translateData } = storeToRefs(mainStore)
const keyword = ref('')
const filteredData = computed(() => {
    return translateData.value
        .filter(data => String(data[1] || '').search(keyword.value) != -1)
        .map(item => {
            return { data: item, id: Math.floor(Math.random() * 10000) + 1 }
        }).splice(0, 100);
})
const props=defineProps<{    show: boolean}>()


</script>
<template>
    <n-modal :show="props.show" width="1000">
        <n-card style="width: 1000px" title="Modal" :bordered="false" size="huge" role="dialog" aria-modal="true">


            <n-flex vertical>
                <n-input v-model:value="keyword" type="text" placeholder="Enter your text here" />
            </n-flex>
            <n-divider />
            Preview:
            <n-scrollbar style="max-height: 600px; overflow-y: auto;">


                <table>
                    <tbody>
                        <tr v-for="row in filteredData" :key="row.id">
                            <td v-for="item in row.data">
                                <span>
                                    {{ item }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </n-scrollbar>
        </n-card>
    </n-modal>
</template>