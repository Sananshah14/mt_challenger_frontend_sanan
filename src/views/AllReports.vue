<template>
  <div id="app" class="dashboard-container">
    <!-- Sidebar component to display all reports -->
    <div class="sidebar">
      <div class="nav">
        <ul>
          <li
            v-for="report in reports"
            :key="report.id"
            @click="selectReport(report)"
          >
            <div class="report-info">
              <div class="report-title">
                Engine Name : {{ report.engine }}
                <br />
                Engine Type : {{ report.engine_type }}
              </div>
              <div class="report-details">
                <div>Template ID: {{ report.template }}</div>
                <div>Language Direction: {{ report.language_direction }}</div>
                <div>Time of Creation: {{ report.created_time }}</div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="main-content" v-if="isReportSelected">
      <table class="table table-hover table-bordered">
        <thead>
          <tr>
            <th>Info</th>
            <th>ID</th>
            <th>Source</th>
            <th>Category</th>
            <th>Phenomenon</th>
            <th>Translation</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="translation in translations"
            :key="translation.id"
            class="table-row"
          >
            <td>{{ translation.label }}</td>
            <td>{{ translation.id }}</td>
            <td>{{ translation.source_sentence }}</td>
            <td>{{ translation.category_name }}</td>
            <td>{{ translation.phenomenon_name }}</td>
            <td>{{ translation.sentence }}</td>
            <!-- <td>{{ translation.test_item.comment }}</td> -->
          </tr>
        </tbody>
      </table>
      <p v-if="!isReportSelected" class="placeholder">
        No report selected. Please select a report from the sidebar.
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
      translations: [],
    };
  },
  computed: {
    isReportSelected() {
      return !!this.selectedReport;
    },
  },
  methods: {
    selectReport(report) {
      this.selectedReport = report;
      this.isReportSelected = true;
      this.fetchTranslations(report.id);
    },
    fetchReports() {
      axios
        .get("http://127.0.0.1:8000/api/reports")
        .then((response) => {
          this.reports = response.data.map((report) => ({
            ...report,
            created_time: new Date(report.created_time).toLocaleString(),
            Langaugedirection: `${report.Langaugedirection}`,
          }));
        })
        .catch((error) => {
          console.error("Error fetching reports:", error);
        });
    },
    fetchTranslations(reportId) {
      axios
        .get(`http://127.0.0.1:8000/api/reports/${reportId}/translations`)
        .then((response) => {
          this.translations = response.data;
        })
        .catch((error) => {
          console.error("Error fetching translations:", error);
        });
    },
  },
  mounted() {
    this.fetchReports();
  },
};
</script>
<style scoped>
/* Reset default browser styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  color: #333;
}

.dashboard-container {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-gap: 10px;
}

/* Header Styling */
.header {
  background-color: #fff;
  padding: 15px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center; /* Align header elements vertically */
}

.header h1 {
  font-size: 20px;
  margin: 0;
}

.header-nav {
  display: flex;
  align-items: center;
}

.header-nav a {
  margin-right: 15px;
  text-decoration: none;
  color: #333;
}

/* Navigation Bar Styling */
.nav {
  background-color: #fefefe;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav li {
  padding: 5px 5px;
  margin-bottom: 8px;
  color: #fff;
  border-radius: 6px;
  background-color: #1f6638;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.nav li:hover {
  background-color: #555;
}

.nav li:last-child {
  margin-bottom: 0;
}
/* Sidebar Styling */
.sidebar {
  background-color: #fff;
  padding: 15px;
}

/* Main Content Styling */
.main-content {
  flex: 1;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* Table Styling */
.table {
  width: 100%;
  font-size: 14px;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.table th {
  background-color: #f2f2f2;
}

.table tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

.table tbody tr:hover {
  background-color: #ddd;
}

/* Add border-bottom to all td elements */
.table th,
.table td {
  border-bottom: 1px solid #ddd;
}
.table tbody tr:last-child td {
  border-bottom: none;
}
/* Form Styling */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input[type="text"],
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Button Styling */
.btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background-color: #0056b3;
}
/* Placeholder Message Styling */
.placeholder {
  text-align: center;
  font-style: italic;
  color: #999;
}
</style>
