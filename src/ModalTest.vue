<template>

    <n-modal v-model:show="showModal" :on-after-leave="props.onClose">
        <n-card style="max-width: 1000px; overflow: auto;" :bordered="false" size="huge" role="dialog"
            aria-modal="true">
            {{ props.data?.msg }}
            <!-- <andypf-json-viewer indent="2" expanded="true" theme="default-light" show-data-types="true"
                show-toolbar="false" expand-icon-type="arrow" show-copy="true" show-size="true"
                :data='props.data'></andypf-json-viewer> -->
            <n-flex style="max-width: 900px; overflow: auto;">
                <n-table :bordered="false" :single-line="false" style="">
                    <thead>
                        <tr>
                            <th>p</th>
                           
                            <th>Measured</th>
                            <th>...</th>
                        </tr>
                    </thead>

                    <tbody v-if="props.data && props.data.data.config">

                        <tr v-for="(item, index) in langConfig" :key="index">
                            <td>
                                {{ item }}
                            </td>
                            <td>
                                <div class="wrapper">
                                    <p>{{ props.data.data.config[item] }}</p>
                                </div>
                            </td>
                            <!-- <td>
                                <div class="wrapper">
                                    <h2>{{ props.data.data.config[item] }}</h2>
                                </div>
                            </td>
                            <td>
                                <div class="wrapper">
                                    <h4>{{ props.data.data.config[item] }}</h4>
                                </div>
                            </td> -->
                            <td v-if=props.data.data.measure>{{ props.data.data.measure[item]?.toFixed(2) }}px</td>

                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="3">
                                <p>Loading...</p>
                            </td>
                        </tr>
                    </tbody>
                </n-table>

            </n-flex>
            <template #footer>
                <n-button @click="showModal = false">
                    Close
                </n-button>
            </template>
        </n-card>
    </n-modal>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

import { onMounted } from 'vue';
import { useMessage } from 'naive-ui'
type LanguageKeyType = 'vie' | 'thai' | 'eng' | 'jap' | 'cn';
const langConfig: LanguageKeyType[] = ['jap', 'eng', 'vie', 'thai', 'cn']
type Props = {
    onClose: any
    showModal: boolean
    data?: {
        msg: string,
        data: {
            result: {
                cn: number;
                thai: number;
            };
            min: number;
            max: number;
            config: {
                vie: string;
                thai: string;
                eng: string;
                jap: string;
                cn: string;
            };
            measure: {
                vie: number;
                thai: number;
                eng: number;
                jap: number;
                cn: number;
            };
        }
    }
}
const props = defineProps<Props>()
const showModal = ref(false)

watch(
    () => props.showModal,
    (newVal) => {
        showModal.value = newVal
    }
)
const message = useMessage()
onMounted(() => {
    const handleDoubleClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.classList.contains('wrapper')) {
            event.preventDefault()
            event.stopImmediatePropagation()
            const content = target.textContent?.trim();
            if (content) {
                navigator.clipboard.writeText(content).then(() => {
                    console.log('Copied to clipboard:', content);
                    message.success('Copied to clipboard:' + content)
                }).catch(err => {
                    console.error('Failed to copy:', err);
                });
            }
        }
    };

    document.addEventListener('dblclick', handleDoubleClick);

    // Cleanup event listener on unmount
    return () => {
        document.removeEventListener('dblclick', handleDoubleClick);
    };
});

// content

</script>
<style>
.wrapper {

    background: #dcdcdcdc;

    width: max-content;
}

p {
    font-family: 'Noto Sans JP', Meiryo, sans-serif;
    font-size: 14px;
    color: #666;
    margin: 0;
    padding: 0;
    background: #F4F7FB;
    box-sizing: border-box;

}

p,
h2,
h4 {
    margin: 2px 0;

    pointer-events: none;
}

.n-modal .n-table td {
    padding: 0
}
</style>