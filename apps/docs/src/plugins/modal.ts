import { ElMessage, ElMessageBox } from 'element-plus';
import { t } from '@/utils/i18n';

/** 文档站本地反馈能力，不接入主系统 modal 插件。 */
const modal = {
  msgError: (message: string): void => {
    ElMessage.error(message);
  },
  msgSuccess: (message: string): void => {
    ElMessage.success(message);
  },
  /** 取消是明确的用户选择；其余异常继续抛出，避免掩盖真实交互故障。 */
  confirm: async (message: string): Promise<boolean> => {
    try {
      await ElMessageBox.confirm(message, t('common.confirm'), {
        type: 'warning',
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        distinguishCancelAndClose: true
      });
      return true;
    } catch (error: unknown) {
      if (error === 'cancel' || error === 'close') {
        return false;
      }
      throw error;
    }
  }
};

export default modal;
