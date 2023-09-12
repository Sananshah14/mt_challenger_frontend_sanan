<template>
  <div id="app">
    <div id="sidebar">
      <h2>All Reports</h2>
      <input type="text" v-model="searchTerm" placeholder="Search" />
      <ul>
        <li v-for="report in filteredReports" v-bind:key="report.id">
          <router-link :to="{ name: 'report', params: { id: report.id } }">
            {{ report.name }}
          </router-link>
        </li>
      </ul>
    </div>
    <div id="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      reports: [
        {
          id: 1,
          name: "WMT22",
          createdAt: "2023-07-05T13:45:00",
        },
        {
          id: 2,
          name: "WMT23",
          createdAt: "2023-07-05T13:45:00",
        },
        {
          id: 3,
          name: "WMT24",
          createdAt: "2023-07-05T13:45:00",
        },
      ],
      searchTerm: "",
    };
  },
  computed: {
    filteredReports() {
      return this.reports.filter((report) => {
        return report.name
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());
      });
    },
  },
};
</script>
