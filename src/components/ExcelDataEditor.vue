<template>
    <div class="excel-editor">
        <div class="editor-header">
            <h3>Excel-like Data Editor</h3>
            <div class="editor-actions">
                <n-button @click="importFiles" type="info" size="small">
                    <template #icon>
                        <n-icon>
                            <Upload />
                        </n-icon>
                    </template>
                    Import JSON Files
                </n-button>
                <n-button @click="addRow" type="primary" size="small">
                    <template #icon>
                        <n-icon>
                            <Add />
                        </n-icon>
                    </template>
                    Add Row
                </n-button>
                <n-button @click="deleteSelectedRows" type="error" size="small" :disabled="selectedRows.length === 0">
                    <template #icon>
                        <n-icon>
                            <TrashCan />
                        </n-icon>
                    </template>
                    Delete Selected
                </n-button>
                <n-button @click="exportData" type="success" size="small" :disabled="tableData.length === 0">
                    <template #icon>
                        <n-icon>
                            <Download />
                        </n-icon>
                    </template>
                    Export Data
                </n-button>
                <n-button @click="clearAll" type="warning" size="small">
                    Clear All
                </n-button>
            </div>
        </div>

        <div class="table-container">
            <HotTable ref="hotTableRef" :data="tableData" :colHeaders="tableHeaders" :rowHeaders="true"
                :columns="columnSettings" :contextMenu="true" :manualRowResize="true" :manualColumnResize="true"
                :manualRowMove="true" :manualColumnMove="false" :copyPaste="true" :undo="true" :redo="true"
                :fillHandle="true" :dragToScroll="true" :width="'100%'" :height="400" :stretchH="'all'"
                :autoWrapRow="true" :autoWrapCol="true" :minSpareRows="100"
                :licenseKey="'non-commercial-and-evaluation'" @after-change="onDataChange"
                @after-selection="onSelectionChange" />
        </div>

        <!-- Preview Section -->
        <div class="preview-section" v-if="tableData.length > 0">
            <div class="preview-header">
                <h4>Data Preview</h4>
                <div class="preview-controls">
                    <n-button @click="showComparison = !showComparison" type="info" size="small"
                        v-if="lastImportedData.length > 0">
                        {{ showComparison ? 'Hide' : 'Show' }} Comparison
                    </n-button>
                    <n-select v-model:value="previewMode" :options="previewModeOptions" size="small"
                        style="width: 150px;" />
                </div>
            </div>

            <!-- Data Comparison -->
            <div v-if="showComparison && lastImportedData.length > 0" class="comparison-section">
                <n-alert type="info" style="margin-bottom: 16px;">
                    <template #header>Data Comparison</template>
                    Comparing current table data with last imported JSON data
                </n-alert>

                <div class="comparison-stats">
                    <n-space>
                        <n-tag type="success">Unchanged: {{ comparisonStats.unchanged }}</n-tag>
                        <n-tag type="warning">Modified: {{ comparisonStats.modified }}</n-tag>
                        <n-tag type="info">New in Table: {{ comparisonStats.newInTable }}</n-tag>
                        <n-tag type="error">Missing from Table: {{ comparisonStats.missingFromTable }}</n-tag>
                        <n-button size="tiny" type="primary" @click="recompare" style="margin-left: 12px;">
                            <template #icon>
                                <n-icon><svg width="16" height="16" viewBox="0 0 24 24">
                                        <path
                                            d="M12 6V3L7 8l5 5V9c3.31 0 6 2.69 6 6 0 1.3-.42 2.5-1.13 3.47l1.46 1.46C19.07 18.07 20 16.13 20 14c0-4.42-3.58-8-8-8zm-6.87 2.53L3.67 7.07C2.93 8.93 2 10.87 2 13c0 4.42 3.58 8 8 8v3l5-5-5-5v3c-3.31 0-6-2.69-6-6 0-1.3.42-2.5 1.13-3.47z" />
                                    </svg></n-icon>
                            </template>
                            Re-Compare
                        </n-button>
                    </n-space>
                </div>


                <div class="comparison-details" v-if="comparisonDetails.length > 0">
                    <n-table :bordered="true" size="small" max-height="200px">
                        <thead>
                            <tr>
                                <th>Key</th>
                                <th>Status</th>
                                <th>Table Value</th>
                                <th>JSON Value</th>
                                <th>Language</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="detail in comparisonDetails.slice(0, 20)"
                                :key="`${detail.key}-${detail.language}`">
                                <td>{{ detail.key }}</td>
                                <td>
                                    <n-tag :type="getStatusTagType(detail.status)" size="small">
                                        {{ detail.status }}
                                    </n-tag>
                                </td>
                                <td>{{ detail.tableValue || '(empty)' }}</td>
                                <td>{{ detail.jsonValue || '(empty)' }}</td>
                                <td>{{ detail.language }}</td>
                            </tr>
                        </tbody>
                    </n-table>
                    <p v-if="comparisonDetails.length > 20" style="margin-top: 8px; color: #666;">
                        ... and {{ comparisonDetails.length - 20 }} more differences
                    </p>
                </div>
            </div>

            <!-- Data Preview Table -->
            <div class="preview-table">
                <n-table :bordered="true" size="small" max-height="300px">
                    <thead>
                        <tr>
                            <th>Key</th>
                            <th v-if="previewMode === 'all' || previewMode === 'japanese'">Japanese</th>
                            <th v-if="previewMode === 'all' || previewMode === 'chinese'">Chinese</th>
                            <th v-if="previewMode === 'all' || previewMode === 'thai'">Thai</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, index) in previewData.slice(0, 10)" :key="index">
                            <td class="key-cell">{{ row[0] || '' }}</td>
                            <td v-if="previewMode === 'all' || previewMode === 'japanese'" class="value-cell">{{ row[1]
                                || '' }}
                            </td>
                            <td v-if="previewMode === 'all' || previewMode === 'chinese'" class="value-cell">{{ row[2]
                                || '' }}
                            </td>
                            <td v-if="previewMode === 'all' || previewMode === 'thai'" class="value-cell">{{ row[3] ||
                                '' }}
                            </td>
                        </tr>
                    </tbody>
                </n-table>
                <p v-if="previewData.length > 10" style="margin-top: 8px; color: #666;">
                    ... and {{ previewData.length - 10 }} more rows
                </p>
            </div>
        </div>

        <div class="data-info" v-if="tableData.length > 0">
            <n-space>
                <n-tag type="info">Total Rows: {{ tableData.length }}</n-tag>
                <n-tag type="success">Valid Entries: {{ validEntries }}</n-tag>
                <n-tag type="warning" v-if="invalidEntries > 0">Invalid Entries: {{ invalidEntries }}</n-tag>
            </n-space>
        </div>

        <!-- File Import Modal -->
        <n-modal v-model:show="showImportModal" width="600">
            <n-card title="Import JSON Files" :bordered="false" size="huge" role="dialog" aria-modal="true">
                <div class="import-section">
                    <p>Select multiple i18n JSON files to import data. Each file should be an object with key-value
                        pairs (e.g.,
                        {"app.title": "Application Title", "user.name": "User Name"}).</p>

                    <div class="file-input-section">
                        <input ref="fileInputRef" type="file" multiple accept=".json" @change="handleFileSelect"
                            style="display: none;" />

                        <n-button @click="triggerFileSelect" type="primary" block>
                            <template #icon>
                                <n-icon>
                                    <FolderOpen />
                                </n-icon>
                            </template>
                            Select JSON Files
                        </n-button>
                    </div>

                    <div v-if="selectedFiles.length > 0" class="selected-files">
                        <h4>Selected Files (drag to reorder):</h4>
                        <div class="file-list">
                            <div v-for="(file, index) in selectedFiles" :key="file.name + index" class="file-item"
                                draggable="true" @dragstart="handleDragStart(index)" @dragover.prevent
                                @drop="handleDrop(index)" @dragenter.prevent>
                                <div class="file-info">
                                    <n-icon class="drag-handle" size="16">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path
                                                d="M9 3h2v2H9V3zm0 4h2v2H9V7zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm4-16h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z" />
                                        </svg>
                                    </n-icon>
                                    <n-tag type="info">{{ file.name }}</n-tag>
                                    <span class="column-indicator">Column {{ index + 1 }}</span>
                                </div>
                                <div class="file-actions">
                                    <n-button size="tiny" type="info" @click="moveFileUp(index)"
                                        :disabled="index === 0">
                                        <template #icon>
                                            <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                                                <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
                                            </svg>
                                        </template>
                                    </n-button>
                                    <n-button size="tiny" type="info" @click="moveFileDown(index)"
                                        :disabled="index === selectedFiles.length - 1">
                                        <template #icon>
                                            <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                                                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                                            </svg>
                                        </template>
                                    </n-button>
                                    <n-button size="tiny" type="error" @click="removeFile(index)">
                                        <template #icon>
                                            <n-icon>
                                                <Close />
                                            </n-icon>
                                        </template>
                                    </n-button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="importPreview.length > 0" class="import-preview">
                        <h4>Import Preview (first 5 rows):</h4>
                        <n-alert type="info" style="margin-bottom: 12px;" size="small">
                            Column order: {{selectedFiles.map((f, i) => `${i + 1}. ${f.name.replace('.json',
                                '')}`).join(', ')
                            }}
                        </n-alert>
                        <n-table :bordered="true" size="small">
                            <thead>
                                <tr>
                                    <th>Key</th>
                                    <th v-for="(file, index) in selectedFiles" :key="index">
                                        {{ file.name.replace('.json', '') }}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, index) in importPreview.slice(0, 5)" :key="index">
                                    <td>{{ row[0] || '' }}</td>
                                    <td v-for="(cell, cellIndex) in row.slice(1)" :key="cellIndex">
                                        {{ cell || '' }}
                                    </td>
                                </tr>
                            </tbody>
                        </n-table>
                        <p v-if="importPreview.length > 5">... and {{ importPreview.length - 5 }} more rows</p>
                    </div>
                </div>

                <template #footer>
                    <n-space justify="end">
                        <n-button @click="showImportModal = false">Cancel</n-button>
                        <n-button type="primary" @click="confirmImport" :disabled="importPreview.length === 0"
                            :loading="importing">
                            Import Data
                        </n-button>
                    </n-space>
                </template>
            </n-card>
        </n-modal>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { HotTable } from '@handsontable/vue3'
