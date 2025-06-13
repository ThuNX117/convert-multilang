<template>
    <n-flex style="width: 100vw; height: 100%; padding: 10px; box-sizing: border-box;" vertical>



        <n-grid horizontal :cols="12">
            <n-gi :span="4"><n-input v-model:value="filterByJapanese" type="text" placeholder="Basic Input" /></n-gi>

            <n-gi :span="2">
              
            </n-gi>
            <n-gi span="2"> <n-button type="primary" @click="generateTestCase">
                    Generate test case
                </n-button></n-gi>

        </n-grid>
        <n-table :bordered="false" :single-line="false">
            <thead>
                <tr>
                    <th>
                        <n-checkbox @update:checked="handleCheck(null)" />
                    </th>
                    <th v-for="(column, index) in headerConfig" :key="index"
                        :style="{ 'min-width': column.width + 'px' }">
                        {{ column.title }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,) in filteredData" :key="String(item.key)">
                    <td>
                        <n-checkbox @update:checked="handleCheck(item.key)" :checked="checkedKeys[String(item.key)]" />
                    </td>
                    <td>{{ item.no }} </td>
                    <td>{{ item.key }}</td>
                    <td><n-highlight :text="String(item.japanese)" :patterns="filterPatterns" /> <n-button
                            @click="copyText(item.japanese)" size="tiny" type="quaternary">
                            <template #icon>
                                <n-icon>
                                    <Copy />
                                </n-icon>
                            </template>
                        </n-button></td>
                    <td>{{ item.vietnamese }}</td>
                    <td>{{ item.english }}</td>
                    <td>{{ item.chinese }} <n-button @click="copyText(item.thailand)" size="tiny" type="quaternary">
                            <template #icon>
                                <n-icon>
                                    <Copy />
                                </n-icon>
                            </template>
                        </n-button></td>
                    <td>

                        {{ item.thailand }}
                        <n-button @click="copyText(item.thailand)" size="tiny" type="quaternary">
                            <template #icon>
                                <n-icon>
                                    <Copy />
                                </n-icon>
                            </template>
                        </n-button>
                    </td>

                </tr>
                <tr>

                </tr>
            </tbody>
        </n-table>
        <divider />
        <GenerateLogModal ref="testcaseRef" :data="selectedData" />

    </n-flex>
</template>

<script lang="ts" setup>
import { Copy } from '@vicons/carbon';
import { NCheckbox, NHighlight, useMessage } from 'naive-ui'
import { computed, nextTick, ref } from 'vue'
import useMainStore from '../stores';
import { storeToRefs } from 'pinia';
import { configHeader, type LanguageKeyType } from '../types';
import GenerateLogModal from '../components/GenerateLogModal.vue';
const mainStore = useMainStore()

const { translateData } = storeToRefs(mainStore)
const filterByJapanese = ref<string>()
const filterPatterns = computed(() => {
    return filterByJapanese.value ? [filterByJapanese.value] : []
})
type DataType = {
    no: number;
    key: string | boolean | null;
    japanese: string | boolean | null;
    vietnamese: string | boolean | null;
    english: string | boolean | null;
    chinese: string | boolean | null;
    thailand: string | boolean | null;
}
const headerConfig = computed(() => {
    return [
        {
            title: 'no',
            key: 'no',
            width: 20,
        },
        {
            title: 'Key',
            key: 'key',
            width: 200,
        },

        {
            title: 'Japanese',
            key: 'japanese',
            width: 200,

        },
        {
            title: 'Vietnamese',
            key: 'vietnamese',
            width: 200,
        },
        {
            title: 'English',
            key: 'english',
            width: 200,
        },
        {
            title: 'Chinese',
            key: 'chinese',
            width: 200,
        },
        {
            title: 'Thailand',
            key: 'thailand',
            width: 200,
        }
    ]
})
const checkedKeys = ref<Record<string, boolean>>({})
const handleSearch = () => {
    console.log('Searching for:', filterByJapanese.value);
    // You can implement the search logic here if needed
}
const handleCheck = (key: string | boolean | null) => {
    if (!key || typeof key !== 'string') {
        return
    }
    if (checkedKeys.value[key]) {
        delete checkedKeys.value[key]
    } else {
        checkedKeys.value[key] = true
    }
    console.log('Checked keys:', checkedKeys.value);
}
const getCheckedRows = () =>
    translateData.value
        .map((row, idx) => ({ row, idx }))
        .filter(({ row }) => checkedKeys.value[String(row[0])] == true)
        .map(({ row, idx }) => ({ row, idx }));

const selectedData = ref();
const testcaseRef = ref<InstanceType<typeof GenerateLogModal> | null>(null);

const generateTestCase = () => {
    const data = getCheckedRows();
    const result = data.map(({ row, idx }) => {
        const re: Partial<Record<LanguageKeyType | 'key' | 'checked', string | null | boolean>> = {
            key: row[0],
            checked: row[6] || false,
        };
        ['key', ...configHeader, 'checked'].forEach((key, index) => {
            re[key as LanguageKeyType | 'key' | 'checked'] = row[index];
        });
        return { data: re, idx };
    });
    selectedData.value = result;
    nextTick(() => {
        testcaseRef.value?.show();
    });
};
const message = useMessage()

const copyText = (text: string | boolean | null) => {
    navigator.clipboard.writeText(String(text)).then(() => {
        console.log('Text copied to clipboard:', text);
        message.success('Text copied to clipboard: ' + text);
    }).catch(err => {
        console.error('Failed to copy text:', err);
    });
}
const originalData = computed<Array<DataType>>(() => {

    return translateData.value.map((item, index) => {
        const [key, japanese, vietnamese, english, chinese, thailand] = item;
        return {
            no: index + 1,
            key: String(key),
            japanese: japanese,
            vietnamese: vietnamese,
            english: english,
            chinese: chinese,
            thailand: thailand
        }
    })
})
const filteredData = computed(() => {
    return originalData.value.filter(item => {
        return typeof item.japanese == 'string' && item.japanese.includes(filterByJapanese.value || '')
    })
})





</script>