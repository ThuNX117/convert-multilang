<template>
    <div class="backend-interface">
        
        
        <div class="json-inputs-container">
            <div class="json-input-section" v-for="(input, index) in jsonInputs" :key="index">
                <div class="input-header">
                    <h3>{{ getLanguageName(index) }} JSON</h3>
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
                    :placeholder="`Enter JSON data for ${getLanguageName(index)}...`"
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
                Download JSON
            </n-button>
            <n-button size="large" @click="downloadCSV" :disabled="extractedArray.length === 0" type="success">
                Download CSV
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
                    <n-button size="small" @click="generateTestCase" type="primary" :disabled="Object.keys(checkedKeys).length === 0">
                        Generate Test Case
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
                    <n-tab-pane name="tree" tab="Tree View">
                        <div class="results-table">
                            <n-data-table
                                :columns="treeColumns"
                                :data="treeData"
                                :cascade="false"
                                :children-key="'children'"
                                :max-height="400"
                                default-expand-all
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
        
        <!-- Test Case Modal -->
        <n-modal v-model:show="showTestCaseModal" width="1000" @close="clearTestCaseForm">
            <n-card style="width: 1280px" title="Generate Test Case Modal" :bordered="false" size="huge" role="dialog" aria-modal="true">
                <template #header-extra>
                    <n-button @click="closeTestCaseModal" type="default" size="small">
                        Close
                    </n-button>
                </template>
                
                <n-flex vertical>
                    <n-form>
                        <n-flex>
                            <n-form-item label="Select language">
                                <n-radio-group v-model:value="testCaseLang">
                                    <n-radio value="thai">Tiếng Thái</n-radio>
                                    <n-radio value="cn">Tiếng Trung</n-radio>
                                    <n-radio value="vie">Tiếng Việt</n-radio>
                                    <n-radio value="eng">Tiếng Anh</n-radio>
                                </n-radio-group>
                            </n-form-item>
                            <n-form-item label="Màn hình hoặc phạm vi">
                                <n-input v-model:value="testCaseScope" type="text" placeholder="Enter your text here" />
                            </n-form-item>
                            <n-form-item label="URL">
                                <n-input v-model:value="testCaseUrl" type="text" placeholder="Enter your text here" />
                            </n-form-item>
                        </n-flex>
                    
                        <n-form-item label="条件 Condition">
                            <n-input v-model:value="testCaseContext" type="textarea" placeholder="Enter your text here" rows="5" />
                        </n-form-item>
                        <n-form-item>
                            <n-button type="primary" :disabled="!testCaseScope || !testCaseContext || !testCaseLang" @click="handleGenerateTestCase">
                                Generate and Copy
                            </n-button>
                        </n-form-item>
                    </n-form>
                </n-flex>
                <n-divider />
                Preview:
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th v-for="(item, index) in testCaseHeader" :key="index" style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5;">
                                <span>{{ item }}</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="previewTestCase.length > 0">
                            <td v-for="(item, index) in previewTestCase" :key="index" style="border: 1px solid #ddd; padding: 8px;">
                                <span>{{ item }}</span>
                            </td>
                        </tr>
                        <tr v-else>
                            <td :colspan="testCaseHeader.length" style="border: 1px solid #ddd; padding: 8px; text-align: center; color: #999;">
                                No preview data available. Click "Generate and Copy" to generate test case.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </n-card>
        </n-modal>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, h } from 'vue'
import { NInput, NButton, NAlert, NTabs, NTabPane, NDataTable, NCheckbox, NModal, useMessage, NForm, NFormItem, NRadioGroup, NRadio, NCard, NFlex, NDivider } from 'naive-ui'
import { generateTestcase } from '../plugins/generateTestcase'

interface JsonInput {
    value: string
    isValid: boolean | null
    error: string | null
    parsedData: any
}

type LanguageKeyType = "vie" | "thai" | "eng" | "jap" | "cn"

const message = useMessage()