import { useMessage } from 'naive-ui'
import { Upload, Add, TrashCan, Download, FolderOpen, Close } from '@vicons/carbon'
import 'handsontable/dist/handsontable.full.min.css'

const message = useMessage()

// Props & Emits
const emit = defineEmits(['dataChanged', 'exportRequested'])

// Refs
const hotTableRef = ref()
const fileInputRef = ref<HTMLInputElement>()

// Data
const tableData = ref<(string | null)[][]>([])
const selectedRows = ref<number[]>([])
const showImportModal = ref(false)
const selectedFiles = ref<File[]>([])
const importPreview = ref<(string | null)[][]>([])
const importing = ref(false)
const lastImportedData = ref<(string | null)[][]>([])
const showComparison = ref(false)
const previewMode = ref('all')
const draggedFileIndex = ref<number | null>(null)

// Preview mode options
const previewModeOptions = [
    { label: 'All Languages', value: 'all' },
    { label: 'Japanese Only', value: 'japanese' },
    { label: 'Chinese Only', value: 'chinese' },
    { label: 'Thai Only', value: 'thai' }
]

// Table configuration
const tableHeaders = ['Key', 'Japanese', 'Chinese', 'Thai']

const columnSettings = [
    {
        data: 0,
        type: 'text',
        width: 200,
        placeholder: 'Enter key (e.g., organization.department)'
    },
    {
        data: 1,
        type: 'text',
        width: 150,
        placeholder: 'Japanese text'
    },
    {
        data: 2,
        type: 'text',
        width: 150,
        placeholder: 'Chinese text'
    },
    {
        data: 3,
        type: 'text',
        width: 150,
        placeholder: 'Thai text'
    }
]

