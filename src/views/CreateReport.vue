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
            <h5 class="card-title">Upload Multiple File</h5>
            <input
              type="file"
              class="form-control"
              @change="handleFileUpload"
              multiple
            />
            <!-- Drag and Drop Area -->
            <div
              class="drop-zone"
              @dragover.prevent
              @drop.prevent="handleDrop"
              @dragleave="handleDragLeave"
              @dragenter="handleDragEnter"
            >
              <p>Drag and drop files here or click to upload</p>
            </div>
            <!-- Display Uploaded File Names -->
            <div v-if="selectedFiles.length > 0" class="mt-3">
              <h6>Uploaded Files:</h6>
              <ul>
                <li v-for="(file, index) in selectedFiles" :key="index">
                  {{ file.fileName }}
                </li>
              </ul>
            </div>
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
                  <th>Actions</th>
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
                    <select v-model="file.engine" class="form-select">
                      <option value="">Select Engine</option>
                      <option
                        v-for="(option, index) in engineOptions"
                        :key="index"
                        :value="option"
                      >
                        {{ option }}
                      </option>
                    </select>
                  </td>
                  <td>
                    <input v-model="file.engine_type" class="form-control" />
                  </td>
                  <td>
                    <select
                      v-model="file.languageDirection"
                      class="form-select"
                    >
                      <option value="">Language Direction</option>
                      <option value="ende">English to German</option>
                      <option value="deen">German to English</option>
                      <option value="enrn">English to Russian</option>
                      <option value="dern">German to Russian</option>
                    </select>
                  </td>
                  <td>
                    <textarea
                      v-model="file.comment"
                      class="form-control"
                    ></textarea>
                  </td>
                  <td>
                    <button @click="deleteFile(index)" class="btn btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <button @click.prevent="createReport" class="btn btn-primary">
              Create Reports
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
      engineOptions: [
        "Google",
        "Google API",
        "Google web",
        "Bing",
        "test engine",
        "Edinburgh",
        "DeepL",
        "Lucy",
        "JHU.5706",
        "LMU-nmt.5756",
        "LMU-unsup.5650",
        "MLLP-UPV.5554",
        "NJUNMT-private.5406",
        "NTT.5666",
        "online-A.0",
        "online-B.0",
        "online-F.0",
        "online-G.0",
        "online-Y.0",
        "RWTH-UNSUPER",
        "RWTH",
        "Ubiqus-NMT",
        "UCAM",
        "uedin",
        "JHU",
        "LMU-nmt",
        "MLLP-UPV",
        "NJUNMT-private",
        "NTT",
        "LMU-unsup",
        "fit-Moses",
        "Google Translate",
        "dfki-nmt",
        "Facebook",
        "MLLP",
        "MSRA.MADL",
        "NEU",
        "online-A",
        "online-B",
        "online-G",
        "online-X",
        "online-Y",
        "PROMT",
        "RWTH_Aachen",
        "TartuNLP",
        "OpenNMT-WMT17",
        "OpenNMT WMT19 basic",
        "OpenNMT WMT19 (data: 3M)",
        "Huoshan Translate.789",
        "Online-A.1571",
        "Online-B.1587",
        "Online-Z.1629",
        "Online-G.1553",
        "PROMT NMT.77",
        "Tohoku-AIP-NTT.1442",
        "UEDIN.1066",
        "WMTBiomedBaseline.387.txt",
        "ZLabs-NLP.1153",
        "OPPO.1360",
        "dfki-tub-ws2021-stadler-ende-m",
        "BUPT",
        "eTrans",
        "Facebook-AI",
        "happypoet",
        "HuaweiTSC",
        "ICL",
        "Manifold",
        "Nemo",
        "nuclear",
        "Online-W",
        "P3AI",
        "UF",
        "VolcTrans-AT",
        "VolcTrans-GLAT",
        "borderline",
        "SMU",
      ],
    };
  },
  methods: {
    handleDrop(event) {
      const files = event.dataTransfer.files;
      const fileArray = Array.from(files); // Convert FileList to Array
      this.processFiles(fileArray); // Process the files
    },
    processFiles(fileList) {
      const promises = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const templateIDMatch = file.name.match(/template_(\d+)\./);
        const templateID = templateIDMatch ? templateIDMatch[1] : "";

        // Read the content of the file as text and push the promise to the array
        promises.push(
          new Promise((resolve, reject) => {
            this.readFileContent(file)
              .then((fileContent) => {
                resolve({
                  fileName: file.name,
                  template: templateID,
                  engine: "",
                  engine_type: "",
                  languageDirection: "",
                  comment: "",
                  content: fileContent,
                });
              })
              .catch((error) => {
                console.error("Error reading file:", error);
                reject(error);
              });
          })
        );
      }

      // Wait for all file reading promises to resolve
      Promise.all(promises)
        .then((selectedFiles) => {
          // Add selected files to the selectedFiles array
          this.selectedFiles.push(...selectedFiles);
        })
        .catch((error) => {
          console.error("Error processing files:", error);
        });
    },
    handleFileUpload(event) {
      const fileList = event.target.files;
      this.processFiles(Array.from(fileList)); // Convert FileList to Array and process
    },
    readFileContent(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
          const fileContent = event.target.result;
          resolve(fileContent);
        };

        reader.onerror = (error) => {
          reject(error);
        };

        // Read the content of the file as text
        reader.readAsText(file);
      });
    },
    createReport() {
      if (this.selectedFiles.length > 0) {
        axios
          .post("http://127.0.0.1:8000/api/reports/", {
            reports: this.selectedFiles,
          })
          .then((response) => {
            console.log("Report creation successful", response.data);
            this.selectedFiles = []; // Clear selected files after successful creation
          })
          .catch((error) => {
            console.error("Error creating report", error);
          });
      }
    },
    deleteFile(index) {
      this.selectedFiles.splice(index, 1);
    },
    handleDragEnter(event) {
      event.target.classList.add("dragging");
    },
    handleDragLeave(event) {
      event.target.classList.remove("dragging");
    },
  },
};
</script>

<style>
.drop-zone {
  border: 2px dashed #007bff;
  padding: 20px;
  text-align: center;
  margin-top: 10px;
}
.drop-zone.dragging {
  background-color: #e9ecef;
}
</style>