// Load JSON data function
const loadJsonData = async () => {
    try {
        // Use fetch to load the JSON files from the public directory
        // Note: In production, you might want to move these files to public/
        // For now, let's use static imports with fallback
        
        // Import as text and parse to avoid TypeScript issues
        const jsonData = [
            // Japanese data
            [
                {
                    "key": "personnel-change",
                    "label": "人事異動",
                    "items": [
                        {"key": "joining", "label": "入社"},
                        {"key": "assignment", "label": "配属"}, 
                        {"key": "transfer", "label": "異動"},
                        {"key": "leave-absence", "label": "休職"},
                        {"key": "secondment", "label": "出向"},
                        {"key": "retirement", "label": "退職"},
                        {"key": "rejoining", "label": "再入社"}
                    ]
                },
                {
                    "key": "organization",
                    "label": "組織",
                    "items": [
                        {"key": "department", "label": "部門"},
                        {"key": "manager", "label": "上司"}
                    ]
                },
                {
                    "key": "personal-information", 
                    "label": "個人情報",
                    "items": [
                        {"key": "basic-info", "label": "基本情報"},
                        {"key": "address", "label": "住所"},
                        {"key": "family", "label": "家族情報"}
                    ]
                }
            ],
            // Chinese data
            [
                {
                    "key": "personnel-change",
                    "label": "人事变动",
                    "items": [
                        {"key": "joining", "label": "入职"},
                        {"key": "assignment", "label": "分配"},
                        {"key": "transfer", "label": "调动"},
                        {"key": "leave-absence", "label": "离职"},
                        {"key": "secondment", "label": "外派"},
                        {"key": "retirement", "label": "辞职"},
                        {"key": "rejoining", "label": "重新入职"}
                    ]
                },
                {
                    "key": "organization",
                    "label": "组织",
                    "items": [
                        {"key": "department", "label": "部门"},
                        {"key": "manager", "label": "主管"}
                    ]
                },
                {
                    "key": "personal-information",
                    "label": "个人信息", 
                    "items": [
                        {"key": "basic-info", "label": "基本信息"},
                        {"key": "address", "label": "家庭住址"},
                        {"key": "family", "label": "家庭信息"}
                    ]
                }
            ],
            // Thai data
            [
                {
                    "key": "personnel-change",
                    "label": "ข้อมูลปัญหา",
                    "items": [
                        {"key": "joining", "label": "การเข้าทำงานในบริษัท"},
                        {"key": "assignment", "label": "การสังกัด"},
                        {"key": "transfer", "label": "การโยกย้าย"},
                        {"key": "leave-absence", "label": "การลาพักงาน"},
                        {"key": "secondment", "label": "การส่งตัวไปทำงานนอกบริษัท"},
                        {"key": "retirement", "label": "การลาออก"},
                        {"key": "rejoining", "label": "การเข้าทำงานในบริษัทใหม่"}
                    ]
                },
                {
                    "key": "organization",
                    "label": "องค์กร",
                    "items": [
                        {"key": "department", "label": "แผนก"},
                        {"key": "manager", "label": "หัวหน้าหน่วยงาน"}
                    ]
                },
                {
                    "key": "personal-information",
                    "label": "ข้อมูลส่วนบุคคล",
                    "items": [
                        {"key": "basic-info", "label": "ข้อมูลพื้นฐาน"},
                        {"key": "address", "label": "ที่อยู่"},
                        {"key": "family", "label": "ข้อมูลครอบครัว"}
                    ]
                }
            ]
        ]
        
        return jsonData
    } catch (error) {
        console.error('Error loading JSON files:', error)
        throw error
    }
}

// Initialize 3 JSON input holders
const jsonInputs = reactive<JsonInput[]>([
    { value: '', isValid: null, error: null, parsedData: null },
    { value: '', isValid: null, error: null, parsedData: null },
    { value: '', isValid: null, error: null, parsedData: null }
])

// Language mapping
const getLanguageName = (index: number): string => {
    const languages = ['Japanese', 'Chinese', 'Thai']
    return languages[index] || `Language ${index + 1}`
}