// Types for comparison
interface ComparisonDetail {
    key: string
    status: 'unchanged' | 'modified' | 'new' | 'missing'
    tableValue: string | null
    jsonValue: string | null
    language: string
}

interface ComparisonStats {
    unchanged: number
    modified: number
    newInTable: number
    missingFromTable: number
}
// Re-Compare button handler
function recompare() {
    lastImportedData.value = [...lastImportedData.value]
    message.info('Re-comparison triggered')
}
// Computed
const validEntries = computed(() => {
    return tableData.value.filter(row =>
        row && row.length >= 4 && row[0] && (row[1] || row[2] || row[3])
    ).length
})

const invalidEntries = computed(() => {
    return tableData.value.length - validEntries.value
})

const previewData = computed(() => {
    return getValidData()
})

const comparisonStats = computed((): ComparisonStats => {
    if (lastImportedData.value.length === 0) {
        return { unchanged: 0, modified: 0, newInTable: 0, missingFromTable: 0 }
    }

    const details = comparisonDetails.value
    return {
        unchanged: details.filter(d => d.status === 'unchanged').length,
        modified: details.filter(d => d.status === 'modified').length,
        newInTable: details.filter(d => d.status === 'new').length,
        missingFromTable: details.filter(d => d.status === 'missing').length
    }
})

