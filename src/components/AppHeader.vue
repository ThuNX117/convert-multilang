<script setup lang="ts">
  import {  onMounted, ref } from "vue";
  import PopupButton from "./PopupLogButton.vue";
  import { useLoadingBar } from "naive-ui";
  import useMainStore from "../stores/index";
  import { storeToRefs } from "pinia";

  const emit = defineEmits([
    "logError",
    "loadOldData",
    "clearData",
    "handleSaveData",
    "checkingUi",
    "convertToJson",
  ]);
  const mainStore = useMainStore();
  const { ignoreSmallerText, selectedOption, backupname, options, UILog, needUpdate } =
    storeToRefs(mainStore);
  const handleUpdateValue = (value: string) => {
    selectedOption.value = value;
  };
  const loadOldData = () => {
    emit("loadOldData", selectedOption.value);
  };
  const clearData = () => {
    emit("clearData");
  };
  const handleSaveData = () => {
    emit("handleSaveData", backupname.value);
  };
  const checkingUi = () => {
    emit("checkingUi");
  };
  const convertToJson = () => {
    emit("convertToJson");
  };
  const logError = (value: any, index: number) => {
    emit("logError", value, index);
  };
  const loadingBar = useLoadingBar();
  const loadingBarTargetRef = ref<HTMLElement | null>(null);
  defineExpose({
    loadingBarTargetRef,
    startLoading: loadingBar.start,
    finishLoading: loadingBar.finish,
  });
  onMounted(() => {
    loadingBar.start();
    mainStore.getListDB();
    setTimeout(() => {
      loadingBar.finish();
    }, 1000);
  });
</script>

<template>
  <n-loading-bar-provider :to="loadingBarTargetRef" container-style="position: absolute;">
    <div class="app-header" style="position: relative" ref="loadingBarTargetRef">
      <div class="actions db-controls">
        <n-space vertical>
          <n-select
            v-model:value="selectedOption"
            :options="options"
            :on-update:value="handleUpdateValue"
          />
        </n-space>
        <n-button @click="loadOldData" type="info">Mở</n-button>
        <n-button @click="clearData" type="error">Xóa Bảng</n-button>
        <n-input v-model:value="backupname" type="text" placeholder="Nhập tên database" />
        <n-button @click="handleSaveData" type="info" :disabled="backupname.length == 0">
          Lưu (offline)
        </n-button>
      </div>
      <div class="actions data-controls">
        <n-badge dot :show="needUpdate">
          <n-button @click="convertToJson" type="info">Chuyển sang dạng JSON</n-button>
        </n-badge>
      </div>
      <div class="notifications">
        <n-switch v-model:value="ignoreSmallerText" />Bỏ qua text ngắn hơn

        <n-badge dot :show="needUpdate">
          <n-button @click="checkingUi" type="default">Kiểm tra vỡ layout</n-button>
        </n-badge>
        <!-- <n-button @click="mainStore.clearDB">clear DB</n-button> -->
        <PopupButton :UILog="UILog" @logError="logError" />
      </div></div
  ></n-loading-bar-provider>
</template>
<style scoped lang="scss">
  .app-header {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    .actions {
      align-items: center;
      padding: 0 10px;
      .n-select {
        min-width: 300px;
      }
    }
    .db-controls {
      display: grid;
      grid-template-columns: 300px 100px 100px 200px 100px;
    }
    .data-controls {
      display: grid;
      grid-template-columns: auto;
    }
    .notifications {
      justify-self: flex-end;
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      display: grid;
      gap: 10px;
      grid-template-columns: 40px 150px auto auto;
    }
  }
</style>
