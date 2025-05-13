<template>
    <n-collapse style="width: 100%;" :trigger-areas="['extra']">
        <n-collapse-item name="vie" v-for="(item, index) in configHeader" :key="index">
            <template #header>
                <div class="header-json" @click="currentOpen = item">
                    {{ item.toUpperCase() }} JSON Preview
                    <div class="actions">

                        <n-popover trigger="click">
                            <template #trigger>
                                <n-badge :value="logger[item].length">
                                    <n-icon class="badge-btn ">
                                        <Warning style="height: 24px; width: 24px;;;" />
                                    </n-icon>
                                </n-badge>
                            </template>
                            <div class="error-log">
                                <div v-for="value in logger[item]">{{ value }}</div>
                            </div>
                        </n-popover>

<n-button @click="emitDownload(item)" type="info"> Download</n-button>

                    </div>
                </div>
            </template>
            <template #header-extra="{ collapsed }">
                <n-button>
                    <n-icon>
                        <ExpandAll v-if="collapsed" />
                        <CollapseAll v-else />

                    </n-icon>
                </n-button>

            </template>
            <div class="json-viewer">
                <andypf-json-viewer indent="2" expanded="true" theme="default-light" show-data-types="true"
                    show-toolbar="false" expand-icon-type="arrow" show-copy="true" show-size="true"
                    :data='props.object[item]'></andypf-json-viewer>
            </div>
        </n-collapse-item>
    </n-collapse>
</template>

<script setup lang="ts">
import { Warning, ExpandAll, CollapseAll } from '@vicons/carbon'

import "@andypf/json-viewer"
import { ref } from "vue";

type LanguageKeyType = 'vie' | 'thai' | 'eng' | 'jap' | 'cn'
const currentOpen = ref<LanguageKeyType>('vie')
const configHeader: Array<LanguageKeyType> = ['vie', 'thai', 'eng', 'jap', 'cn']

const props = defineProps({
    object: {
        type: Object,
        required: true,
    },
    logger: {
        type: Object, required: true
    }
});
const emits = defineEmits(['download']);
const emitDownload = (type: 'thai' | 'cn' | 'vie' | 'jap' | 'eng') => {
    emits('download', type);
};

</script>

<style scoped>
.json-viewer {
    padding: 10px;
    border-radius: 5px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    max-height: 300px ;
    overflow: auto;
}

.actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;

}

.error-log {
    max-width: 300px;
    display: flex;
    flex-direction: column;
    max-height: 500px;
    overflow: auto;
    gap: 4px;

}
.header-json{
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 0 12px;;
}

.error-log>div {
    border-bottom: 1px solid #dcdcdc;
}
</style>