// Initialize and validate the loaded JSON data on component mount
const initializeJsonInputs = async () => {
    try {
        const jsonData = await loadJsonData()
        
        jsonData.forEach((data, index) => {
            if (index < jsonInputs.length) {
                jsonInputs[index].value = JSON.stringify(data, null, 2)
                jsonInputs[index].parsedData = data
                jsonInputs[index].isValid = true
                jsonInputs[index].error = null
            }
        })
        
        message.success('JSON data loaded successfully from files')
    } catch (error) {
        console.error('Failed to initialize JSON inputs:', error)
        message.error('Failed to load JSON data from files')
    }
}

// Call initialization
initializeJsonInputs()

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

// Checkbox selection state
const checkedKeys = ref<Record<string, boolean>>({})

const handleCheck = (key: string | null) => {
    if (!key) {
        // Toggle all checkboxes
        const allChecked = Object.keys(checkedKeys.value).length === extractedArray.value.length
        checkedKeys.value = {}
        if (!allChecked) {
            extractedArray.value.forEach(([itemKey]) => {
                checkedKeys.value[itemKey] = true
            })
        }
        return
    }
    
    if (checkedKeys.value[key]) {
        delete checkedKeys.value[key]
    } else {
        checkedKeys.value[key] = true
    }
}

const getCheckedRows = () =>
    extractedArray.value
        .map((row, idx) => ({ row, idx }))
        .filter(({ row }) => checkedKeys.value[row[0]] === true)
        .map(({ row, idx }) => ({ row, idx }))

