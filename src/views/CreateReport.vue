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
                  <th>Template ID</th>
                  <th>Engine</th>
                  <th>Engine Type</th>
                  <th>Language Direction</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(file, index) in selectedFiles" :key="index">
                  <td>
                    <input v-model="file.fileName" class="form-control" />
                  </td>
                  <td>
                    <input v-model="file.template" class="form-control" />
                  </td>
                  <td>
                    <input v-model="file.engine" class="form-control" />
                  </td>
                  <td>
                    <input v-model="file.engine_type" class="form-control" />
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
                      v-model="file.comment"
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
import axios from "axios";

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
        const templateIDMatch = fileList[i].name.match(/template_(\d+)\./);
        const templateID = templateIDMatch ? templateIDMatch[1] : "";

        this.selectedFiles.push({
          legacy_id: null,
          template: templateID,
          engine: "",
          engine_type: "",
          comment: "",
        });
      }
    },
    createReport() {
      axios
        .post("http://127.0.0.1:8000/api/reports/", {
          reports: this.selectedFiles,
        })
        .then((response) => {
          console.log("Report creation successful", response.data);
          this.selectedFiles = [];
        })
        .catch((error) => {
          console.error("Error creating report", error);
        });
    },
  },
};
</script>
