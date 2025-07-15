<template>
    <div class="backend-interface">
        <div class="header">
            <h2>Multi-Language JSON Key-Label Extractor</h2>
            <p>Enter your JSON data in the same format across different languages. The system will merge them into multi-language arrays.</p>
        </div>
        
        <div class="json-inputs-container">
            <div class="json-input-section" v-for="(input, index) in jsonInputs" :key="index">
                <div class="input-header">
                    <h3>Language {{ index + 1 }} JSON</h3>
                    <div class="input-actions">
                        <n-button 
                            size="small" 
                            @click="validateJson(index)" 
                            :type="input.isValid ? 'success' : 'default'"
                        >
                            Validate
                        </n-button>
                        <n-button 
                            size="small" 
                            @click="clearInput(index)" 
                            type="warning"
                        >
                            Clear
                        </n-button>
                        <n-button 
                            size="small" 
                            @click="formatJson(index)" 
                            type="info"
                        >
                            Format
                        </n-button>
                    </div>
                </div>
                
                <n-input
                    v-model:value="input.value"
                    type="textarea"
                    :placeholder="`Enter JSON data for Language ${index + 1}...`"
                    :rows="12"
                    :status="input.isValid === false ? 'error' : undefined"
                    @input="onInputChange(index)"
                    class="json-textarea"
                />
                
                <div v-if="input.error" class="error-message">
                    <n-alert type="error" :show-icon="true">
                        {{ input.error }}
                    </n-alert>
                </div>
                
                <div v-if="input.isValid" class="success-message">
                    <n-alert type="success" :show-icon="true">
                        Valid JSON format
                    </n-alert>
                </div>
            </div>
        </div>
        
        <div class="actions">
            <n-button type="primary" size="large" @click="processAllInputs">
                Extract Multi-Language Pairs
            </n-button>
            <n-button size="large" @click="resetAll">
                Reset All
            </n-button>
            <n-button size="large" @click="downloadResults" :disabled="extractedArray.length === 0">
                Download Results
            </n-button>
        </div>
        
        <!-- Results Display Section -->
        <div v-if="extractedArray.length > 0" class="results-section">
            <div class="results-header">
                <h3>Extracted Key-Label Pairs ({{ extractedArray.length }} items)</h3>
                <div class="results-actions">
                    <n-button size="small" @click="copyToClipboard" type="info">
                        Copy to Clipboard
                    </n-button>
                    <n-button size="small" @click="clearResults" type="warning">
                        Clear Results
                    </n-button>
                </div>
            </div>
            
            <div class="results-tabs">
                <n-tabs default-value="array" type="line">
                    <n-tab-pane name="array" tab="Array Format">
                        <div class="results-content">
                            <pre class="results-code">{{ JSON.stringify(extractedArray, null, 2) }}</pre>
                        </div>
                    </n-tab-pane>
                    <n-tab-pane name="table" tab="Table View">
                        <div class="results-table">
                            <n-data-table
                                :columns="tableColumns"
                                :data="tableData"
                                :pagination="{
                                    pageSize: 20
                                }"
                                :max-height="400"
                            />
                        </div>
                    </n-tab-pane>
                    <n-tab-pane name="hash" tab="Hash Map">
                        <div class="results-content">
                            <pre class="results-code">{{ JSON.stringify(Object.fromEntries(Array.from(extractedHashMap.entries())), null, 2) }}</pre>
                        </div>
                    </n-tab-pane>
                </n-tabs>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { NInput, NButton, NAlert, NTabs, NTabPane, NDataTable, useMessage } from 'naive-ui'

interface JsonInput {
    value: string
    isValid: boolean | null
    error: string | null
    parsedData: any
}

const message = useMessage()

// Initialize 3 JSON input holders
const jsonInputs = reactive<JsonInput[]>([
    { value: '', isValid: null, error: null, parsedData: null },
    { value: '', isValid: null, error: null, parsedData: null },
    { value: '', isValid: null, error: null, parsedData: null }
])

const onInputChange = (index: number) => {
    // Reset validation state when user types
    jsonInputs[index].isValid = null
    jsonInputs[index].error = null
}

const validateJson = (index: number) => {
    const input = jsonInputs[index]
    
    if (!input.value.trim()) {
        input.error = 'Input cannot be empty'
        input.isValid = false
        return false
    }
    
    try {
        input.parsedData = JSON.parse(input.value)
        input.isValid = true
        input.error = null
        message.success(`JSON Input ${index + 1} is valid`)
        return true
    } catch (error) {
        input.isValid = false
        input.error = error instanceof Error ? error.message : 'Invalid JSON format'
        message.error(`JSON Input ${index + 1} has invalid format`)
        return false
    }
}

