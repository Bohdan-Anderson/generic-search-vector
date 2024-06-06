import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";

import "pdfjs-dist/build/pdf.worker.min?url";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.mount("#app");