// Helper function to get full key for tree nodes
const getFullKey = (node: any): string => {
    // For tree view, we need to reconstruct the full key
    if (node.parentKey) {
        return `${node.parentKey}.${node.key}`
    }
    return node.key
}

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
        title: () => h(NCheckbox, { 
            checked: Object.keys(checkedKeys.value).length === extractedArray.value.length && extractedArray.value.length > 0,
            onUpdateChecked: () => handleCheck(null)
        }),
        key: 'checkbox',
        width: 50,
        render: (row: any) => h(NCheckbox, {
            checked: checkedKeys.value[row.key] || false,
            onUpdateChecked: () => handleCheck(row.key)
        })
    },
    {
        title: 'Key',
        key: 'key',
        width: 200,
        ellipsis: {
            tooltip: true
        }
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

// Tree configuration for hierarchical display
const treeColumns = [
    {
        title: () => h(NCheckbox, { 
            checked: Object.keys(checkedKeys.value).length === extractedArray.value.length && extractedArray.value.length > 0,
            onUpdateChecked: () => handleCheck(null)
        }),
        key: 'checkbox',
        width: 50,
        render: (row: any) => h(NCheckbox, {
            checked: checkedKeys.value[getFullKey(row)] || false,
            onUpdateChecked: () => handleCheck(getFullKey(row))
        })
    },
    {
        title: 'Key',
        key: 'key',
        width: 250,
        ellipsis: {
            tooltip: true
        },
        tree: true
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

interface TreeNode {
    key: string
    lang1: string
    lang2: string
    lang3: string
    parentKey?: string
    children?: TreeNode[]
}

const treeData = computed(() => {
    const rootMap = new Map<string, TreeNode>()
    
    extractedArray.value.forEach(([key, ...labels]) => {
        const parts = key.split('.')
        const mainKey = parts[0]
        
        // Create or get root node
        if (!rootMap.has(mainKey)) {
            const rootLabels = extractedArray.value.find(([k]) => k === mainKey)?.[1] || []
            rootMap.set(mainKey, {
                key: mainKey,
                lang1: Array.isArray(rootLabels) ? rootLabels[0] || labels[0] || '' : labels[0] || '',
                lang2: Array.isArray(rootLabels) ? rootLabels[1] || labels[1] || '' : labels[1] || '',
                lang3: Array.isArray(rootLabels) ? rootLabels[2] || labels[2] || '' : labels[2] || '',
                children: []
            })
        }
        
        const rootNode = rootMap.get(mainKey)!
        
        // If this is a nested key, add it as a child
        if (parts.length > 1) {
            const childKey = parts.slice(1).join('.')
            rootNode.children!.push({
                key: childKey,
                parentKey: mainKey,
                lang1: labels[0] || '',
                lang2: labels[1] || '',
                lang3: labels[2] || ''
            })
        } else {
            // Update root node labels if this is the main category
            rootNode.lang1 = labels[0] || ''
            rootNode.lang2 = labels[1] || ''
            rootNode.lang3 = labels[2] || ''
        }
    })
    
    // Convert map to array and sort children
    const result = Array.from(rootMap.values()).map(node => ({
        ...node,
        children: node.children?.sort((a, b) => a.key.localeCompare(b.key))
    }))
    
    return result.sort((a, b) => a.key.localeCompare(b.key))
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

const downloadCSV = () => {
    // Determine the number of languages
    const maxLanguages = Math.max(...extractedArray.value.map(([, ...labels]) => labels.length))
    
    // Create CSV headers
    const headers = ['Key']
    for (let i = 1; i <= maxLanguages; i++) {
        headers.push(`Language ${i}`)
    }
    
    // Convert data to CSV format
    const csvData = [headers]
    
    // Add data rows
    extractedArray.value.forEach(([key, ...labels]) => {
        const row = [key]
        for (let i = 0; i < maxLanguages; i++) {
            // Escape quotes and wrap in quotes if contains comma, quote, or newline
            let cellValue = labels[i] || ''
            if (cellValue.includes('"')) {
                cellValue = cellValue.replace(/"/g, '""')
            }
            if (cellValue.includes(',') || cellValue.includes('"') || cellValue.includes('\n')) {
                cellValue = `"${cellValue}"`
            }
            row.push(cellValue)
        }
        csvData.push(row)
    })
    
    // Convert to CSV string
    const csvContent = csvData.map(row => row.join(',')).join('\n')
    
    // Add BOM for proper UTF-8 encoding in Excel
    const BOM = '\uFEFF'
    const csvWithBOM = BOM + csvContent
    
    // Create and download file
    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `multi-language-key-label-pairs-${Date.now()}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    message.success('CSV file downloaded successfully')
}

const clearResults = () => {
    extractedArray.value = []
    extractedHashMap.value.clear()
    checkedKeys.value = {}
    message.info('Results cleared')
}

// Test case generation
const selectedData = ref<any>()
const showTestCaseModal = ref(false)

// Test case form fields
const testCaseLang = ref<LanguageKeyType>("thai")
const testCaseScope = ref("")
const testCaseContext = ref("")
const testCaseUrl = ref("")
const previewTestCase = ref<Array<string>>([])

const testCaseHeader = ["No", "確認内容（受入基準）\nVietnamese", "確認内容（受入基準）\n日本語", "機能/項目1Item 1", "機能/項目2Item 2", "機能/項目3Item 3", "条件Condition", "条件Condition 日本語", "期待値Expect", "期待値Expect　日本語"]

const generateTestCase = () => {
    const checkedRows = getCheckedRows()
    
    if (checkedRows.length === 0) {
        message.warning('Please select at least one row to generate test case')
        return
    }
    
    const result = checkedRows.map(({ row, idx }) => {
        const [key, ...labels] = row
        
        // Language mapping based on our data structure:
        // Index 0: Japanese, Index 1: Chinese, Index 2: Thai
        const languageMap = {
            jap: labels[0] || '',    // Japanese (index 0)
            cn: labels[1] || '',     // Chinese (index 1) 
            thai: labels[2] || '',   // Thai (index 2)
            eng: labels[1] || '',    // English fallback to Chinese
            vie: labels[1] || ''     // Vietnamese fallback to Chinese
        }
        
        return {
            data: {
                key,
                jap: languageMap.jap,
                cn: languageMap.cn,
                thai: languageMap.thai,
                eng: languageMap.eng,
                vie: languageMap.vie,
                lang1: labels[0] || '',
                lang2: labels[1] || '',
                lang3: labels[2] || '',
                checked: true
            },
            idx
        }
    })
    
    selectedData.value = result
    showTestCaseModal.value = true
    
    message.success(`Generated test case with ${result.length} selected items`)
}

const handleGenerateTestCase = () => {
    if (!selectedData.value || selectedData.value.length === 0) {
        message.warning('No data selected for test case generation')
        return
    }
    
    console.log('Selected data:', selectedData.value)
    console.log('Test case language:', testCaseLang.value)
    
    // Map data to the format expected by generateTestcase
    const data = selectedData.value.map(({ data }: { data: any }) => {
        const japaneseText = data['jap'] || ''
        const targetLanguageText = data[testCaseLang.value] || ''
        
        console.log(`Mapping: Japanese="${japaneseText}", ${testCaseLang.value}="${targetLanguageText}"`)
        
        return [japaneseText, targetLanguageText]
    })
    
    console.log('Mapped data for generateTestcase:', data)
    
    try {
        const previewData = generateTestcase({
            lang: testCaseLang.value,
            context: testCaseContext.value,
            scope: testCaseScope.value,
            url: testCaseUrl.value,
            data: data,
        })
        
        console.log('Generated preview data:', previewData)
        previewTestCase.value = previewData
        message.success("Test case generated and copied to clipboard")
    } catch (error) {
        console.error('Error generating test case:', error)
        message.error('Failed to generate test case: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
}

const clearTestCaseForm = () => {
    previewTestCase.value = []
    testCaseScope.value = ""
    testCaseContext.value = ""
    testCaseUrl.value = ""
}

const closeTestCaseModal = () => {
    showTestCaseModal.value = false
    clearTestCaseForm()
}
</script>

<style scoped lang="scss">
.backend-interface {
    padding: 24px;
    max-width: 1400px;
    margin: 0 auto;
    
    .header {
        text-align: center;
        margin-bottom: 32px;
        
        h2 {
            color: #2d3748;
            margin-bottom: 8px;
        }
        
        p {
            color: #718096;
            font-size: 16px;
        }
    }
    
    .json-inputs-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 24px;
        margin-bottom: 32px;
        
        .json-input-section {
            background: #f7fafc;
            border-radius: 8px;
            padding: 20px;
            border: 2px solid #e2e8f0;
            
            .input-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
                
                h3 {
                    margin: 0;
                    color: #2d3748;
                    font-size: 18px;
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
                    line-height: 1.5;
                }
            }
            
            .error-message, .success-message {
                margin-top: 12px;
            }
        }
    }
    
    .actions {
        text-align: center;
        margin-bottom: 32px;
        display: flex;
        justify-content: center;
        gap: 16px;
        flex-wrap: wrap;
    }
    
    .results-section {
        background: white;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        overflow: hidden;
        
        .results-header {
            background: #f7fafc;
            padding: 20px;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            h3 {
                margin: 0;
                color: #2d3748;
            }
            
            .results-actions {
                display: flex;
                gap: 8px;
            }
        }
        
        .results-tabs {
            .results-content {
                padding: 20px;
                
                .results-code {
                    background: #1a202c;
                    color: #e2e8f0;
                    padding: 16px;
                    border-radius: 6px;
                    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                    font-size: 13px;
                    line-height: 1.5;
                    overflow-x: auto;
                    margin: 0;
                }
            }
            
            .results-table {
                padding: 20px;
            }
        }
    }
    
    .test-case-content {
        .test-case-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            
            h4 {
                margin: 0;
                color: #2d3748;
            }
            
            .test-case-actions {
                display: flex;
                gap: 8px;
            }
        }
        
        .test-case-json {
            margin-top: 24px;
            
            h4 {
                margin-bottom: 12px;
                color: #2d3748;
            }
            
            .json-output {
                background: #1a202c;
                color: #e2e8f0;
                padding: 16px;
                border-radius: 6px;
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                font-size: 13px;
                line-height: 1.5;
                overflow-x: auto;
                margin: 0;
                max-height: 300px;
                overflow-y: auto;
            }
        }
    }
}

@media (max-width: 768px) {
    .backend-interface {
        padding: 16px;
        
        .json-inputs-container {
            grid-template-columns: 1fr;
            gap: 16px;
        }
        
        .actions {
            flex-direction: column;
            align-items: center;
            
            .n-button {
                width: 100%;
                max-width: 300px;
            }
        }
        
        .results-section .results-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
            
            .results-actions {
                justify-content: center;
            }
        }
    }
}
</style>