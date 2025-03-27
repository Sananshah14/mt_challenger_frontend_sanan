<template>
  <div class="container" style="margin-top: 20px">
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="col-md">
            <label for="languagePair">Language Pair:</label>
            <div class="custom-dropdown">
              <button
                class="btn btn-secondary dropdown-toggle w-100"
                @click="toggleDropdown"
              >
                <i :class="selectedLanguageIcon"></i>
                {{ selectedLanguageText }}
              </button>
              <div v-if="isDropdownVisible" class="dropdown-menu show">
                <div
                  v-for="(option, index) in languageOptions"
                  :key="index"
                  class="dropdown-item"
                  @click="selectLanguage(option)"
                >
                  <span class="language-text">
                    {{ option.source }}
                    <i class="fas fa-arrow-right arrow-icon"></i>
                    {{ option.target }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md">
            <label for="selectionType">Selection Type:</label>
            <select
              id="selectionType"
              class="form-control"
              v-model="selectionType"
            >
              <option value="number">Number</option>
              <option value="percentage">Percentage</option>
            </select>
          </div>
          <div class="col-md">
            <label for="selectionValue">{{
              selectionType === "number" ? "How Many" : "Percentage"
            }}</label>
            <input
              type="number"
              id="selectionValue"
              class="form-control"
              v-model="selectionValue"
              :min="selectionType === 'percentage' ? 1 : 0"
              :max="selectionType === 'percentage' ? 100 : ''"
            />
          </div>
          <div class="col-md">
            <label for=" ">Select Categories and Phenomenon</label>

            <input class="form-control" @click="toggleCategoryList" />

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
              Test Set Creation
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
      selectedSubcategories: [],
      isCategoryListVisible: false,
      selectedLanguagePair: "",
      SourceLanguage: "",
      TargetLanguage: "",
      howMany: "",
      isCreating: false,
      categories: [],
      isDropdownVisible: false,
      selectionType: "number",
      selectionValue: "",
      languageOptions: [
        {
          value: "deen",
          source: "German",
          target: "English",
          icon: "fas fa-flag",
        },
        {
          value: "ende",
          source: "English",
          target: "German",
          icon: "fas fa-flag",
        },
        {
          value: "rnde",
          source: "Russian",
          target: "German",
          icon: "fas fa-flag",
        },
        {
          value: "deru",
          source: "German",
          target: "Russian",
          icon: "fas fa-flag",
        },
      ],
    };
  },
  computed: {
    selectedLanguageText() {
      const selected = this.languageOptions.find(
        (option) => option.value === this.selectedLanguagePair
      );
      return selected
        ? `${selected.source} ${selected.target}`
        : "Select Language Pair";
    },
    selectedLanguageIcon() {
      const selected = this.languageOptions.find(
        (option) => option.value === this.selectedLanguagePair
      );
      return selected ? selected.icon : "";
    },
  },
  created() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/categories/"
        );

        const categoryData = response.data;

        this.categories = categoryData.map((category) => ({
          name: category.name,
          Phenomenon: category.phenomenon_set.map((item) => item.name),
        }));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    updateLanguages() {
      const languageMap = {
        deen: { source: "de", target: "en" },
        ende: { source: "en", target: "de" },
        rnde: { source: "ru", target: "de" },
        deru: { source: "de", target: "ru" },
      };
      const selected = languageMap[this.selectedLanguagePair];
      this.SourceLanguage = selected.source;
      this.TargetLanguage = selected.target;
    },
    async createTestSet() {
      try {
        this.isCreating = true;

        if (this.SourceLanguage === this.TargetLanguage) {
          alert(
            "Source language and Target language are the same. Please select different languages."
          );
          return;
        }
        const testset = {
          source_language: this.SourceLanguage,
          target_language: this.TargetLanguage,
          categories: this.Categories,
          Phenomenon: this.Phenomenon,
          [this.selectionType === "percentage" ? "percentage" : "howMany"]: this
            .selectionValue,
        };

        // Make a POST request to send the test data to the server
        const response = await axios.post(
          "http://127.0.0.1:8000/api/testitems/filter_test_items/",
          testset
        );

        this.tableData = response.data.map((item) => ({
          id: item.id,
          source_sentence: item.source_sentence,
          category_name: item.category_name,
          phenomenon_name: item.phenomenon_name,
        }));

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
    toggleDropdown() {
      this.isDropdownVisible = !this.isDropdownVisible;
    },
    selectLanguage(option) {
      this.selectedLanguagePair = option.value;
      this.updateLanguages();
      this.isDropdownVisible = false;
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

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.custom-dropdown {
  position: relative;
  margin-bottom: -10;
}

.custom-dropdown .dropdown-menu {
  color: #ccc;
  background-color: #d8dadc;
  border: 1px solid black;
  z-index: 1000;
  width: 100%;
  margin-top: 0;
}

.dropdown-item {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  margin: 0;
}

.dropdown-item:hover {
  background-color: #757474;
}

.arrow-icon {
  margin-left: 10px;
}

.language-text {
  flex-grow: 1;
}
</style>
