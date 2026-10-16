import { createApp } from 'vue';
import 'element-plus/dist/index.css';
import '@7mrlan/hyn-ui/styles';
import { configureHynRuntime } from '@7mrlan/hyn-ui/runtime';
import { createDocsHynRuntime } from '../src/runtime/hynRuntime';
import Consumer from './adversarial-consumer.vue';

configureHynRuntime(createDocsHynRuntime());
createApp(Consumer).mount('#app');
