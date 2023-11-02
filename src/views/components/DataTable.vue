<template>
  <button
    class="download-button"
    @click="exportData"
    style="float: right; margin: 10px"
  >
    <i class="fas fa-download"></i> Download
  </button>
  <div>
    <svg v-if="isLoading" class="loading-spinner" viewBox="0 0 50 50">
      <circle class="spinner" cx="25" cy="25" r="20" fill="none" />
    </svg>
    <table v-else class="custom-table">
      <thead>
        <tr>
          <th>Data Point ID</th>
          <th>Source</th>
          <th>Category</th>
          <th>Phenomenon</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in tableData"
          :key="item.id"
          :class="index % 2 === 0 ? 'even-row' : 'odd-row'"
        >
          <td>{{ item.dataPointId }}</td>
          <td>{{ item.source }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.barrier }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false, // Initially not loading
    };
  },
  props: {
    tableData: Array,
  },
  methods: {
    exportData() {
      const dataAsText = this.tableData
        .map(
          (item) =>
            `${item.dataPointId},${item.source},${item.category},${item.barrier}`
        )
        .join("\n");
      const blob = new Blob([dataAsText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "table_data.txt";
      a.click();
    },
    getRowStyle(index) {
      return {
        backgroundColor: index % 2 === 0 ? "#F0F0F0" : "#E0E0E0",
      };
    },
  },
  watch: {
    // Watch for changes in tableData to toggle isLoading
    tableData: {
      immediate: true,
      handler() {
        this.isLoading = false;
        if (!this.tableData.length) {
          // Show processing SVG for 5 seconds (5000 milliseconds)
          setTimeout(() => {
            this.isLoading = true;
          }, 5000);
        }
      },
    },
  },
};
</script>

<style scoped>
.custom-table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.custom-table th,
.custom-table td {
  border: 1px solid #dddddd;
  padding: 8px;
  text-align: left;
}

.custom-table th {
  background-color: #f2f2f2;
}

.even-row {
  background-color: #f0f0f0;
}

.odd-row {
  background-color: #e0e0e0;
}

.download-button {
  background-color: #007bff;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
}

.download-button:hover {
  background-color: #0056b3;
}
</style>
