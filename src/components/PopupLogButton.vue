<script setup lang="ts">
  import type { PopupLogButton, UILogType } from "../types";
  import { Warning } from "@vicons/carbon";

  defineProps<PopupLogButton>();
  const emit = defineEmits(["logError"]);
  const logError = (value: UILogType, index: number) => {
    emit("logError", value, index);
  };
</script>
<template>
  <n-popover trigger="click" style="padding: 0">
    <template #trigger>
      <n-badge :value="UILog.length">
          <slot>
          <n-button :disabled="UILog.length === 0" size="small" tertiary>
            <template #icon>
              <n-icon>
                <Warning />
              </n-icon>
            </template>
            Vỡ layout
          </n-button>
        </slot>
        </n-badge>
    </template>
    <div class="scroller" v-if="UILog.length > 0">
      <n-list hoverable clickable>
        <n-list-item v-for="(value, index) in UILog" @click="logError(value, index)">
          <div class="text" v-html="value.msg.replace(/\n/g, '<br>')"></div>
        </n-list-item>
      </n-list>
    </div>
  </n-popover>
</template>
