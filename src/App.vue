<template>
  <div class="app-wrapper">
    <div class="main-content-wrapper">
      <sidenav v-if="this.$store.state.showSidenav" />
      <main class="main-content position-relative border-radius-lg">
        <router-view />
      </main>
      <configurator
        :toggle="toggleConfigurator"
        :class="[
          this.$store.state.showConfig ? 'show' : '',
          this.$store.state.hideConfigButton ? 'd-none' : '',
        ]"
      />
      <!-- <app-footer v-show="this.$store.state.showFooter" /> -->
    </div>
  </div>
</template>

<script>
import Sidenav from "./examples/Sidenav";
//import AppFooter from "@/examples/Footer.vue";
import { mapMutations } from "vuex";

export default {
  name: "App",
  components: {
    Sidenav,
    //AppFooter,
  },
  methods: {
    ...mapMutations(["toggleConfigurator", "navbarMinimize"]),
  },
  computed: {
    navClasses() {
      return {
        "position-sticky bg-white left-auto top-2 z-index-sticky":
          this.$store.state.isNavFixed && !this.$store.state.darkMode,
        "position-sticky bg-default left-auto top-2 z-index-sticky":
          this.$store.state.isNavFixed && this.$store.state.darkMode,
        "position-absolute px-4 mx-0 w-100 z-index-2": this.$store.state
          .isAbsolute,
        "px-0 mx-4": !this.$store.state.isAbsolute,
      };
    },
  },
  beforeMount() {
    this.$store.state.isTransparent = "bg-transparent";
  },
};
</script>

<style scoped>
.app-wrapper {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidenav {
  flex-shrink: 0;
}

.main-content-wrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
}

.main-content {
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
</style>
