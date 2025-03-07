<template>
  <div class="controls">
    <span class="form-group">
      <label for="range">
        <h5>
          Scramble factor for exporting:<input
            type="number"
            class="input-control"
            v-model="value"
            min="2"
            max="10"
            step="0.5"
            style="width: 60px; margin-left: 10px"
            @input="updateValueFromInput"
          />
        </h5>
      </label>

      <input
        type="range"
        class="range"
        id="range"
        v-model="value"
        min="2"
        max="10"
        step="0.5"
        style="width: 300px; margin-left: 10px; color: beige"
        @input="updateValueFromRange"
      />
    </span>
    <button
      class="download-button"
      @click="downloadTextFile"
      style="margin-left: auto"
    >
      <i class="fas fa-download"></i> Download
    </button>
  </div>

  <div>
    <table class="custom-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Source Sentence</th>
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
          <td>{{ item.id }}</td>
          <td>{{ item.source_sentence }}</td>
          <td>{{ item.category_name }}</td>
          <td>{{ item.phenomenon_name }}</td>
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
      isLoading: false,
      value: 2,
    };
  },
  props: {
    tableData: Array,
  },
  components: {},
  methods: {
    updateValueFromRange(event) {
      this.value = parseFloat(event.target.value);
    },
    updateValueFromInput(event) {
      const inputValue = parseFloat(event.target.value);
      if (inputValue >= 2 && inputValue <= 10) {
        this.value = inputValue;
      }
    },
    loadData() {
      this.tableData.map(
        (item) =>
          `${item.id},${item.source_sentence},${item.category_name},${item.phenomenon_name}`
      );
    },

    async downloadTextFile() {
      try {
        const testItemIds = this.tableData.map((item) => item.id);
        const response = await axios.post(
          "http://127.0.0.1:8000/api/testitems/download_text_file/",
          {
            scramblingFactor: this.value,
            content: testItemIds,
          }
        );

        const templateId = response.data.template_id;
        const textFileContent = response.data.text_file_content;

        if (templateId && textFileContent) {
          const blob = new Blob([textFileContent], { type: "text/plain" });
          const filename = `template_${templateId}.txt`;

          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = filename;

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          console.error("Template ID or text file content is undefined.");
        }
      } catch (error) {
        console.error("Error downloading text file:", error);
      }
    },
    getRowStyle(index) {
      return {
        backgroundColor: index % 2 === 0 ? "#F0F0F0" : "#E0E0E0",
      };
    },
    debounce(func, delay) {
      let timeout;
      return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
      };
    },
  },
  watch: {
    tableData: {
      immediate: true,
      handler() {
        this.isLoading = false;
        if (!this.tableData.length) {
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
.controls {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.range {
  -webkit-appearance: none;
  appearance: none;
  height: 5px;
  background: #ddd;
  border-radius: 5px;
}

.range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #007bff;
  cursor: pointer;
}

.range::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #007bff;
  cursor: pointer;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  margin-bottom: 50px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
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
  background-color: hwb(211 7% 17%);
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 18px;
}

.download-button:hover {
  background-color: #0056b3;
}
</style>
