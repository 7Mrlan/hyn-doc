/* eslint-disable */
export {};
declare global {
  const computed: typeof import('vue')['computed'];
  const defineAsyncComponent: typeof import('vue')['defineAsyncComponent'];
  const nextTick: typeof import('vue')['nextTick'];
  const onActivated: typeof import('vue')['onActivated'];
  const onBeforeUnmount: typeof import('vue')['onBeforeUnmount'];
  const onDeactivated: typeof import('vue')['onDeactivated'];
  const onMounted: typeof import('vue')['onMounted'];
  const reactive: typeof import('vue')['reactive'];
  const ref: typeof import('vue')['ref'];
  const shallowRef: typeof import('vue')['shallowRef'];
  const watch: typeof import('vue')['watch'];
  const watchEffect: typeof import('vue')['watchEffect'];
  const useSlots: typeof import('vue')['useSlots'];
  const useRoute: typeof import('vue-router')['useRoute'];
  type ElFormInstance = import('element-plus').FormInstance;
  type ElTableInstance = import('element-plus').TableInstance;
  type ElUploadInstance = import('element-plus').UploadInstance;
  const useRouter: typeof import('vue-router')['useRouter'];
}