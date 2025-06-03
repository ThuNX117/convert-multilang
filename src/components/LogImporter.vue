<script setup lang="ts">
    import { Warning } from "@vicons/carbon";
    import { ref } from "vue";
    const showModal = ref(false);
    const emit = defineEmits(["verifiedLog"]);
    const props = defineProps<{ data: Array<Array<string>> }>();
    // Regex to match everything between [$t('...')]
    const keywordRegex = /\$t\('([^'\s]+)'\)/g;
    const keyword = ref(keywordRegex);
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
        console.log("compareData", props.data);
        const keys: [string, true][] = props.data.map((item) => [item[0], true]);
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

    function handleFileChange({ file }: { file: File }) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            dataLog.value = text;
            const regex = new RegExp(keyword.value, "g");
            const matches = text.match(regex) || [];
            console.log("Matches found:", matches);
            const extracted = matches
                .map((match) => {
                    const innerMatch = /\$t\('([^'\s]+)'\)/.exec(match);
                    return innerMatch ? innerMatch[1] : null;
                })
                .filter(Boolean);
            console.log("Extracted keywords:", extracted);
            const data = (compareData(extracted));
            emit("verifiedLog", extracted);
            result.value = Array.from(new Set(data)).sort((a, b) => a&&b? a.localeCompare(b):0);
        };
        reader.readAsText(file);
    }
</script>
<template>
    <n-button size="small" tertiary @click="showModal = true">
        <template #icon>
            <n-icon>
                <Warning />
            </n-icon>
        </template>
        verify Log
    </n-button>

    <n-modal v-model:show="showModal" width="1000">
        <n-card
            style="width: 1000px"
            title="Modal"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
        >
            <n-flex vertical>
                <n-label>Nhập từ khóa để tìm kiếm lỗi:</n-label>
                <n-input disabled type="text" placeholder="keywords" :value="keyword" />
                <n-label>Tải file log lên:</n-label>
                <n-button @click="simulateImport">Upload</n-button>
                Hoặc copy paste log vào đây:
                <n-input
                    v-model:value="dataLog"
                    type="textarea"
                    placeholder="Autosizable"
                    :autosize="{
                        minRows: 3,
                        maxRows: 10,
                    }"
                />
            </n-flex>
            <n-divider />
            <n-scrollbar style="max-height: 250px; overflow: auto">
                <div v-for="text in result">{{ text }}</div>
            </n-scrollbar>
        </n-card>
    </n-modal>
</template>
