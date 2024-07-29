<template>
  <router-link :to="url" class="nav-link" v-bind="$attrs">
    <div class="icon"></div>
    <span class="nav-link-text" style="color: whitesmoke">{{ navText }}</span>
  </router-link>
</template>

<script>
export default {
  name: "SidenavItem",
  props: {
    url: {
      type: String,
      required: true,
    },
    navText: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.nav-link:hover {
  background-color: #172029; /* Darker grey on hover */
  color: #e6e8e8; /* Light blue color on hover */
}

.nav-link.active {
  background-color: #17a2b8; /* Light blue for active link */
  color: #fff;
}

.icon {
  width: 30px;
  text-align: center;
}
</style>
