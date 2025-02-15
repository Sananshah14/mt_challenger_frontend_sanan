<template>
  <div id="app" class="dashboard-container">
    <!-- Sidebar component to display all templates -->
    <div class="sidebar">
      <div class="nav">
        <input
          type="text"
          class="search-input"
          v-model="Search"
          placeholder="Search"
        />
        <ul>
          <li
            v-for="template in paginatedReports"
            :key="template.id"
            @click="selectTemplate(template)"
            class="template-item"
          >
            <div class="report-info">
              <div class="template-title">
                <span class="template-id">{{ template.id }}</span>
                <div class="template-details">
                  <span class="template-time">{{
                    formatDate(template.created_time)
                  }}</span>
                  <div class="engine-list">
                    <span
                      v-for="engine in template.engines"
                      :key="engine"
                      class="engine-item"
                    >
                      {{ engine.engine_name }}
                    </span>
                  </div>
                  <span class="template-lang">{{
                    template.language_direction
                  }}</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div class="pagination">
          <button @click="prevPage('templates')" :disabled="templatePage === 1">
            Previous
          </button>
          <span>Page {{ templatePage }} of {{ totalReportPages }}</span>
          <button
            @click="nextPage('templates')"
            :disabled="templatePage === totalReportPages"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Main content area -->
    <div class="main-content" v-if="isReportSelected">
      <div class="container border rounded p-1 my-2 bg-light">
        <h2 class="fs-4 text-primary mb-1">Matching Reports</h2>
        <div v-if="matchingReports.length" class="d-flex flex-wrap gap-1">
          <div
            class="border rounded p-1 d-flex align-items-center"
            v-for="report in matchingReports"
            :key="report.id"
            style="min-width: 200px"
          >
            <input
              type="checkbox"
              :value="report.id"
              v-model="selectedReports"
              class="form-check-input me-2"
            />
            <div>
              <span class="fw-bold">{{ report.engine }}</span>
              <small class="text-muted d-block">{{
                formatDate(report.created_time)
              }}</small>
            </div>
          </div>
        </div>
        <p v-else class="text-muted text-center my-3">
          No matching reports found.
        </p>
        <div class="text-end mt-3">
          <button
            type="button"
            class="btn btn-sm btn-primary"
            @click="fetchComparisonData(selectedReports)"
            :disabled="!selectedReports.length"
          >
            Compare Reports
          </button>
        </div>
      </div>

      <!-- Tab content rendering -->
      <div class="main-content" v-if="isReportSelected">
        <div class="tab-content">
          <component
            :is="selectedTab"
            :comparisonData="comparisonData"
            :selectedEngines="matchingReports"
          ></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"; // Import Axios
import Summary from "@/views/components/Summary.vue";

export default {
  name: "ComparisonByYear",
  data() {
    return {
      Search: "",
      templates: [],
      selectedTemplate: null,
      matchingReports: [],
      selectedReports: [],
      selectedTab: "summary",
      templatePage: 1,
      templatesPerPage: 10,
      comparisonData: null,
    };
  },
  components: {
    Summary,
  },
  computed: {
    isReportSelected() {
      return !!this.selectedTemplate;
    },
    filteredReports() {
      const searchQuery = this.Search.toLowerCase();
      return this.templates.filter((template) => {
        return (
          template.id.toString().includes(searchQuery) ||
          template.name.toLowerCase().includes(searchQuery)
        );
      });
    },
    paginatedReports() {
      const start = (this.templatePage - 1) * this.templatesPerPage;
      const end = start + this.templatesPerPage;
      return this.filteredReports.slice(start, end);
    },
    totalReportPages() {
      return Math.ceil(this.filteredReports.length / this.templatesPerPage);
    },
  },
  methods: {
    selectTemplate(template) {
      this.selectedTemplate = template;
      this.fetchMatchingReports(template.id);
    },
    fetchComparisonData(selectedReports) {
      axios
        .post(`${process.env.VUE_APP_API_BASE_URL}/api/compare-reports/`, {
          report_ids: selectedReports,
        })
        .then((response) => {
          this.comparisonData = response.data;
          this.selectedTab = "summary";
        })
        .catch((error) => {
          console.error("Error fetching comparison data:", error);
        });
    },
    fetchMatchingReports(templateId) {
      axios
        .get(
          `${process.env.VUE_APP_API_BASE_URL}/api/matching-reports/${templateId}/`
        )
        .then((response) => {
          this.matchingReports = response.data;
        })
        .catch((error) => {
          console.error("Error fetching matching reports:", error);
        });
    },
    fetchTemplates() {
      axios
        .get(`${process.env.VUE_APP_API_BASE_URL}/api/templates-with-report/`)
        .then((response) => {
          this.templates = response.data.map((template) => ({
            ...template,
            created_time: new Date(template.created_time).toISOString(),
            engines: template.engines || [],
          }));
        })
        .catch((error) => {
          console.error("Error fetching templates:", error);
        });
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const options = {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Intl.DateTimeFormat("en-GB", options)
        .format(date)
        .replace(",", "");
    },
    prevPage() {
      if (this.templatePage > 1) {
        this.templatePage--;
      }
    },
    nextPage() {
      if (this.templatePage < this.totalReportPages) {
        this.templatePage++;
      }
    },
  },
  mounted() {
    this.fetchTemplates();
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
/* Tabs Styling */
.tabs {
  display: flex;
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.3s ease;
}

.tabs button.active {
  background-color: #0056b3;
}

.tabs button:hover:not(.active) {
  background-color: #0056b3;
}

.tab-content {
  padding: 20px;
  background-color: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0 5px 6px rgba(0, 0, 0, 0.1);
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
  margin: 0 5px;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  font-size: 14px;
  margin: 0 10px;
}

.nav .search-input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
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

.nav {
  padding: 10px;
}

.nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav li {
  padding: 10px;
  margin-bottom: 8px;
  color: #333;
  border-radius: 8px;
  background-color: #1f6638;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav li:hover {
  background-color: #12371f;
}

.nav ul li:last-child {
  margin-bottom: 0;
}
.template-list {
  list-style: none;
  margin: 20px 10px;
  padding: 10px;
}

.template-item {
  display: flex;
  flex-direction: column;
  padding: 15px 20px;
  margin-bottom: 10px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.template-item:hover {
  background-color: #f1f1f1;
  transform: translateY(-2px);
}

/* Report Info */
.report-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Template Title */
.template-title {
  font-weight: bold;
  font-size: 18px;
  color: #fdfbfb;
  margin-bottom: 5px;
}

.template-id {
  font-size: 14px;
  color: #fdfbfb;
}

/* Template Details */
.template-details {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #fdfbfb;
}

/* Time and Language Styles */
.template-time,
.template-lang {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #fdfbfb;
}

.template-time i,
.template-lang i {
  font-size: 14px;
  color: #007bff;
}

/* Engine List */
.engine-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.engine-item {
  padding: 5px 10px;
  background-color: #007bff;
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  border-radius: 4px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.engine-item:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

/* Responsive Design */
@media (max-width: 768px) {
  .template-item {
    padding: 10px 15px;
  }

  .template-details {
    flex-direction: column;
    align-items: flex-start;
  }

  .engine-list {
    justify-content: flex-start;
  }
}
</style>
