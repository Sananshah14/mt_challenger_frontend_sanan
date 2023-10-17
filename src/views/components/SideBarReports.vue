<template>
  <div class="sidebar">
    <div
      v-for="report in reports"
      :key="report.id"
      @click="selectReport(report)"
    >
      <div
        class="card mb-1"
        style="border-radius: 4px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)"
      >
        <div class="card-body">
          <h5 class="card-title">{{ report.name }}</h5>
          <!-- Optionally add other card content here -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    reports: Array,
  },
  methods: {
    selectReport(report) {
      this.$emit("select-report", report);
    },
  },
};
</script>

<style scoped>
.sidebar {
  width: 200px;
  background-color: #f0f0f0;
  padding: 20px;
}

.card {
  cursor: pointer;
}

.card:hover {
  background-color: #f5f5f5;
}
</style>
