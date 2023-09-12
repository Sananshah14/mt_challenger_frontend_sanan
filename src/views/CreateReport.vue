<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-6">
        <h2>Create Report</h2>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row">
      <div class="col-lg-12">
        <!-- Div 1: File Upload -->
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">File Upload</h5>
            <input
              type="file"
              class="form-control"
              @change="handleFileUpload"
            />
            <!-- Add drag and drop functionality here if desired -->
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row">
      <div class="col-lg-12">
        <!-- Div 2: Form as Table -->
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Form</h5>
            <table class="table">
              <thead>
                <tr>
                  <th>FileName</th>
                  <th>SetID</th>
                  <th>Choose Engine</th>
                  <th>Type of Engine</th>
                  <th>Language Direction</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(file, index) in selectedFiles" :key="index">
                  <td>
                    <input v-model="file.fileName" class="form-control" />
                  </td>
                  <td><input v-model="file.setID" class="form-control" /></td>
                  <td>
                    <select v-model="file.chooseEngine" class="form-select">
                      <option value="">Select Engine</option>
                      <!-- Add options for ChooseEngine -->
                    </select>
                  </td>
                  <td>
                    <select v-model="file.typeOfEngine" class="form-select">
                      <option value="">Select Type of Engine</option>
                      <!-- Add options for TypeofEngine -->
                    </select>
                  </td>
                  <td>
                    <select
                      v-model="file.languageDirection"
                      class="form-select"
                    >
                      <option value="">Select Language Direction</option>
                      <!-- Add options for LanguageDirection -->
                    </select>
                  </td>
                  <td>
                    <textarea
                      v-model="file.comments"
                      class="form-control"
                    ></textarea>
                  </td>
                </tr>
              </tbody>
            </table>
            <button @click.prevent="createReport" class="btn btn-primary">
              Create Report
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateReport",
  data() {
    return {
      selectedFiles: [],
    };
  },
  methods: {
    handleFileUpload(event) {
      const fileList = event.target.files;
      for (let i = 0; i < fileList.length; i++) {
        this.selectedFiles.push({
          fileName: fileList[i].name,
          setID: "",
          chooseEngine: "",
          typeOfEngine: "",
          languageDirection: "",
          comments: "",
        });
      }
    },
    createReport() {
      // Logic to create the report based on selectedFiles
      console.log(this.selectedFiles);
      // Reset the form or perform other actions as needed
      this.selectedFiles = [];
    },
  },
};
</script>
