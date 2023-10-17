<template>
  <div class="main-content">
    <div v-if="selectedReport">
      <h2>{{ selectedReport.name }} (ID: {{ selectedReport.id }})</h2>
      <table>
        <thead>
          <tr>
            <th>Info</th>
            <th>ID</th>
            <th>Source</th>
            <th>Category</th>
            <th>Phenomenon</th>
            <th>Translation</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in selectedReport.records" :key="record.id">
            <td>{{ record.info }}</td>
            <td>{{ record.id }}</td>
            <td>{{ record.source }}</td>
            <td>{{ record.category }}</td>
            <td>{{ record.phenomenon }}</td>
            <td>{{ record.translation }}</td>
            <td>{{ record.comment }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>Select a report from the sidebar to view its records.</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedReport: Object,
  },
};
</script>

<style scoped>
.main-content {
  margin-left: 220px; /* Adjust this value to control the spacing */
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>
