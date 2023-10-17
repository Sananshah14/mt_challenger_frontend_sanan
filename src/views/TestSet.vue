<template>
  <div class="container">
    <div class="card">
      <div class="card-header">Test Set</div>
      <div class="card-body">
        <div class="row">
          <div class="col-md">
            <label for="languageDirection">Language Direction:</label>
            <select
              id="languageDirection"
              class="form-control"
              v-model="selectedLanguage"
            >
              <option value="De -> En">De -> En</option>
              <option value="En -> De">En -> De</option>
              <option value="RN -> En">RN -> En</option>
            </select>
          </div>
          <div class="col-md">
            <label
              for="category"
              style="
                font-weight: bold;
                margin-top: 10px;
                display: block;
                text-align: center;
              "
              >Choose Categories/Phenomena:</label
            >
            <label style="margin-top: 10px">
              <input
                type="checkbox"
                v-model="selectAll"
                @change="toggleAllSubcategories"
              />
              All
            </label>
            <div
              v-for="(category, index) in categories"
              :key="index"
              class="category"
            >
              <label style="margin-top: 10px">
                <input
                  type="checkbox"
                  :value="category.name"
                  v-model="selectedCategories"
                  @change="toggleSubcategories(category)"
                />
                {{ category.name }}
              </label>
              <div class="subcategory-list">
                <label
                  v-for="(subcategory, subIndex) in category.subcategories"
                  :key="subIndex"
                  style="margin-top: 5px"
                >
                  <input
                    type="checkbox"
                    :value="subcategory"
                    :disabled="!selectedCategories.includes(category.name)"
                    v-model="selectedSubcategories"
                  />
                  {{ subcategory }}
                </label>
              </div>
            </div>
          </div>
          <div class="col-md">
            <label for="howMany">How many sentences</label>
            <input
              type="number"
              id="howMany"
              class="form-control"
              min="0"
              max="100"
            />
          </div>
        </div>
        <div class="col-md">
          <button
            class="btn btn-primary"
            @click="createTestSet"
            style="float: left"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="container" style="margin-top: 20px; color: black">
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-body">
            <DataTable v-if="showTable" :tableData="tableData" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from "axios";
import DataTable from "../views/components/DataTable.vue";
export default {
  components: {
    DataTable,
  },
  data() {
    return {
      showTable: false,
      tableData: [],
      selectAll: false,
      selectedCategories: [],
      selectedSubcategories: [],
      selectedLanguage: "De -> En",
      howMany: 0,
      sen: "",
      isCreating: false,
      categories: [
        {
          name: "Ambiguity",
          subcategories: ["Structure", "Lexical Structure"],
        },
        {
          name: "Composition",
          subcategories: ["Compound", "Phrasal Verb"],
        },
        {
          name: "Coordination and Ellipsis",
          subcategories: ["Gapping", "Right Not Raising", "Slucing"],
        },
        // Add other categories and subcategories as needed
      ],
    };
  },
  methods: {
    async createTestSet() {
      try {
        this.isCreating = true;
        const testset = {
          language: this.selectedLanguage,
          categories: this.selectedCategories,
          subcategories: this.selectedSubcategories,
          howMany: this.howMany,
          sen: this.sen,
        };
        if (this.howMany > 100) {
          alert("Percentage cannot exceed 100%");
          return;
        }
        this.tableData = [
          {
            dataPointId: "DP001",
            source: "Source A",
            category: "Cat A",
            barrier: "Barrier 1",
          },
          {
            dataPointId: "DP002",
            source: "Source B",
            category: "Cat B",
            barrier: "Barrier 2",
          },
          {
            dataPointId: "DP003",
            source: "Source C",
            category: "Cat A",
            barrier: "Barrier 3",
          },
        ];
        this.showTable = true;
        // Make a POST request to send the test data to the server
        // const response = await axios.post("YOUR_CREATE_ENDPOINT", testData);
        // console.log("Test Set Created:", response.data);
        console.log("Test Set" + testset);

        // Reset the form
        this.selectedCategories = [];
        this.selectedSubcategories = [];
        this.selectedLanguage = "De -> En";
        this.howMany = 0;
        this.sen = "";
      } catch (error) {
        console.error("Error creating test set:", error);
        this.isCreating = false;
      }
    },
    toggleAllSubcategories() {
      if (this.selectAll) {
        this.selectedCategories = this.categories.map(
          (category) => category.name
        );
        this.selectedSubcategories = this.categories.flatMap(
          (category) => category.subcategories
        );
      } else {
        this.selectedCategories = [];
        this.selectedSubcategories = [];
      }
    },
    toggleSubcategories(category) {
      if (this.selectedCategories.includes(category.name)) {
        this.selectedSubcategories = this.selectedSubcategories.filter(
          (subcategory) => !category.subcategories.includes(subcategory)
        );
      } else {
        this.selectedSubcategories = [
          ...this.selectedSubcategories,
          ...category.subcategories,
        ];
      }

      // Update selectAll status
      this.selectAll =
        this.selectedCategories.length === this.categories.length &&
        this.selectedSubcategories.length ===
          this.categories.flatMap((cat) => cat.subcategories).length;
    },
  },
};
</script>

<style>
.category-list {
  margin-top: 10px;
}

.subcategory-list {
  margin-top: 10px;
  margin-left: 20px;
}
</style>
