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
              <option value="deen">De -> En</option>
              <option value="ende">En -> De</option>
              <option value="rnen">RN -> En</option>
            </select>
          </div>
          <div class="col-md">
            <label for="howMany">How many sentences</label>
            <input
              type="number"
              id="howMany"
              class="form-control"
              v-model="howMany"
            />
          </div>
          <div class="col-md">
            <label for="Choose Categories/Phenomena"
              >Choose Categories/Phenomena:</label
            >
            <input
              type="text"
              id="categoryInput"
              class="form-control"
              placeholder="Choose Categories/Phenomena"
              @click="toggleCategoryList"
            />
            <div
              id="categoryList"
              class="category-list"
              v-show="isCategoryListVisible"
            >
              <div class="selected-options">
                <span
                  v-for="selectedCategory in Categories"
                  :key="selectedCategory"
                  class="selected-option"
                >
                  {{ selectedCategory }}
                </span>
                <span
                  v-for="selectedSubcategory in Phenomenon"
                  :key="selectedSubcategory"
                  class="selected-option"
                >
                  {{ selectedSubcategory }}
                </span>
              </div>
              <label class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  v-model="selectAll"
                  @change="toggleAllPhenomenon"
                />
                All
              </label>
              <div
                v-for="(category, index) in categories"
                :key="index"
                class="category"
              >
                <label class="form-check">
                  <input
                    type="checkbox"
                    :value="category.name"
                    v-model="Categories"
                    @change="toggleSubcategories(category)"
                  />
                  {{ category.name }}
                </label>
                <div class="subcategory-list">
                  <label
                    v-for="(subcategory, subIndex) in category.Phenomenon"
                    :key="subIndex"
                    class="form-check"
                  >
                    <input
                      type="checkbox"
                      :value="subcategory"
                      :disabled="!Categories.includes(category.name)"
                      v-model="Phenomenon"
                    />
                    {{ subcategory }}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md">
            <button
              class="btn btn-primary"
              @click="createTestSet"
              style="float: left; margin-top: 32px"
            >
              Create Test Set
            </button>
          </div>
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
import axios from "axios";
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
      Categories: [],
      Phenomenon: [],
      isCategoryListVisible: false,
      selectedLanguage: "",
      howMany: "",
      sen: "",
      isCreating: false,
      categories: [
        {
          name: "Ambiguity",
          Phenomenon: ["Structure", "Lexical Structure"],
        },
        {
          name: "Composition",
          Phenomenon: ["Compound", "Phrasal Verb"],
        },
        {
          name: "Coordination and Ellipsis",
          Phenomenon: ["Gapping", "Right Not Raising", "Slucing"],
        },
        // Add other categories and Phenomenon as needed
      ],
    };
  },
  methods: {
    async createTestSet() {
      try {
        this.isCreating = true;
        const selectedLanguage = this.selectedLanguage;

        // Check if selectedLanguage is empty
        if (!selectedLanguage) {
          this.source_language = "";
          this.target_language = "";
        }

        const source_language = selectedLanguage.substring(0, 2);
        const target_language = selectedLanguage.substring(2);
        const testset = {
          source_language: source_language,
          target_language: target_language,
          categories: this.Categories,
          Phenomenon: this.Phenomenon,
          howMany: this.howMany,
        };

        // Make a POST request to send the test data to the server
        const response = await axios.post(
          "http://127.0.0.1:8000/api/testitems/filter_test_items/",
          testset
        );

        // Handle the response here, which contains the filtered TestItem objects
        console.log(response.data);

        // Update the tableData with the response data
        this.tableData = response.data.map((item) => ({
          dataPointId: item[0],
          source: item[1],
          category: item[2],
          barrier: item[3],
        }));

        // Reset the form
        this.Categories = [];
        this.Phenomenon = [];
        this.selectedLanguage = "De -> En";
        this.howMany = 0;
        this.sen = "";
        this.showTable = true;
      } catch (error) {
        console.error("Error creating test set:", error);
      } finally {
        this.isCreating = false;
      }
    },
    toggleAllPhenomenon() {
      if (this.selectAll) {
        this.Categories = this.categories.map((category) => category.name);
        this.Phenomenon = this.categories.flatMap(
          (category) => category.Phenomenon
        );
      } else {
        this.Categories = [];
        this.Phenomenon = [];
      }
    },
    toggleSubcategories(category) {
      if (this.Categories.includes(category.name)) {
        this.selectedSubcategories = this.selectedSubcategories.filter(
          (subcategory) => !category.Phenomenon.includes(subcategory)
        );
      } else {
        this.selectedSubcategories = [
          ...this.selectedSubcategories,
          ...category.subcategories,
        ];
      } // Update selectAll status
      this.selectAll =
        this.Categories.length === this.categories.length &&
        this.Phenomenon.length ===
          this.categories.flatMap((cat) => cat.Phenomenon).length;
    },
    toggleCategoryList() {
      this.isCategoryListVisible = !this.isCategoryListVisible;
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
.selected-option {
  display: inline-block;
  margin-right: 10px; /* Add some spacing between options */
}
</style>