const comparisonDetails = computed((): ComparisonDetail[] => {
    if (lastImportedData.value.length === 0) return []

    const currentData = getValidData()
    const importedData = lastImportedData.value
    const details: ComparisonDetail[] = []

    // Create maps for easier lookup
    const currentMap = new Map<string, (string | null)[]>()
    const importedMap = new Map<string, (string | null)[]>()

    currentData.forEach(row => {
        if (row[0]) currentMap.set(row[0].toString(), row)
    })

    importedData.forEach(row => {
        if (row[0]) importedMap.set(row[0].toString(), row)
    })

    // Get all unique keys
    const allKeys = new Set([...currentMap.keys(), ...importedMap.keys()])

    allKeys.forEach(key => {
        const currentRow = currentMap.get(key)
        const importedRow = importedMap.get(key)

        // Check each language column (1: Japanese, 2: Chinese, 3: Thai)
        const languages = ['Japanese', 'Chinese', 'Thai']

        languages.forEach((lang, index) => {
            const langIndex = index + 1
            const currentValue = currentRow?.[langIndex] || null
            const importedValue = importedRow?.[langIndex] || null

            let status: ComparisonDetail['status'] = 'unchanged'

            if (!currentRow && importedRow) {
                status = 'missing'
            } else if (currentRow && !importedRow) {
                status = 'new'
            } else if (currentValue !== importedValue) {
                status = 'modified'
            }

            // Only add to details if there's a difference or if both have values
            if (status !== 'unchanged' || (currentValue && importedValue)) {
                details.push({
                    key,
                    status,
                    tableValue: currentValue,
                    jsonValue: importedValue,
                    language: lang
                })
            }
        })
    })

    return details.sort((a, b) => a.key.localeCompare(b.key))
})

// Methods
const onDataChange = (changes: unknown) => {
    if (changes) {
        // Remove empty rows except the last one for new entries
        const filteredData = tableData.value.filter((row, index) => {
            if (index === tableData.value.length - 1) return true // Keep last row for new entries
            return row && row.some(cell => cell && cell.toString().trim() !== '')
        })

        // Ensure we always have at least one empty row for new entries
        if (filteredData.length === 0 || filteredData[filteredData.length - 1].some(cell => cell && cell.toString().trim() !== '')) {
            filteredData.push([null, null, null, null])
        }

        tableData.value = filteredData
        emit('dataChanged', getValidData())
    }
}

const onSelectionChange = (row: number, _column: number, row2: number) => {
    const startRow = Math.min(row, row2)
    const endRow = Math.max(row, row2)
    selectedRows.value = []
    for (let i = startRow; i <= endRow; i++) {
        selectedRows.value.push(i)
    }
}

