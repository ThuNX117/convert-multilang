<template>
    <div class="json-viewer">
        <andypf-json-viewer
        indent="2"
  expanded="true"
  theme="default-light"
  show-data-types="true"
  show-toolbar="false"
  expand-icon-type="arrow"
  show-copy="true"
  show-size="true"
        :data='props.object'></andypf-json-viewer>
    </div>
</template>

<script setup lang="ts">
import { computed,  } from 'vue';

import "@andypf/json-viewer"


const props = defineProps({
    object: {
        type: Object ,
        required: true,
    },
});
const formattedJson = computed(() => {
    return JSON.stringify(props.object, null, 2);
});
</script>

<style scoped>
.json-viewer {
    padding: 10px;
    border-radius: 5px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
}
</style>