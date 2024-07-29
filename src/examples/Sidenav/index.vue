<template>
  <header>
    <nav
      class="navbar navbar-expand shadow-sm"
      style="background-color: #76c47e"
    >
      <div class="container-fluid">
        <router-link class="navbar-brand d-flex align-items-center" to="/">
          <img :src="logoSrc" class="navbar-brand-img" alt="main_logo" />
          <span class="ms-2 fw-bold">MT Challenger</span>
        </router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <sidenav-list />
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import SidenavList from "./SidenavList.vue";
import logo from "@/assets/img/logo-ct-dark.png";
import logoWhite from "@/assets/img/logo-ct.png";

export default {
  name: "index",
  components: {
    SidenavList,
  },
  data() {
    return {
      logo,
      logoWhite,
    };
  },
  computed: {
    logoSrc() {
      return this.$store.state.darkMode ||
        this.$store.state.sidebarType === "bg-default"
        ? this.logoWhite
        : this.logo;
    },
  },
};
</script>

<style scoped>
.navbar-brand-img {
  height: 40px;
}
.navbar {
  width: 100%;
}
.navbar-toggler {
  border: none;
}

@media (max-width: 768px) {
  .navbar {
    background-color: white; /* Ensure visibility on mobile devices */
  }
}
</style>
