<template>
  <div id="app" class="container">
    <!-- Sidebar component to display all reports -->
    <div class="sidebar">
      <div
        v-for="report in reports"
        :key="report.id"
        @click="selectReport(report)"
        class="report-item"
      >
        {{ reports.name }}
      </div>
    </div>

    <div class="main-content" v-if="selectedReport">
      <table class="table table-hover table-bordered">
        <thead>
          <tr>
            <th>Info</th>
            <th>ID</th>
            <th>Source</th>
            <th>Category</th>
            <th>Phenomenon</th>
            <th>Translation</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="record in selectedReport.records"
            :key="record.id"
            class="table-row"
          >
            <td>{{ record.info }}</td>
            <td>{{ record.id }}</td>
            <td>{{ record.source }}</td>
            <td>{{ record.category }}</td>
            <td>{{ record.phenomenon }}</td>
            <td>{{ record.translation }}</td>
            <td>{{ record.comment }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p class="placeholder">
        Select a report from the sidebar to view its records.
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      reports: [],
      selectedReport: null,
    };
  },
  methods: {
    selectReport(report) {
      this.selectedReport = report;
    },
    fetchReports() {
      // Make a GET request to the reports endpoint
      axios
        .get("http://127.0.0.1:8000/api/reports/")
        .then((response) => {
          // Handle successful response
          this.reports = response.data;
          console.log("reports: " + this.reports.template);
        })
        .catch((error) => {
          // Handle error
          console.error("Error fetching reports:", error);
        });
    },
  },
  mounted() {
    // Fetch reports when the component is mounted
    this.fetchReports();
  },
};
</script>

<style scoped>
.container {
  display: flex;
}

.sidebar {
  width: 240px;
  background-color: #fff;
  margin: 5px;
  padding: 10px;
  border-radius: 8px;
  border-right: 1px solid #ccc;
}

.main-content {
  flex: 1;
  padding: 12px 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.report-item {
  cursor: pointer;
  margin-bottom: 10px;
  padding: 12px 15px;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s;
}

.report-item:hover {
  background-color: #dcdcdc;
  color: #333;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 12px;
  text-align: center;
}

.table th {
  background-color: #f0f0f0;
}

.table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.table-row:hover {
  background-color: #f0f0f0 !important;
}

.placeholder {
  font-style: italic;
  color: #888;
}
</style>
