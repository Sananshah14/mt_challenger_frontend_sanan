<template>
  <footer class="py-3 footer">
    <div class="container">
      <!-- <div class="row">
        <div class="mx-auto mb-4 text-center col-lg-8">
          <p>MT Half Marathon 2021 Project</p>
        </div>
      </div> -->
      <div class="row">
        <div class="mx-auto mt-2 text-center col-8">
          <p class="mb-0 text-secondary">
            MT Half Marathon 2021 Project <br />Copyright ©
            {{ new Date().getFullYear() }} Soft by DFKI. All rights reserved
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "app-footer",
};
</script>
