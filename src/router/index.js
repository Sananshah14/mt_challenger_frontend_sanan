import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Profile from "../views/Profile.vue";
import Signup from "../views/Signup.vue";
import Signin from "../views/Signin.vue";
import TestSet from "../views/TestSet.vue";
import CreateReport from "../views/CreateReport.vue";
import AllReports from "../views/AllReports.vue";
import Statistics from "../views/Statistics.vue";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/dashboard-default",
  },
  {
    path: "/dashboard-default",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/testset",
    name: "TestSet",
    component: TestSet,
  },
  {
    path: "/CreateReport",
    name: "CreateReport",
    component: CreateReport,
  },
  {
    path: "/all-reports",
    name: "All-Reports",
    component: AllReports,
  },
  {
    path: "/statistics",
    name: "Statistics",
    component: Statistics,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
