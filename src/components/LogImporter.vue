<script setup lang="ts">
import { Warning, Copy } from "@vicons/carbon";
import { ref } from "vue";
import TooltipWrapper from "./TooltipWrapper.vue";
import { useMessage } from "naive-ui";
const showModal = ref(false);
const emit = defineEmits(["verifiedLog"]);
const props = defineProps<{ data: Array<Array<string | null | boolean>> }>();



const regex = /(?:this\.)?\$t\('([^'\s]+)'\)/g;
const simulateImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt,.log";
    input.onchange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            handleFileChange({ file: target.files[0] });
        }
    };
    input.click();
};
const result = ref<(string | null)[]>([]);
const dataLog = ref("");
const compareData = (keysExtracted: (string | null)[]) => {
    const keys: [string | null | boolean, true][] = props.data.map((item) => [item[0], true]);
    const mapChec = new Map(keys);

    return keysExtracted
        .map((key) => {
            if (key && !mapChec.has(key)) {
                return key;
            } else {
                return null;
            }
        })
        .filter(Boolean);
};
const findMatching = (text: string, regex: RegExp) => {
    const regexTest = new RegExp(regex, "g");
    const matches = text.match(regexTest) || [];
    const extracted = matches
        .map((match) => {
            const innerMatch = regexTest.exec(match);
            return innerMatch ? innerMatch[1] : null;
        })
        .filter(Boolean);
    return extracted
};
function handleFileChange({ file }: { file: File }) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target?.result as string;
        dataLog.value = text;
        const extracted2 = findMatching(text, regex);
        const extracted = Array.from(new Set([...extracted2]));
        const data = (compareData(extracted));
        emit("verifiedLog", extracted);
        result.value = Array.from(new Set(data)).sort((a, b) => a && b ? a.localeCompare(b) : 0);
    };
    reader.readAsText(file);
}
const message= useMessage()
const verifiedLogTooltip = `   FOR FRONTEND DEVELOPERS:
    Verify the log data.
    1. Click on the "Verify log" button to check the log data for any issues.
    2. Imported log data will be checked for any issues and a report will be generated.
    3. You can view the report in the log viewer.`
    const copyRegex = () => {
    const regexString = regex.toString().replace(/^\/|\/g?$/g, "");
    navigator.clipboard.writeText(regexString);
    message.success("Regex copied to clipboard!");
};
</script>
<template>

    <TooltipWrapper :content="verifiedLogTooltip">
        <n-button @click="showModal = true">
            <template #icon>
                <n-icon>
                    <Warning />
                </n-icon>
            </template>
            Verify Log
        </n-button>
    </TooltipWrapper>

    <n-modal v-model:show="showModal" width="1000">
        <n-card style="width: 1000px" title="Modal" :bordered="false" size="huge" role="dialog" aria-modal="true">
            <n-flex vertical>
                regrex template:
                <n-label>Regex 2: this.$t('...') <code> {{ regex }} </code> <n-button @click="copyRegex"><n-icon>
                            <Copy />
                        </n-icon></n-button> </n-label>


                <n-label>Tải file log lên:</n-label>
                <n-button @click="simulateImport">Upload</n-button>
                Hoặc copy paste log vào đây:
                <n-input v-model:value="dataLog" type="textarea" placeholder="Autosizable" :autosize="{
                    minRows: 3,
                    maxRows: 10,
                }" />
            </n-flex>
            <n-divider />
            <n-scrollbar style="max-height: 250px; overflow: auto">
                <div v-for="text in result">{{ text }}</div>
            </n-scrollbar>
        </n-card>
    </n-modal>
</template>
<style scoped>
code {
    background-color: #f5f5f5;
    padding: 2px 4px;
    border-radius: 4px;
    font-family: monospace;
}
</style>