<template>
  <div id="app">
    <sidebar :reports="reports" @select-report="selectReport" />

    <main-content :selectedReport="selectedReport" />
  </div>
</template>

<script>
import Sidebar from "./components/SideBarReports.vue";
import MainContent from "./components/MainContent.vue";

export default {
  data() {
    return {
      reports: [
        {
          id: 1,
          name: "Report 1",
          records: [
            {
              info: "Info 1",
              id: 101,
              source: "Source 1",
              category: "Category 1",
              phenomenon: "Phenomenon 1",
              translation: "Translation 1",
              comment: "Comment 1",
            },
            {
              info: "Info 2",
              id: 102,
              source: "Source 2",
              category: "Category 2",
              phenomenon: "Phenomenon 2",
              translation: "Translation 2",
              comment: "Comment 2",
            },
          ],
        },
        {
          id: 2,
          name: "Report 2",
          records: [
            {
              info: "Info 1",
              id: 101,
              source: "Source 1",
              category: "Category 1",
              phenomenon: "Phenomenon 1",
              translation: "Translation 1",
              comment: "Comment 1",
            },
            {
              info: "Info 2",
              id: 102,
              source: "Source 2",
              category: "Category 2",
              phenomenon: "Phenomenon 2",
              translation: "Translation 2",
              comment: "Comment 2",
            },
          ],
        },
      ],
      selectedReport: null,
    };
  },
  methods: {
    selectReport(report) {
      this.selectedReport = report;
    },
  },
  components: {
    Sidebar,
    MainContent,
  },
};
</script>
