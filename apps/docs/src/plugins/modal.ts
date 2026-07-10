import { ElMessage, ElMessageBox } from 'element-plus';

/** 文档站本地反馈能力，不接入主系统 modal 插件。 */
const modal = {
  msgError: (message: string): void => {
    ElMessage.error(message);
  },
  msgSuccess: (message: string): void => {
    ElMessage.success(message);
  },
  confirm: async (message: string): Promise<void> => {
    await ElMessageBox.confirm(message, 'Confirm', { type: 'warning' });
  }
};

export default modal;
