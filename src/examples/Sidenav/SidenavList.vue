<template>
  <ul class="navbar-nav me-auto mb-2 mb-lg-0">
    <li class="nav-item" v-for="item in navItems" :key="item.url">
      <sidenav-item
        :url="item.url"
        :navText="item.text"
        :class="getRoute() === item.route ? 'active' : ''"
      >
        <template v-slot:icon>
          <i :class="item.iconClass"></i>
        </template>
      </sidenav-item>
    </li>
    <li class="nav-item dropdown">
      <a
        class="nav-link dropdown-toggle"
        href="#"
        id="navbarDropdown"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {{ this.$store.state.isRTL ? "صفحات المرافق" : "ACCOUNT PAGES" }}
      </a>
      <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
        <li v-for="accountItem in accountNavItems" :key="accountItem.url">
          <sidenav-item
            :url="accountItem.url"
            :navText="accountItem.text"
            :class="getRoute() === accountItem.route ? 'active' : ''"
          >
            <template v-slot:icon>
              <i :class="accountItem.iconClass"></i>
            </template>
          </sidenav-item>
        </li>
        <li>
          <hr class="dropdown-divider" />
        </li>
        <li>
          <button class="dropdown-item" @click="logout">
            <i class="fas fa-sign-out-alt opacity-6 me-1"></i>
            Logout
          </button>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
import SidenavItem from "./SidenavItem.vue";

export default {
  name: "SidenavList",
  components: {
    SidenavItem,
  },
  data() {
    return {
      navItems: [
        {
          url: "/dashboard-default",
          text: "Dashboard",
          route: "dashboard-default",
          iconClass: "ni ni-tv-2 text-primary text-sm opacity-10",
        },
        {
          url: "/testset",
          text: "TestSet",
          route: "testset",
          iconClass: "ni ni-calendar-grid-58 text-warning text-sm opacity-10",
        },
        {
          url: "/CreateReport",
          text: "Create Report",
          route: "reports",
          iconClass: "ni ni-calendar-grid-58 text-warning text-sm opacity-10",
        },
        {
          url: "/all-reports",
          text: "All Reports",
          route: "reports",
          iconClass: "ni ni-calendar-grid-58 text-warning text-sm opacity-10",
        },
        {
          url: "/statistics",
          text: "Statistics",
          route: "statistics",
          iconClass: "ni ni-calendar-grid-58 text-warning text-sm opacity-10",
        },
      ],
      accountNavItems: [
        {
          url: "/signin",
          text: this.$store.state.isRTL ? "تسجيل الدخول" : "Sign In",
          route: "signin",
          iconClass: "ni ni-single-copy-04 text-danger text-sm opacity-10",
        },
        {
          url: "/signup",
          text: this.$store.state.isRTL ? "اشتراك" : "Sign Up",
          route: "signup",
          iconClass: "ni ni-collection text-info text-sm opacity-10",
        },
      ],
    };
  },
  methods: {
    getRoute() {
      const routeArr = this.$route.path.split("/");
      return routeArr[1];
    },
    logout() {
      // Implement your logout logic here
    },
  },
};
</script>

<style scoped>
.navbar-nav .nav-item {
  margin-left: 10px;
}

.navbar-nav .nav-link {
  display: flex;
  align-items: center;
  padding: 10px;
  color: #f6f8fa;
  transition: background-color 0.3s, color 0.3s;
}

.navbar-nav .nav-link:hover {
  background-color: #655568;
  color: whitesmoke;
  border-radius: 5px; /* Soft grey for hover, less stark than previous */
}

.navbar-nav .nav-link.active {
  background-color: #414343; /* Dark blue for active state */
  color: #ffffff;
  border-radius: 5px;
}

.navbar-nav .nav-link .icon {
  margin-right: 5px;
}

.navbar-nav .dropdown-menu .dropdown-item {
  display: flex;
  align-items: center;
  transition: background-color 0.3s, color 0.3s;
}

.navbar-nav .dropdown-menu .dropdown-item:hover {
  background-color: #e2e6ea; /* Consistent hover background across dropdown */
  color: #0056b3;
}

.dropdown-menu {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #f8f9fa; /* Light grey background for dropdowns */
}
</style>
