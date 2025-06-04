<script setup lang="ts">
import { ref } from "vue";
import { generateTestcase } from "../plugins/generateTestcase";
import { useMessage } from "naive-ui";
const message = useMessage()
type LanguageKeyType = "vie" | "thai" | "eng" | "jap" | "cn";
const showModal = ref(false);
const scope = ref("");
const context = ref("");
const lang = ref<LanguageKeyType>("thai");
const url = ref("");
const props = defineProps<{ data: any }>()
defineExpose({
    show: () => (showModal.value = true),
    hide: () => {
        showModal.value = false; clearup()
    },
});
const previewText = ref<Array<string>>([])
const handleGenerate = () => {
    const data = props.data.map(({ data, }: { data: any, idx: number }) => {
        return [data['jap'], data[lang.value]]
    })
    const previewData = generateTestcase({
        lang: lang.value,
        context: context.value,
        scope: scope.value,
        url: url.value,
        data: data,
    });
    previewText.value = previewData
    message.success("Đã copy vào clipboard",{})
};
const clearup = () => {
    previewText.value = []
}
</script>
<template>
    <n-modal v-model:show="showModal" width="1000">
        <n-card style="width: 1000px" title="Modal" :bordered="false" size="huge" role="dialog" aria-modal="true">


            <n-flex vertical>
                <n-form>
                    <n-flex>
                        <n-form-item label="Input Text">
                            <n-radio-group v-model:value="lang">
                                <n-radio value="thai">Tiếng Thái</n-radio>
                                <n-radio value="cn">Tiếng Trung</n-radio>
                            </n-radio-group>
                        </n-form-item>
                        <n-form-item label="Màn hình hoặc phạm vi">
                            <n-input v-model:value="scope" type="text" placeholder="Enter your text here" />
                        </n-form-item>
                        <n-form-item label="URL">
                            <n-input v-model:value="url" type="text" placeholder="Enter your text here" rows="5" />
                        </n-form-item>
                    </n-flex>
                    <n-form-item label="Ngữ cảnh">
                        <n-input v-model:value="context" type="textarea" placeholder="Enter your text here" rows="5" />
                    </n-form-item>
                    <n-form-item>
                        <n-button type="primary" :disabled="!scope || !context || !lang" @click="handleGenerate">
                            generate and copy
                        </n-button>
                    </n-form-item>
                </n-form>
            </n-flex>
            <n-divider />
            Preview:
            <table>
                <tbody>
                    <tr>
                        <td v-for="item in previewText">
                            <span>
                                {{ item }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </n-card>
    </n-modal>
</template>
