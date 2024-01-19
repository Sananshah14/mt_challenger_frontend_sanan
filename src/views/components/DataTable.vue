<template>
  <span class="form-group">
    <label for="range">
      <h5>scramble factor for exporting: {{ value }}</h5></label
    >

    <input
      type="range"
      class="range"
      id="range"
      v-model="value"
      min="1"
      max="10"
      style="width: 200px; margin-left: 10px; color: beige"
    />
    <button
      class="download-button"
      @click="downloadTextFile"
      style="margin-left: 500px"
    >
      <i class="fas fa-download"></i> Download
    </button>
  </span>

  <div>
    <table class="custom-table">
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
import axios from "axios";
export default {
  data() {
    return {
      isLoading: false, // Initially not loading
      value: 0,
    };
  },
  props: {
    tableData: Array,
  },
  components: {},
  methods: {
    loadData() {
      this.tableData.map(
        (item) =>
          `${item.dataPointId},${item.source},${item.category},${item.barrier}`
      );
    },

    async downloadTextFile() {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/testitems/download_text_file/",
          {
            content: this.tableData,
            scramblingFactor: this.value,
          }
        );

        const templateId = response.data.template_id;
        const textFileContent = response.data.text_file_content;

        const blob = new Blob([textFileContent], { type: "text/plain" });

        const filename = `template_${templateId}.txt`;

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
      } catch (error) {
        console.error("Error downloading text file:", error);
      }
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
