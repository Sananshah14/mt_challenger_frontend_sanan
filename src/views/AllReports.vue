<template>
  <div id="app" class="dashboard-container">
    <!-- Sidebar component to display all reports -->
    <div class="sidebar">
      <div class="nav">
        <li>
          <input
            type="text"
            class="search-input"
            v-model="Search"
            placeholder="Search Report"
            style="width: 100%"
          />
        </li>
        <ul>
          <li
            v-for="report in paginatedReports"
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
        <div class="pagination">
          <button @click="prevPage('reports')" :disabled="reportPage === 1">
            Previous
          </button>
          <span>Page {{ reportPage }} of {{ totalReportPages }}</span>
          <button
            @click="nextPage('reports')"
            :disabled="reportPage === totalReportPages"
          >
            Next
          </button>
        </div>
      </div>
    </div>
    <div class="main-content" v-if="isReportSelected">
      <table class="table table-hover table-bordered">
        <thead>
          <tr>
            <th>
              Info
              <select
                v-model="filters.info"
                class="filter-input"
                @change="applyFilters"
                style="width: 100px"
              >
                <option value="">All</option>
                <option value="1">Pass</option>
                <option value="2">Fail</option>
                <option value="3">Warning</option>
                <option value="4">Conflict</option>
              </select>
            </th>
            <th>
              ID
              <input
                type="text"
                v-model="filters.id"
                class="filter-input"
                @input="applyFilters"
                placeholder="Start typing"
                style="width: 100px"
              />
            </th>
            <th>
              Source
              <input
                type="text"
                v-model="filters.source"
                class="filter-input"
                @input="applyFilters"
                placeholder="Start typing"
                style="width: auto"
              />
            </th>
            <th>
              Category
              <input
                type="text"
                v-model="filters.category"
                class="filter-input"
                @input="applyFilters"
                placeholder="Start typing"
                style="width: auto"
              />
            </th>
            <th>
              Phenomenon
              <input
                type="text"
                v-model="filters.phenomenon"
                class="filter-input"
                @input="applyFilters"
                placeholder="Start typing"
                style="width: auto"
              />
            </th>
            <th>
              Translation
              <input
                type="text"
                v-model="filters.translation"
                class="filter-input"
                @input="applyFilters"
                placeholder="Start typing"
                style="width: auto"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="translation in paginatedTranslations"
            :key="translation.id"
            :class="getRowClass(translation.label)"
            @click="openPopup(translation.id)"
          >
            <td>{{}}</td>
            <td>{{ translation.id }}</td>
            <td>{{ translation.source_sentence }}</td>
            <td>{{ translation.category_name }}</td>
            <td>{{ translation.phenomenon_name }}</td>
            <td>{{ translation.sentence }}</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button
          @click="prevPage('translations')"
          :disabled="translationPage === 1"
        >
          Previous
        </button>
        <span>Page {{ translationPage }} of {{ totalTranslationPages }}</span>
        <button
          @click="nextPage('translations')"
          :disabled="translationPage === totalTranslationPages"
        >
          Next
        </button>
      </div>
      <PopupCard
        v-if="popupVisible"
        :translationId="selectedTranslationData"
        @close="closePopup"
      />
      <p v-if="!isReportSelected" class="placeholder">
        No report selected. Please select a report from the sidebar.
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import PopupCard from "../views/components/PopupCard.vue";

