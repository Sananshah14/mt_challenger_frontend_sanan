<template>
  <div v-if="comparisonData">
    <h3>Comparison Results</h3>
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th v-for="(engine, index) in selectedEngines" :key="index">
            {{ engine.engine_name || engine.engine }}
          </th>
          <th>Average</th>
        </tr>
      </thead>
      <tbody>
        <!-- Display rows for each category -->
        <tr v-for="(data, category) in comparisonData.result" :key="category">
          <td>{{ category }}</td>
          <td
            v-for="(accuracy, index) in data.data"
            :key="index"
            :style="{ fontWeight: accuracy.significant ? 'bold' : 'normal' }"
          >
            {{ (accuracy.accuracy * 100).toFixed(2) }}%
          </td>
          <td>{{ (data.average * 100).toFixed(2) }}%</td>
        </tr>

        <tr>
          <td><strong>Micro-average</strong></td>
          <td
            v-for="(avg, reportId) in comparisonData.micro_averages"
            :key="reportId"
          >
            {{ (avg * 100).toFixed(2) }}%
          </td>
        </tr>
        <tr>
          <td><strong>Macro-average</strong></td>
          <td
            v-for="(avg, reportId) in comparisonData.macro_averages"
            :key="reportId"
          >
            {{ avg.toFixed(2) }}%
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "Summary",
  props: {
    comparisonData: {
      type: Object,
      required: true,
    },
    selectedEngines: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    console.log("comparisonData:", this.comparisonData);
  },
};
</script>

<style scoped>
/* Add your CSS styling here */
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background-color: #f2f2f2;
}
</style>