// Helper function for comparison status tag colors
const getStatusTagType = (status: ComparisonDetail['status']) => {
    switch (status) {
        case 'unchanged': return 'success'
        case 'modified': return 'warning'
        case 'new': return 'info'
        case 'missing': return 'error'
        default: return 'default'
    }
}

const addRow = () => {
    tableData.value.push([null, null, null, null])
    nextTick(() => {
        const hot = hotTableRef.value?.hotInstance
        if (hot) {
            hot.render()
            hot.selectCell(tableData.value.length - 1, 0)
        }
    })
}

const deleteSelectedRows = () => {
    if (selectedRows.value.length === 0) return

    // Sort rows in descending order to delete from bottom to top
    const sortedRows = [...selectedRows.value].sort((a, b) => b - a)

    sortedRows.forEach(rowIndex => {
        if (rowIndex < tableData.value.length) {
            tableData.value.splice(rowIndex, 1)
        }
    })

    selectedRows.value = []
    message.success(`Deleted ${sortedRows.length} row(s)`)
    emit('dataChanged', getValidData())
}

const clearAll = () => {
    tableData.value = [[null, null, null, null]]
    console.log('Clearing all data')
    // selectedRows.value = []
    // lastImportedData.value = []
    message.info('All data cleared')
    emit('dataChanged', [])
    nextTick(() => {
        const hot = hotTableRef.value?.hotInstance
        if (hot) {
            hotTableRef.value?.hotInstance.updateData(tableData.value);
        }
    })
}

const getValidData = (): (string | null)[][] => {
    return tableData.value.filter(row =>
        row && row.length >= 4 && row[0] && row[0].toString().trim() !== ''
    )
}

