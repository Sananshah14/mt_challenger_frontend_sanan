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
            <thead class="sticky-header">
              <tr>
                <th>ID</th>
                <th>Source Sentence</th>
                <th>Category</th>
                <th>Phenomenon</th>
                <th v-for="engine in selectedEngines" :key="engine.reportid">
                  {{ engine.engine_name }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in modalData" :key="index">
                <td>{{ item.id }}</td>
                <td class="fixed-column">{{ item.source_sentence }}</td>
                <td>{{ item.category_name }}</td>
                <td>{{ item.phenomenon_name }}</td>

                <td
                  v-for="engine in selectedEngines"
                  :key="engine.reportid"
                  class="translation-cell"
                  :class="
                    getLabelClass(item.translations[engine.engine_name]?.label)
                  "
                  @click="openPopup(item.translations[engine.engine_name]?.id)"
                >
                  <div v-if="item.translations[engine.engine_name]">
                    {{ item.translations[engine.engine_name].sentence }}
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
  <PopupCard
    v-if="selectedTranslationId"
    :translationId="selectedTranslationId"
    @close="closePopup"
  />
</template>

<script>
import axios from "axios";
import PopupCard from "./PopupCard.vue";

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
  components: {
    PopupCard,
  },
  data() {
    return {
      showModal: false,
      selectedCategory: null,
      modalData: [],
      selectedTranslationId: null,
      showPopup: false,
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
        const reportIds = this.selectedEngines
          .map((engine) => engine.reportid)
          .join(",");

        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/api/category/${encodedCategory}/test-items/?reports=${reportIds}`
        );

        this.modalData = response.data; 
      } catch (error) {
        console.error("Error fetching modal data:", error);
        this.modalData = [];
      }
    },
    getLabelClass(label) {
      switch (label) {
        case 1:
          return "pass";
        case 2:
          return "fail";
        case 3:
          return "warning";
        case 4: // CONFLICT
          return "conflict";
        default:
          return "";
      }
    },
    openPopup(translationId) {
      this.selectedTranslationId = translationId;
      this.showPopup = true;
    },
    closePopup() {
      this.selectedTranslationId = null;
      this.showPopup = false;
    },
  },
};
</script>

<style scoped>
/* General Table Styling */
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
.clickable-row {
  cursor: pointer;
  transition: background-color 0.3s;
}
.clickable-row:hover {
  background-color: #f1f1f1;
}

/* Modal Styling */
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}
.modal-content {
  background-color: #fefefe;
  margin: 5% auto;
  border: 1px solid #888;
  width: 80%;
  max-height: 80%;
  overflow-y: auto;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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

/* Modal Table Container */
.modal-table-container {
  max-height: 60vh;
  overflow-x: auto;
  overflow-y: auto;
  white-space: nowrap;
}

/* Table Styling in Modal */
.modal-table {
  width: max-content;
  border-collapse: collapse;
}
.modal-table th,
.modal-table td {
  border: 1px solid #ddd;
  padding: 8px;
}
.sticky-header {
  position: sticky;
  top: 0;
  background: #f2f2f2;
  z-index: 2;
}

/* Fixed Source Sentence Column */
.fixed-column {
  position: sticky;
  left: 0;
  background: #f2f2f2;
  z-index: 3;
  min-width: 250px;
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  white-space: normal;
}

/* Dynamic Translation Cells */
.translation-cell {
  min-width: 200px;
  max-width: 300px;
  white-space: normal;
  padding: 10px;
}

/* Background Colors for Labels */
.pass {
  background-color: #c8e6c9; /* Light green */
  color: black; /* Ensure text is visible */
}

.fail {
  background-color: #ffcdd2; /* Light red */
  color: black; /* Ensure text is visible */
}

.warning {
  background-color: #fff9c4; /* Light yellow */
  color: black; /* Ensure text is visible */
}

.conflict {
  background-color: #d1c4e9; /* Light purple */
  color: black; /* Ensure text is visible */
}

/* Ensuring the Source Sentence Column Doesn't Overlap */
.fixed-column:nth-child(2) {
  left: 0;
  z-index: 3;
}
</style>
