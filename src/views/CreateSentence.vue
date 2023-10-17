<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <h3>Create New Sentences</h3>

        <form action="#">
          <div class="form-group">
            <label for="language">Language:</label>
            <select v-model="language" id="language" class="form-control">
              <option value="DE">German</option>
              <option value="EN">English</option>
            </select>
          </div>

          <div class="form-group">
            <label for="category">Category:</label>
            <input type="text" v-model="category" id="category" />

            <div class="select-category">
              <button type="button" @click="toggleCategoryList">
                Select Category
              </button>
              <ul v-if="showCategoryList">
                <li @click="selectCategory('Cat1')">Animals</li>
                <li @click="selectCategory('Food')">Food</li>
                <li @click="selectCategory('Travel')">Travel</li>
              </ul>
            </div>
          </div>

          <div class="form-group">
            <label for="phenomenon">Phenomenon:</label>
            <input
              type="text"
              v-model="phenomenon"
              id="phenomenon"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="source">Source:</label>
            <input
              type="text"
              v-model="source"
              id="source"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="translation">Translation:</label>
            <input
              type="text"
              v-model="translation"
              id="translation"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="positive-regex">Positive Regex:</label>
            <input
              type="text"
              v-model="positiveRegex"
              id="positive-regex"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="negative-regex">Negative Regex:</label>
            <input
              type="text"
              v-model="negativeRegex"
              id="negative-regex"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="comment">Comment:</label>
            <textarea
              v-model="comment"
              id="comment"
              class="form-control"
            ></textarea>
          </div>

          <button type="submit" class="btn btn-primary">Save Settings</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SettingsPage",
  data() {
    return {
      language: "EN",
      category: "",
      phenomenon: "",
      source: "",
      translation: "",
      positiveRegex: "",
      negativeRegex: "",
      comment: "",
      showCategoryList: false,
    };
  },
  methods: {
    methods: {
      toggleCategoryList() {
        this.showCategoryList = !this.showCategoryList;
      },
      selectCategory(selectedCategory) {
        this.category = selectedCategory;
        this.showCategoryList = true;
      },
    },
  },
};
</script>