export default {
  data() {
    return {
      Search: "",
      reports: [],
      selectedReport: null,
      translations: [],
      popupVisible: false,
      selectedTranslationData: null,
      filters: {
        info: "",
        id: "",
        source: "",
        category: "",
        phenomenon: "",
        translation: "",
      },
      // Pagination data
      reportPage: 1,
      translationPage: 1,
      reportsPerPage: 10,
      translationsPerPage: 25,
    };
  },
  components: {
    PopupCard,
  },
  computed: {
    isReportSelected() {
      return !!this.selectedReport;
    },
    filteredTranslations() {
      return this.translations.filter((translation) => {
        const infoFilter =
          !this.filters.info || translation.label == this.filters.info;
        return (
          infoFilter &&
          this.toLowerCaseSafe(String(translation.id)).includes(
            this.filters.id.toLowerCase()
          ) &&
          this.toLowerCaseSafe(translation.source_sentence).includes(
            this.filters.source.toLowerCase()
          ) &&
          this.toLowerCaseSafe(translation.category_name).includes(
            this.filters.category.toLowerCase()
          ) &&
          this.toLowerCaseSafe(translation.phenomenon_name).includes(
            this.filters.phenomenon.toLowerCase()
          ) &&
          this.toLowerCaseSafe(translation.sentence).includes(
            this.filters.translation.toLowerCase()
          )
        );
      });
    },
    filteredReports() {
      const searchQuery = this.Search.toLowerCase();
      return this.reports.filter((report) => {
        return (
          report.id.toString().includes(searchQuery) ||
          report.engine.toLowerCase().includes(searchQuery) ||
          report.engine_type.toLowerCase().includes(searchQuery) ||
          report.template.toString().includes(searchQuery) ||
          report.language_direction.toLowerCase().includes(searchQuery)
        );
      });
    },
    paginatedReports() {
      const start = (this.reportPage - 1) * this.reportsPerPage;
      const end = start + this.reportsPerPage;
      return this.filteredReports.slice(start, end);
    },
    paginatedTranslations() {
      const start = (this.translationPage - 1) * this.translationsPerPage;
      const end = start + this.translationsPerPage;
      return this.filteredTranslations.slice(start, end);
    },
    totalReportPages() {
      return Math.ceil(this.filteredReports.length / this.reportsPerPage);
    },
    totalTranslationPages() {
      return Math.ceil(
        this.filteredTranslations.length / this.translationsPerPage
      );
    },
  },
  methods: {
    toLowerCaseSafe(value) {
      return value && value.toLowerCase
        ? value.toLowerCase()
        : String(value).toLowerCase();
    },
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
    openPopup(translationId) {
      this.selectedTranslationData = translationId;
      this.popupVisible = true;
    },
    closePopup() {
      this.popupVisible = false;
    },
    applyFilters() {
      this.filteredTranslations;
      this.translationPage = 1; // Reset to first page after applying filters
    },
    getRowClass(label) {
      switch (label) {
        case 1:
          return "pass";
        case 2:
          return "fail";
        case 3:
          return "warning";
        case 4:
          return "conflict";
        default:
          return "warning";
      }
    },
    prevPage(type) {
      if (type === "reports") {
        if (this.reportPage > 1) {
          this.reportPage--;
        }
      } else if (type === "translations") {
        if (this.translationPage > 1) {
          this.translationPage--;
        }
      }
    },
    nextPage(type) {
      if (type === "reports") {
        if (this.reportPage < this.totalReportPages) {
          this.reportPage++;
        }
      } else if (type === "translations") {
        if (this.translationPage < this.totalTranslationPages) {
          this.translationPage++;
        }
      }
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

/* Main Content Styling */
.main-content {
  margin-bottom: 80px;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 5px 6px rgba(0, 0, 0, 0.5);
}

/* Table Styling */
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  margin-top: 20px;
}

.table th,
.table td {
  padding: 15px 15px;
  text-align: left;
  vertical-align: middle;
}

.table thead th {
  background-color: #f9f9f9;
  color: #333;
  border-bottom: 2px solid #ddd;
  position: sticky;
  top: 0;
  z-index: 2;
}

.table thead th input {
  margin-top: 5px;
  padding: 5px;
  width: calc(100% - 10px);
  border: 1px solid #ddd;
  border-radius: 4px;
  display: block;
}

.table thead th .filter-input {
  width: calc(100% - 20px);
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 5px;
  display: block;
}

.table tbody tr {
  background-color: #fff;
  transition: background-color 0.3s ease;
}

.table tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

.table tbody tr:hover {
  background-color: #e6f7ff;
}

.table tbody td {
  border-bottom: 1px solid #ddd;
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.table tbody td:first-child {
  border-left: 6px solid transparent; /* For status icons */
}
/* Search Input */
.search-input {
  width: auto;
  padding: 8px;
  border: 1px solid #c8b6b6;
  border-radius: 4px;
  margin-top: 5px;
}
/* Icon Styling */
.table tbody tr.pass td:first-child::before {
  content: "✔";
  color: #28a745;
}

.table tbody tr.fail td:first-child::before {
  content: "❌";
  color: #dc3545;
  margin-right: 10px;
}

.table tbody tr.warning td:first-child::before {
  content: "⚠️";
  color: #ffc107;
  margin-right: 10px;
}

.table tbody tr.conflict td:first-child::before {
  content: "⚔️";
  color: #edaed9;
  margin-right: 10px;
}

/* Row Background Colors */
.table tbody tr.pass {
  background-color: #d4edda;
}

.table tbody tr.fail {
  background-color: #f8d7da;
}

.table tbody tr.warning {
  background-color: #fff3cd;
}

.table tbody tr.conflict {
  background-color: #ebaad9;
}

/* Improved Alignment and Padding */
.table thead th,
.table tbody td {
  padding: 10px 15px;
}

.table thead th {
  font-weight: bold;
  text-transform: uppercase;
  text-align: left;
}

.table tbody td {
  text-align: left;
}

.table tbody tr {
  border-bottom: 1px solid #eee;
}

.table tbody tr:last-child {
  border-bottom: none;
}

.table tbody td:first-child::before {
  display: inline-block;
  width: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
}

.pagination button {
  padding: 5px 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 5px; /* Add margin to separate buttons */
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  font-size: 14px;
  margin: 0 10px; /* Add margin to separate text from buttons */
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

/* Sidebar Styling */
.sidebar {
  background-color: #fff;
  padding: 10px;
  margin-left: 10px;
  margin-bottom: 80px;
  border-radius: 8px;
  box-shadow: 0 5px 6px rgba(0, 0, 0, 0.5);
}

/* Sidebar Navigation Styling */
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

  font-size: 15px;
  font-weight: 1000;
}
.nav ul li {
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
  background-color: #ddd;
}

.nav ul li:hover {
  background-color: #12371f;
}

.nav ul li:last-child {
  margin-bottom: 0;
}
</style>
