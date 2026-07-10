<template>
  <el-upload
    ref="filePickerRef"
    v-model:file-list="fileList"
    action="#"
    class="hyn-file-picker"
    :auto-upload="false"
    :accept="resolvedAccept"
    :disabled="disabled"
    :drag="filePickerField.drag === true"
    :limit="1"
    :on-change="handleFileChange"
    :on-exceed="handleFileExceed"
    :on-remove="handleFileRemove"
  >
    <template v-if="filePickerField.drag === true">
      <el-icon class="el-icon--upload">
        <UploadFilled />
      </el-icon>
      <div class="el-upload__text">
        {{ t('app.hynForm.filePicker.dragText') }}
        <em>{{ resolvedButtonText }}</em>
      </div>
    </template>
    <el-button v-else type="primary" :disabled="disabled">{{ resolvedButtonText }}</el-button>
    <template #tip>
      <div v-if="resolvedTip" class="el-upload__tip">{{ resolvedTip }}</div>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import type { UploadInstance as ElUploadInstance } from 'element-plus';
import type { UploadFile, UploadRawFile, UploadUserFile } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue';
import { modal } from '@7mrlan/hyn-ui/runtime';
import { useHynI18n } from '@7mrlan/hyn-ui/runtime';
import type { HynFormFilePickerField, HynFormModel, HynFormRendererProps } from '../types';
import { getFormFieldValue, setFormFieldValue } from '../utils';

const props = defineProps<HynFormRendererProps>();
const { t } = useHynI18n();

const filePickerRef = ref<ElUploadInstance>();
const fileList = ref<UploadUserFile[]>([]);
// 将通用 HYN 字段收敛为当前渲染器的字段契约，避免模板读取不属于该控件的配置。
const filePickerField = computed(() => props.field as HynFormFilePickerField<HynFormModel>);

// 按钮文案保留字段级覆盖能力，避免文件类控件把业务动作写死在渲染器里。
const resolvedButtonText = computed(() => filePickerField.value.buttonText || t('app.hynForm.filePicker.chooseFile'));
// 文件类型白名单在控件边界归一化，浏览器选择器和后续校验才能使用同一口径。
const resolvedAccept = computed(() => {
  if (filePickerField.value.accept) {
    return filePickerField.value.accept;
  }
  return filePickerField.value.fileType?.map(type => (type.startsWith('.') ? type : `.${type}`)).join(',');
});
// 上传提示只在字段配置需要时输出，避免空提示占用表单行高。
const resolvedTip = computed(() => {
  if (filePickerField.value.tip) {
    return filePickerField.value.tip;
  }
  if (filePickerField.value.fileType?.length) {
    return t('app.hynForm.filePicker.typeTip', {
      types: formatFileTypes(filePickerField.value.fileType)
    });
  }
  return undefined;
});

// 渲染器和 HYN 表单 model 的 v-model 桥接点，Element Plus 写回必须落到 field.key 对应字段。
const modelValue = computed<File | undefined>({
  get: () => resolveModelFile(getFormFieldValue(props.model, props.field)),
  set: value => {
    setFormFieldValue(props.model, props.field, value);
  }
});

watch(
  modelValue,
  file => {
    fileList.value = file ? [toUploadUserFile(file)] : [];
  },
  { immediate: true }
);

/** 将模型中的未知值收窄为浏览器原始文件对象。 */
function resolveModelFile(value: unknown): File | undefined {
  return value instanceof File ? value : undefined;
}

/** 将原始文件转换为 Element Plus 文件列表展示项。 */
function toUploadUserFile(file: File): UploadUserFile {
  return {
    name: file.name,
    size: file.size,
    uid: file.lastModified || Date.now(),
    status: 'ready'
  };
}

/** 校验选择文件的后缀和大小，只通过真实本地文件。 */
function validateRawFile(file: UploadRawFile): boolean {
  if (filePickerField.value.fileType?.length && !isAllowedFileType(file.name, filePickerField.value.fileType)) {
    modal.msgError(
      t('app.hynForm.filePicker.invalidType', {
        types: formatFileTypes(filePickerField.value.fileType)
      })
    );
    return false;
  }
  if (filePickerField.value.fileSize && file.size / 1024 / 1024 > filePickerField.value.fileSize) {
    modal.msgError(t('app.hynForm.filePicker.invalidSize', { size: filePickerField.value.fileSize }));
    return false;
  }
  return true;
}

/** 按当前语言格式化文件类型列表，避免上传提示里混用中文顿号。 */
function formatFileTypes(fileTypes: string[]): string {
  return fileTypes.join(t('app.hynForm.filePicker.fileTypeSeparator'));
}

/** 判断文件名后缀是否命中字段配置允许列表。 */
function isAllowedFileType(fileName: string, fileTypes: string[]): boolean {
  const fileExt = fileName.includes('.') ? fileName.split('.').pop()?.toLowerCase() : '';
  return fileTypes.map(type => type.replace(/^\./, '').toLowerCase()).includes(fileExt || '');
}

/** 清空已选文件和表单模型，保证无效文件不会参与提交。 */
function clearSelectedFile(): void {
  modelValue.value = undefined;
  fileList.value = [];
  filePickerRef.value?.clearFiles();
}

/** 选择文件后仅写入模型，不触发任何上传请求。 */
function handleFileChange(file: UploadFile): void {
  if (!file.raw) {
    clearSelectedFile();
    return;
  }
  if (!validateRawFile(file.raw)) {
    clearSelectedFile();
    return;
  }
  modelValue.value = file.raw;
}

/** 限制导入类字段一次只选择一个文件，避免模型值语义变成数组。 */
function handleFileExceed(): void {
  modal.msgError(t('app.hynForm.filePicker.singleFileOnly'));
}

/** 移除文件时同步清空表单模型。 */
function handleFileRemove(): void {
  modelValue.value = undefined;
}
</script>

<style lang="scss" scoped>
.hyn-file-picker {
  display: block;
  width: 100%;
  min-width: 0;

  :deep(.el-upload) {
    display: block;
    width: 100%;
  }

  :deep(.el-upload-dragger) {
    box-sizing: border-box;
    width: 100%;
    min-height: 184px;
    border-color: var(--app-surface-border);
    border-radius: var(--app-radius-base);
    background: var(--app-surface-muted);
  }

  :deep(.el-upload-list) {
    width: 100%;
  }
}
</style>
