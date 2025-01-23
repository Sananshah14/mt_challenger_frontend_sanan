import { createRouter, createWebHistory } from "vue-router";

import Signup from "../views/Signup.vue";
import Signin from "../views/Signin.vue";
import TestSet from "../views/TestSet.vue";
import CreateReport from "../views/CreateReport.vue";
import AllReports from "../views/AllReports.vue";
import Statistics from "../views/Statistics.vue";
import ComparisonByYear from "../views/ComparisonByYear.vue";

const routes = [
  {
    path: "/dashboard-default",
    name: "Dashboard",
    component: () => import("../views/Dashboard.vue"), // Replace './views/DashboardDefault.vue' with the actual path to your component
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
    path: "/signin",
    name: "Signin",
    component: Signin,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/Comparison_By_Year",
    name: "Comparison_By_Year",
    component: ComparisonByYear,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
