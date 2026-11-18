import '@/assets/styles/main.css';

import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.config.errorHandler = (err, _instance, info) => {
  // Central place to plug an error tracker (Sentry, etc.)
  console.error('[app error]', info, err);
};

app.mount('#app');
