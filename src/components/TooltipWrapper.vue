<template>
    <n-tooltip trigger="hover" :show-arrow="false">
        <template #trigger>
            <slot></slot>
        </template>
        <div class="tooltip-content" style="white-space: pre-wrap; word-break: break-word; max-width: 500px;">
            {{ content }}
        </div>

    </n-tooltip>
</template>
<script setup lang="ts">
defineProps<{
    content: string;
}>();
</script>