const exportData = () => {
    const validData = getValidData()
    if (validData.length === 0) {
        message.warning('No valid data to export')
        return
    }

    emit('exportRequested', validData)

    // Export as i18n JSON format - separate files for each language
    const languages = ['japanese', 'chinese', 'thai']

    languages.forEach((lang, index) => {
        const langIndex = index + 1 // Skip the key column (index 0)
        const i18nData: Record<string, unknown> = {}

        validData.forEach(row => {
            const key = row[0]
            const value = row[langIndex]
            if (key && value) {
                // Handle nested keys (e.g., "app.title" -> { app: { title: "value" } })
                const keyParts = key.toString().split('.')
                let current = i18nData

                for (let i = 0; i < keyParts.length - 1; i++) {
                    const part = keyParts[i]
                    if (!current[part]) {
                        current[part] = {}
                    }
                    current = current[part] as Record<string, unknown>
                }

                current[keyParts[keyParts.length - 1]] = value.toString()
            }
        })

        // Download the JSON file
        const blob = new Blob([JSON.stringify(i18nData, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${lang}-${Date.now()}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    })

    // Also export combined data as Excel format
    const combinedExport = {
        data: validData,
        headers: tableHeaders,
        exportDate: new Date().toISOString(),
        totalRows: validData.length,
        format: 'excel-multilang'
    }

    const blob = new Blob([JSON.stringify(combinedExport, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `multilang-data-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    message.success(`Exported ${languages.length} i18n files + 1 combined file`)
}

// File import functionality
const importFiles = () => {
    showImportModal.value = true
    selectedFiles.value = []
    importPreview.value = []
}

const triggerFileSelect = () => {
    fileInputRef.value?.click()
}

const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files) {
        selectedFiles.value = Array.from(target.files)
        processFiles()
    }
}

const removeFile = (index: number) => {
    selectedFiles.value.splice(index, 1)
    if (selectedFiles.value.length === 0) {
        importPreview.value = []
    } else {
        processFiles()
    }
}

// File reordering methods
const handleDragStart = (index: number) => {
    draggedFileIndex.value = index
}

const handleDrop = (dropIndex: number) => {
    if (draggedFileIndex.value !== null && draggedFileIndex.value !== dropIndex) {
        const draggedFile = selectedFiles.value[draggedFileIndex.value]
        selectedFiles.value.splice(draggedFileIndex.value, 1)
        selectedFiles.value.splice(dropIndex, 0, draggedFile)
        processFiles() // Reprocess to update column order
    }
    draggedFileIndex.value = null
}

const moveFileUp = (index: number) => {
    if (index > 0) {
        const file = selectedFiles.value[index]
        selectedFiles.value.splice(index, 1)
        selectedFiles.value.splice(index - 1, 0, file)
        processFiles()
    }
}

const moveFileDown = (index: number) => {
    if (index < selectedFiles.value.length - 1) {
        const file = selectedFiles.value[index]
        selectedFiles.value.splice(index, 1)
        selectedFiles.value.splice(index + 1, 0, file)
        processFiles()
    }
}

const processFiles = async () => {
    if (selectedFiles.value.length === 0) {
        importPreview.value = []
        return
    }

    try {
        const filesData: Map<string, string>[] = []

        for (const file of selectedFiles.value) {
            const text = await readFileAsText(file)
            const jsonData = JSON.parse(text)

            // Handle i18n JSON format (object with key-value pairs)
            if (typeof jsonData !== 'object' || jsonData === null || Array.isArray(jsonData)) {
                throw new Error(`File ${file.name} must be an object with key-value pairs for i18n data`)
            }

            const fileMap = new Map<string, string>()

            // Recursively process nested objects to flatten them
            const flattenObject = (obj: Record<string, unknown>, prefix = '') => {
                Object.entries(obj).forEach(([key, value]) => {
                    const fullKey = prefix ? `${prefix}.${key}` : key

                    if (typeof value === 'string') {
                        fileMap.set(fullKey, value)
                    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        // Recursively flatten nested objects
                        flattenObject(value as Record<string, unknown>, fullKey)
                    } else if (value !== null && value !== undefined) {
                        // Convert other types to string
                        fileMap.set(fullKey, String(value))
                    }
                })
            }

            flattenObject(jsonData)
            filesData.push(fileMap)
        }

        // Merge data from all files
        const allKeys = new Set<string>()
        filesData.forEach(fileMap => {
            fileMap.forEach((_, key) => allKeys.add(key))
        })

        const mergedData: (string | null)[][] = []
        allKeys.forEach(key => {
            const row: (string | null)[] = [key]
            filesData.forEach(fileMap => {
                row.push(fileMap.get(key) || '')
            })
            mergedData.push(row)
        })

        // Sort by key
        mergedData.sort((a, b) => (a[0] || '').localeCompare(b[0] || ''))

        importPreview.value = mergedData

    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error processing files:', error)
        message.error(`Error processing files: ${error instanceof Error ? error.message : 'Unknown error'}`)
        importPreview.value = []
    }
}

const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.onerror = (e) => reject(e)
        reader.readAsText(file)
    })
}

const confirmImport = () => {
    importing.value = true

    setTimeout(() => {
        // Store the imported data for comparison
        lastImportedData.value = [...importPreview.value]

        // Replace current data with imported data
        tableData.value = [...importPreview.value]

        // Add empty row for new entries
        if (tableData.value.length === 0 || tableData.value[tableData.value.length - 1].some(cell => cell && cell.toString().trim() !== '')) {
            tableData.value.push([null, null, null, null])
        }

        importing.value = false
        showImportModal.value = false

        nextTick(() => {
            const hot = hotTableRef.value?.hotInstance
            if (hot) {
                hot.render()
            }
        })

        message.success(`Imported ${importPreview.value.length} rows from ${selectedFiles.value.length} file(s)`)
        emit('dataChanged', getValidData())

        // Clear import state
        selectedFiles.value = []
        importPreview.value = []
    }, 500)
}

// Initialize with empty data
onMounted(() => {
    // Add one empty row to start
    if (tableData.value.length === 0) {
        tableData.value = [[null, null, null, null]]
    }
})

// Expose methods for parent component
defineExpose({
    getData: getValidData,
    setData: (data: (string | null)[][]) => {
        tableData.value = [...data]
        if (tableData.value.length === 0 || tableData.value[tableData.value.length - 1].some(cell => cell && cell.toString().trim() !== '')) {
            tableData.value.push([null, null, null, null])
        }
        nextTick(() => {
            const hot = hotTableRef.value?.hotInstance
            if (hot) {
                hot.render()
            }
        })
    },
    clearData: clearAll,
    addRow,
    exportData
})
</script>

<style scoped lang="scss">
.excel-editor {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e2e8f0;

    .editor-header {
        background: #f7fafc;
        padding: 16px;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;

        h3 {
            margin: 0;
            color: #2d3748;
        }

        .editor-actions {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }
    }

    .table-container {
        padding: 16px;

        :deep(.ht_master) {
            .handsontable {
                font-family: 'Inter', sans-serif;
                font-size: 13px;
            }

            .ht__highlight {
                background-color: #e3f2fd !important;
            }

            .currentRow {
                background-color: #f5f5f5 !important;
            }

            .area {
                background-color: #bbdefb !important;
            }

            thead th {
                background: #f8f9fa;
                color: #495057;
                font-weight: 600;
                border-bottom: 2px solid #dee2e6;
            }

            tbody td {
                border: 1px solid #e9ecef;

                &.htInvalid {
                    background-color: #fee2e2 !important;
                }
            }
        }
    }

    .data-info {
        padding: 16px;
        border-top: 1px solid #e2e8f0;
        background: #f8f9fa;
    }

    .preview-section {
        border-top: 1px solid #e2e8f0;
        background: #fafafa;

        .preview-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            border-bottom: 1px solid #e2e8f0;
            background: white;

            h4 {
                margin: 0;
                color: #2d3748;
            }

            .preview-controls {
                display: flex;
                gap: 12px;
                align-items: center;
            }
        }

        .comparison-section {
            padding: 16px;
            background: white;
            border-bottom: 1px solid #e2e8f0;

            .comparison-stats {
                margin: 12px 0;
            }

            .comparison-details {
                margin-top: 16px;

                :deep(.n-table) {
                    .key-cell {
                        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                        font-size: 12px;
                        background-color: #f8f9fa;
                    }

                    .value-cell {
                        max-width: 200px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
            }
        }

        .preview-table {
            padding: 16px;
            background: white;

            :deep(.n-table) {
                .key-cell {
                    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                    font-size: 12px;
                    background-color: #f8f9fa;
                    font-weight: 500;
                }

                .value-cell {
                    max-width: 250px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    line-height: 1.4;
                }
            }
        }
    }
}

.import-section {
    .file-input-section {
        margin: 16px 0;
    }

    .selected-files {
        margin: 16px 0;

        h4 {
            margin-bottom: 8px;
            color: #2d3748;
        }

        .file-list {
            display: flex;
            flex-direction: column;
            gap: 8px;

            .file-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px;
                background: #f7fafc;
                border-radius: 4px;
                border: 1px solid #e2e8f0;
                cursor: grab;
                transition: all 0.2s ease;

                &:hover {
                    background: #edf2f7;
                    border-color: #cbd5e0;
                }

                &:active {
                    cursor: grabbing;
                }

                .file-info {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    flex: 1;

                    .drag-handle {
                        color: #a0aec0;
                        cursor: grab;

                        &:hover {
                            color: #718096;
                        }
                    }

                    .column-indicator {
                        font-size: 11px;
                        color: #718096;
                        background: #e2e8f0;
                        padding: 2px 6px;
                        border-radius: 10px;
                        margin-left: auto;
                    }
                }

                .file-actions {
                    display: flex;
                    gap: 4px;
                    align-items: center;
                }
            }
        }
    }

    .import-preview {
        margin: 16px 0;

        h4 {
            margin-bottom: 8px;
            color: #2d3748;
        }

        :deep(.n-table) {
            max-height: 200px;
            overflow-y: auto;
        }
    }
}

@media (max-width: 768px) {
    .excel-editor {
        .editor-header {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;

            .editor-actions {
                justify-content: center;
            }
        }

        .table-container {
            padding: 8px;
            overflow-x: auto;
        }
    }
}
</style>
