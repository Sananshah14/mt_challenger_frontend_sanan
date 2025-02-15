<template>
  <div v-if="comparisonData">
    <h3>Comparison Results</h3>
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th v-for="(engine, index) in selectedEngines" :key="index">
            {{ engine.engine_name }}
          </th>
          <th>Average</th>
        </tr>
      </thead>
      <tbody>
        <!-- Display rows for each category -->
        <tr
          v-for="(data, category) in comparisonData.result"
          :key="category"
          @click="showDetails(category)"
          class="clickable-row"
        >
          <td>{{ category }}</td>
          <td
            v-for="(accuracy, index) in data.data"
            :key="index"
            :style="{ fontWeight: accuracy.significant ? 'bold' : 'normal' }"
          >
            {{ (accuracy.accuracy * 100).toFixed(2) }}%
          </td>
          <td>{{ (data.average * 100).toFixed(2) }}%</td>
        </tr>

        <tr>
          <td><strong>Micro-average</strong></td>
          <td
            v-for="(avg, reportId) in comparisonData.micro_averages"
            :key="reportId"
          >
            {{ (avg * 100).toFixed(2) }}%
          </td>
        </tr>
        <tr>
          <td><strong>Macro-average</strong></td>
          <td
            v-for="(avg, reportId) in comparisonData.macro_averages"
            :key="reportId"
          >
            {{ avg.toFixed(2) }}%
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal for displaying additional information -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h4>Details for {{ selectedCategory }}</h4>
        <div class="modal-table-container">
          <table class="modal-table">
            <thead>
              <tr>
                <th class="fixed-column">ID</th>
                <th class="fixed-column">Source Sentence</th>
                <th class="fixed-column">Category</th>
                <th class="fixed-column">Phenomenon</th>
                <th v-for="engine in selectedEngines" :key="engine.reportid">
                  {{ engine.engine_name }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in modalData" :key="index">
                <td class="fixed-column">{{ item.id }}</td>
                <td class="fixed-column">{{ item.source_sentence }}</td>
                <td class="fixed-column">{{ item.category_name }}</td>
                <td class="fixed-column">{{ item.phenomenon_name }}</td>
                <td v-for="engine in selectedEngines" :key="engine.reportid">
                  <div v-if="item.translations[engine.engine_name]">
                    {{ item.translations[engine.engine_name] }}
                  </div>
                  <div v-else>-</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"; // Import axios for making HTTP requests

export default {
  name: "Summary",
  props: {
    comparisonData: {
      type: Object,
      required: true,
    },
    selectedEngines: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      showModal: false,
      selectedCategory: null,
      modalData: [],
    };
  },
  methods: {
    async showDetails(category) {
      this.selectedCategory = category;
      this.showModal = true;
      await this.fetchModalData(category);
    },
    closeModal() {
      this.showModal = false;
      this.selectedCategory = null;
    },
    async fetchModalData(category) {
      try {
        const encodedCategory = encodeURIComponent(category);

        // Create a comma-separated string of report IDs
        const reportIds = this.selectedEngines
          .map((engine) => engine.reportid)
          .join(",");

        // Construct the URL with the report IDs as a single parameter
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/api/category/${encodedCategory}/test-items/?reports=${reportIds}`
        );

        this.modalData = response.data;
      } catch (error) {
        console.error("Error fetching modal data:", error);
        this.modalData = [];
      }
    },
  },
  mounted() {
    console.log("comparisonData:", this.comparisonData);
  },
};
</script>

<style scoped>
/* Add your CSS styling here */
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background-color: #f2f2f2;
}
.fixed-column {
  width: 150px; /* Set a fixed width for the columns */
  white-space: nowrap; /* Prevent text wrapping */
  overflow: hidden; /* Hide overflow */
  text-overflow: ellipsis; /* Add ellipsis for overflow text */
  position: sticky; /* Make the column sticky */
  left: 0; /* Align to the left */
  background: #f2f2f2; /* Background color for sticky columns */
  z-index: 1; /* Ensure it stays above other content */
}
.clickable-row {
  cursor: pointer;
  transition: background-color 0.3s;
}
.clickable-row:hover {
  background-color: #f1f1f1;
}
.modal {
  display: block; /* Hidden by default */
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}
.modal-content {
  background-color: #fefefe;
  margin: 5% auto; /* Adjusted margin for better centering */
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-height: 80%; /* Limit the height of the modal */
  overflow-y: auto; /* Enable vertical scrolling */
}
.modal-table-container {
  max-height: 60vh; /* Limit the height of the table */
  overflow-y: auto; /* Enable vertical scrolling for the table */
}
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}
.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