const clearInput = (index: number) => {
    jsonInputs[index].value = ''
    jsonInputs[index].isValid = null
    jsonInputs[index].error = null
    jsonInputs[index].parsedData = null
    message.info(`JSON Input ${index + 1} cleared`)
}

const formatJson = (index: number) => {
    const input = jsonInputs[index]
    
    if (!input.value.trim()) {
        message.warning('Cannot format empty input')
        return
    }
    
    try {
        const parsed = JSON.parse(input.value)
        input.value = JSON.stringify(parsed, null, 2)
        input.isValid = true
        input.error = null
        input.parsedData = parsed
        message.success(`JSON Input ${index + 1} formatted successfully`)
    } catch (error) {
        message.error('Cannot format invalid JSON')
    }
}

// Hash map to store extracted multi-language key-label pairs
const extractedHashMap = ref<Map<string, string[]>>(new Map())
const extractedArray = ref<[string, ...string[]][]>([])

// Function to extract nested key-label pairs from hierarchical JSON
const extractKeyLabelPairs = (data: any[]): Map<string, string> => {
    const keyLabelMap = new Map<string, string>()
    
    if (!Array.isArray(data)) {
        throw new Error('Expected an array of category objects')
    }
    
    data.forEach((category: any) => {
        if (!category.key || !category.label) {
            throw new Error('Each category must have "key" and "label" properties')
        }
        
        // Add main category
        keyLabelMap.set(category.key, category.label)
        
        // Process nested items if they exist
        if (category.items && Array.isArray(category.items)) {
            category.items.forEach((item: any) => {
                if (!item.key || !item.label) {
                    throw new Error('Each item must have "key" and "label" properties')
                }
                
                // Create nested key format: parent.child
                const nestedKey = `${category.key}.${item.key}`
                keyLabelMap.set(nestedKey, item.label)
            })
        }
    })
    
    return keyLabelMap
}

// Function to merge multiple language maps into multi-language arrays
const mergeMultiLanguageMaps = (languageMaps: Map<string, string>[]): [string, ...string[]][] => {
    const allKeys = new Set<string>()
    
    // Collect all unique keys from all language maps
    languageMaps.forEach(map => {
        map.forEach((_, key) => allKeys.add(key))
    })
    
    // Create multi-language arrays
    const mergedArray: [string, ...string[]][] = []
    
    allKeys.forEach(key => {
        const labels: string[] = languageMaps.map(map => map.get(key) || '')
        mergedArray.push([key, ...labels])
    })
    
    // Sort by key for consistent output
    mergedArray.sort((a, b) => a[0].localeCompare(b[0]))
    
    return mergedArray
}

// Function to create hash map from multi-language pairs
const createMultiLanguageHashMap = (pairs: [string, ...string[]][]): Map<string, string[]> => {
    const hashMap = new Map<string, string[]>()
    
    pairs.forEach(([key, ...labels]) => {
        hashMap.set(key, labels)
    })
    
    return hashMap
}

const processAllInputs = () => {
    let allValid = true
    const validInputs: any[] = []
    const languageMaps: Map<string, string>[] = []
    
    for (let i = 0; i < jsonInputs.length; i++) {
        if (validateJson(i)) {
            validInputs.push(jsonInputs[i].parsedData)
            
            try {
                // Extract key-label pairs from each valid input
                const languageMap = extractKeyLabelPairs(jsonInputs[i].parsedData)
                languageMaps.push(languageMap)
            } catch (error) {
                message.error(`Error extracting data from Input ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`)
                allValid = false
            }
        } else {
            allValid = false
        }
    }
    
    if (allValid && languageMaps.length > 0) {
        // Merge all language maps into multi-language arrays
        const mergedPairs = mergeMultiLanguageMaps(languageMaps)
        extractedArray.value = mergedPairs
        extractedHashMap.value = createMultiLanguageHashMap(mergedPairs)
        
        const languageCount = languageMaps.length
        const totalKeys = mergedPairs.length
        
        message.success(`Successfully processed ${totalKeys} keys from ${languageCount} language(s) across ${validInputs.length} JSON inputs`)
        console.log('Extracted multi-language pairs:', mergedPairs)
        console.log('Multi-language hash map:', extractedHashMap.value)
        console.log('Processed JSON data:', validInputs)
    } else {
        message.error('Please fix invalid JSON inputs before processing')
    }
}

