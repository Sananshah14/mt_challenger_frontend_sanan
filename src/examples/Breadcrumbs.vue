<template>
  <nav aria-label="breadcrumb"></nav>
</template>

<script>
export default {
  name: "breadcrumbs",
  props: {
    currentPage: {
      required: true,
    },
    textWhite: {
      type: String,
    },
  },
};
</script>
