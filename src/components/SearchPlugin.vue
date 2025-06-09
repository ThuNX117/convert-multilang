<script lang="ts" setup>
import { ref, computed } from 'vue';
import { type LanguageKeyType, configHeader, LangKey } from '../types';
import { ChevronUp, ChevronDown, Clean, Magnify } from '@vicons/carbon';
const keyword = ref("");
const searchLanguage = ref<LanguageKeyType>('jap')
const searchCategory = computed(() => {
    return configHeader.map((key) => ({ label: LangKey[key], value: key }))
})

const onShowSearch = () => {
emits('onSearch',{language:searchLanguage.value, keyword:keyword.value})
}
const toNextSearch=()=>{
emits('next')

}
const toPreviousSearch=()=>{
emits('prev')

}
const clearSearch=()=>{
emits('clear')
keyword.value=""
}
const emits=defineEmits(['onSearch', 'next', "prev","clear"])

</script>
<template>
    <n-grid x-gap="12" :cols="12">
        <n-gi :span="2">
            <n-select v-model:value="searchLanguage" :options="searchCategory" placeholder="Select log type" disabled  />
        </n-gi>
        <n-gi :span="7">


            <n-button-group>
                <n-input v-model:value="keyword" type="text" placeholder="Nhập từ khóa tìm kiếm">

                    <template #prefix>
                        <n-icon>
                            <Magnify />
                        </n-icon>
                    </template>
                </n-input>
                <n-button default @click="toPreviousSearch">
                    <template #icon>
                        <n-icon>
                            <ChevronUp />
                        </n-icon>
                    </template>
                </n-button>
                <n-button default @click="toNextSearch">
                    <template #icon>
                        <n-icon>
                            <ChevronDown />
                        </n-icon>
                    </template>
                </n-button>
                <n-button :disabled="!(keyword.length>0)" @click="clearSearch"><template #icon>
                        <n-icon>
                            <Clean />
                        </n-icon>
                    </template> </n-button>



                <n-button @click="onShowSearch" default>Search</n-button>
            </n-button-group>
        </n-gi>
        <n-gi :span="2">
            <slot></slot>
        </n-gi>
    </n-grid>
</template>