const resetAll = () => {
    for (let i = 0; i < jsonInputs.length; i++) {
        clearInput(i)
    }
    message.info('All inputs have been reset')
}

// Table configuration for displaying multi-language results
const tableColumns = [
    {
        title: 'Key',
        key: 'key',
        width: 200,
        ellipsis: {
            tooltip: true
        },
        fixed: 'left' as const
    },
    {
        title: 'Language 1',
        key: 'lang1',
        width: 200,
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: 'Language 2',
        key: 'lang2',
        width: 200,
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: 'Language 3',
        key: 'lang3',
        width: 200,
        ellipsis: {
            tooltip: true
        }
    }
]

const tableData = computed(() => {
    return extractedArray.value.map(([key, ...labels], index) => ({
        id: index,
        key,
        lang1: labels[0] || '',
        lang2: labels[1] || '',
        lang3: labels[2] || ''
    }))
})

// Utility functions for results display
const copyToClipboard = async () => {
    try {
        const text = JSON.stringify(extractedArray.value, null, 2)
        await navigator.clipboard.writeText(text)
        message.success('Results copied to clipboard')
    } catch (error) {
        message.error('Failed to copy to clipboard')
    }
}

const downloadResults = () => {
    const data = {
        array: extractedArray.value,
        hashMap: Object.fromEntries(Array.from(extractedHashMap.value.entries())),
        languageCount: Math.max(...extractedArray.value.map(([, ...labels]) => labels.length)),
        totalKeys: extractedArray.value.length,
        timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `multi-language-key-label-pairs-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    message.success('Multi-language results downloaded successfully')
}

const clearResults = () => {
    extractedArray.value = []
    extractedHashMap.value.clear()
    message.info('Results cleared')
}
</script>

<style scoped lang="scss">
.backend-interface {
    padding: 24px;
   
    margin: 0 auto;
    
    .header {
        text-align: center;
        margin-bottom: 32px;
        
        h2 {
            color: #333;
            margin-bottom: 8px;
        }
        
        p {
            color: #666;
            font-size: 14px;
        }
    }
    
    .json-inputs-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 24px;
        margin-bottom: 32px;
        
        .json-input-section {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 16px;
            background: #fafafa;
            
            .input-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
                
                h3 {
                    margin: 0;
                    color: #333;
                    font-size: 16px;
                }
                
                .input-actions {
                    display: flex;
                    gap: 8px;
                }
            }
            
            .json-textarea {
                margin-bottom: 12px;
                
                :deep(.n-input__textarea) {
                    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                    font-size: 13px;
                    line-height: 1.4;
                }
            }
            
            .error-message,
            .success-message {
                margin-top: 8px;
            }
        }
    }
    
    .actions {
        display: flex;
        justify-content: center;
        gap: 16px;
        padding-top: 24px;
        border-top: 1px solid #e0e0e0;
    }
    
    .results-section {
        margin-top: 32px;
        padding: 24px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        background: #f9f9f9;
        
        .results-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            
            h3 {
                margin: 0;
                color: #333;
                font-size: 18px;
            }
            
            .results-actions {
                display: flex;
                gap: 8px;
            }
        }
        
        .results-tabs {
            background: white;
            border-radius: 4px;
        }
        
        .results-content {
            padding: 16px;
            max-height: 500px;
            overflow: auto;
            
            .results-code {
                margin: 0;
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                font-size: 12px;
                line-height: 1.4;
                color: #333;
                background: #f8f8f8;
                padding: 16px;
                border-radius: 4px;
                border: 1px solid #e0e0e0;
                white-space: pre-wrap;
                word-break: break-all;
            }
        }
        
        .results-table {
            padding: 16px;
        }
    }
}

@media (max-width: 768px) {
    .backend-interface {
        padding: 16px;
        
        .json-inputs-container {
            grid-template-columns: 1fr;
        }
        
        .actions {
            flex-direction: column;
            align-items: center;
        }
        
        .results-section {
            .results-header {
                flex-direction: column;
                gap: 12px;
                align-items: flex-start;
                
                .results-actions {
                    width: 100%;
                    justify-content: center;
                }
            }
            
            .results-content .results-code {
                font-size: 11px;
            }
        }
    }
}
</style>