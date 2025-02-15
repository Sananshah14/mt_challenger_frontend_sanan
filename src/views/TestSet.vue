<template>
  <div class="container" style="margin-top: 20px">
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="col-md">
            <label for="languageDirection">Source Language:</label>
            <select
              id="languageDirection"
              class="form-control"
              v-model="SourceLanguage"
            >
              <option value="de">German</option>
              <option value="en">English</option>
              <option value="rn">Russain</option>
            </select>
          </div>
          <div class="col-md">
            <label for="languageDirection">Target Language:</label>
            <select
              id="languageDirection"
              class="form-control"
              v-model="TargetLanguage"
            >
              <option value="de">German</option>
              <option value="en">English</option>
              <option value="rn">Russain</option>
            </select>
          </div>
          <div class="col-md">
            <label for="howMany">How many sentences</label>
            <input
              type="number"
              id="howMany"
              class="form-control"
              v-model="howMany"
              min="0"
            />
          </div>
          <div class="col-md">
            <label for=" ">Select Categories and Phenomenon</label>
               
              <input class="form-control" @click="toggleCategoryList" >
              
          

              <transition name="slide-fade">
                <div
                  v-show="isCategoryListVisible"
                  class="category-select__dropdown"
                >
                  <div class="dropdown-header">
                    <label class="select-all">
                      <input
                        type="checkbox"
                        v-model="selectAll"
                        @change="toggleAllPhenomenon"
                      />
                      <span class="checkmark"></span>
                      Select All
                    </label>
                  </div>

                  <div class="dropdown-list">
                    <div
                      v-for="(category, index) in categories"
                      :key="index"
                      class="category-item"
                    >
                      <label class="category-label">
                        <input
                          type="checkbox"
                          :value="category.name"
                          v-model="Categories"
                          @change="toggleSubcategories(category)"
                        />
                        <span class="checkmark"></span>
                        <span class="category-name">{{ category.name }}</span>
                      </label>

                      <div class="subcategory-list">
                        <label
                          v-for="(subcategory, subIndex) in category.Phenomenon"
                          :key="subIndex"
                          class="subcategory-item"
                        >
                          <input
                            type="checkbox"
                            :value="subcategory"
                            :disabled="!Categories.includes(category.name)"
                            v-model="Phenomenon"
                          />
                          <span class="checkmark"></span>
                          {{ subcategory }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
           
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

  <div
    class="container"
    v-if="showTable"
    style="margin-top: 20px; color: black"
  >
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-body">
            <DataTable :tableData="tableData" />
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
      SourceLanguage: "",
      TargetLanguage: "",
      howMany: "",
      sen: "",
      isCreating: false,
      categories: [],
    };
  },
  created() {
    // Fetch data from the API when the component is created
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/categories/"
        );
        // Extract the data from the response
        const categoryData = response.data;

        // Map the category data to the format expected by your component
        this.categories = categoryData.map((category) => ({
          name: category.name,
          Phenomenon: category.phenomenon_set.map((item) => item.name),
        }));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    async createTestSet() {
      try {
        this.isCreating = true;

        if (this.SourceLanguage == this.TargetLanguage) {
          alert(
            "Source language and Target language are same. Please enter different source language and target language"
          );
          return;
        }
        const testset = {
          source_language: this.SourceLanguage,
          target_language: this.TargetLanguage,
          categories: this.Categories,
          Phenomenon: this.Phenomenon,
          howMany: this.howMany,
        };

        // Make a POST request to send the test data to the server
        const response = await axios.post(
          "http://127.0.0.1:8000/api/testitems/filter_test_items/",
          testset
        );

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

.category-select {
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
}




.selected-tag {
  background-color: #007bff;
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
  margin: 2px;
}


.category-select__dropdown {
  max-height: 300px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.category-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.category-label {
  display: flex;
  align-items: center;
}

.checkmark {
  margin-right: 10px;
}

.subcategory-list {
  margin-left: 20px;
  padding-top: 5px;
}

.subcategory-item {
  display: flex;
  align-items: center;

}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
