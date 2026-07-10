import { createApp } from 'vue';
import 'element-plus/dist/index.css';
import '@/styles.scss';
import App from '@/App.vue';
import i18n from '@/i18n';
import router from '@/router';
import { configureHynRuntime } from '@7mrlan/hyn-ui/runtime';
import { createDocsHynRuntime } from '@/runtime/hynRuntime';

configureHynRuntime(createDocsHynRuntime());

const app = createApp(App);
app.use(i18n);
app.use(router);
app.mount('#app');

