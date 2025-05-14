<template>
  <n-collapse
    style="width: 100%"
    :trigger-areas="['arrow']"
    default-expanded-names="vie"
    accordion
  >
    <n-collapse-item :name="item" v-for="(item, index) in configHeader" :key="index">
      <template #header>
        <div class="header-json" @click="currentOpen = item">
          {{ item.toUpperCase() }} JSON Preview
          <div class="actions">
            <PopupButton :UILog="logger[item]" @logError="focusOn">
              <n-icon size="20">
                <Warning
                  v-if="!isDownloadAble[item]"
                  :color="isDownloadAble[item] ? 'green' : 'red'"
                />
                <WarningAltFilled v-else-if="logger[item].length" :color="'orange'" />
                <CheckmarkFilled v-else color="green" />
              </n-icon>
            </PopupButton>

            <n-button
              @click="emitDownload(item)"
              type="info"
              :disabled="isDownloadAble && !isDownloadAble[item]"
            >
              Download</n-button
            >
          </div>
        </div>
      </template>

      <div class="json-viewer" v-if="isDownloadAble[item]">
        <andypf-json-viewer
          indent="2"
          expanded="true"
          theme="default-light"
          show-data-types="true"
          show-toolbar="false"
          expand-icon-type="arrow"
          show-copy="true"
          show-size="true"
          :data="props.object[item]"
        ></andypf-json-viewer>
      </div>
      <n-alert
        v-else
        :title="` JSON Preview`"
        :type="'warning'"
        :closable="false"
        :show-icon="true"
      >
        {{
          logger[item].length ? "Có lỗi trong file json" : "Chưa thực hiện Chuyển Json"
        }}
      </n-alert>
    </n-collapse-item>
  </n-collapse>
</template>

<script setup lang="ts">
  import { Warning, CheckmarkFilled, WarningAltFilled } from "@vicons/carbon";
  import PopupButton from "./components/PopupLogButton.vue";
  import "@andypf/json-viewer";
  import { ref, watch } from "vue";

  type LanguageKeyType = "vie" | "thai" | "eng" | "jap" | "cn";
  const currentOpen = ref<LanguageKeyType>("vie");
  const configHeader: Array<LanguageKeyType> = ["vie", "thai", "eng", "jap", "cn"];
  const focusOn = (value: any, index: number) => {
    console.log(value, index);
    emits("focusOn", value, index);
  };
  const props = defineProps({
    object: {
      type: Object,
      required: true,
    },
    logger: {
      type: Object,
      required: true,
    },
  });
  const emits = defineEmits(["download", "focusOn"]);
  const emitDownload = (type: "thai" | "cn" | "vie" | "jap" | "eng") => {
    emits("download", type);
  };
  const check = (object: any) => {
    if (object === null || object === undefined || Object.keys(object).length === 0) {
      return false;
    }
    return true;
  };
  const isDownloadAble = ref<Record<LanguageKeyType, boolean>>({
    vie: false,
    thai: false,
    eng: false,
    cn: false,
    jap: false,
  });
  const checking = () => {
    const result: Record<LanguageKeyType, boolean> = {
      vie: check(props.object["vie"]),
      thai: check(props.object["thai"]),
      eng: check(props.object["eng"]),
      cn: check(props.object["cn"]),
      jap: check(props.object["cn"]),
    };
    return result;
  };
  watch(
    () => props.object,
    () => {
      isDownloadAble.value = checking();
      console.log(isDownloadAble.value);
    },
    { deep: true, immediate: true }
  );
</script>

<style scoped>
  .json-viewer {
    padding: 10px;
    border-radius: 5px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    max-height: 50vh;
    overflow: auto;
  }

  .actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }

  .error-log {
    max-width: 300px;
    display: flex;
    flex-direction: column;
    max-height: 500px;
    overflow: auto;
    gap: 4px;
  }
  .header-json {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 0 12px;
  }

  .error-log > div {
    border-bottom: 1px solid #dcdcdc;
  }
</style>
