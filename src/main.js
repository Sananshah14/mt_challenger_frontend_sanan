import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import ArgonDashboard from "./argon-dashboard";
import 'font-awesome/css/font-awesome.css';

const appInstance = createApp(App);
appInstance.use(store);
appInstance.use(router);
appInstance.use(ArgonDashboard);
appInstance.mount("#app");
