<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar isBtn="bg-gradient-light" />
      </div>
    </div>
  </div>
  <main class="main-content mt-0">
    <div
      class="page-header align-items-start min-vh-50 pt-5 pb-11 m-3 border-radius-lg"
      style="
        background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signup-cover.jpg');
        background-position: top;
      "
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-5 text-center mx-auto">
            <h1 class="text-white mb-2 mt-5">Welcome!</h1>
            <p class="text-lead text-white">
              Sign up for our Test Suite, a powerful machine translation tool,
              and experience the convenience of accurate and efficient language
              translation.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row mt-lg-n10 mt-md-n11 mt-n10 justify-content-center">
        <div class="col-xl-4 col-lg-5 col-md-7 mx-auto">
          <div class="card z-index-0">
            <div class="card-header text-center pt-4">
              <h5>Create Account</h5>
            </div>
            <div class="card-body">
              <div class="form-group">
                <input
                  v-model="user.first_name"
                  type="text"
                  class="form-control"
                  placeholder="First Name"
                  aria-label="Name"
                />
              </div>
              <div class="form-group">
                <input
                  v-model="user.last_name"
                  type="text"
                  class="form-control"
                  placeholder="Last Name"
                  aria-label="Name"
                />
              </div>
              <div class="form-group">
                <input
                  v-model="user.email"
                  type="email"
                  class="form-control"
                  placeholder="Email"
                  aria-label="Email"
                />
              </div>
              <div class="form-group">
                <input
                  v-model="user.password"
                  type="password"
                  class="form-control"
                  placeholder="Password"
                  aria-label="Password"
                />
              </div>
              <!-- Add a button to submit the form -->
              <div class="text-center">
                <button class="btn btn-primary bg-dark" @click="submitForm">
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <app-footer />
</template>

<script>
import Navbar from "@/examples/PageLayout/Navbar.vue";
import AppFooter from "@/examples/PageLayout/Footer.vue";

import axios from "axios";
const body = document.getElementsByTagName("body")[0];

export default {
  name: "signin",
  components: {
    Navbar,
    AppFooter,
  },
  data() {
    return {
      api: "http://127.0.0.1:8000/",
      user: {
        first_name: "",
        last_name: "",
        password: "",
        email: "",
      },
    };
  },
  methods: {
    submitForm(e1) {
      e1.preventDefault();

      // Send the form data to the backend API endpoint
      axios
        .post(
          this.api + "/accounts/create-user/",
          {
            email: this.user.email,
            password: this.user.password,
            first_name: this.user.first_name,
            last_name: this.user.last_name,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log(response.data);
         
          // this.user = {};
        })
        .catch((error) => {
          console.error(error); 
        });
    },
  },
  created() {
    this.$store.state.hideConfigButton = true;
    this.$store.state.showNavbar = false;
    this.$store.state.showSidenav = false;
    this.$store.state.showFooter = false;
    body.classList.remove("bg-gray-100");
  },
  beforeUnmount() {
    this.$store.state.hideConfigButton = false;
    this.$store.state.showNavbar = true;
    this.$store.state.showSidenav = true;
    this.$store.state.showFooter = true;
    body.classList.add("bg-gray-100");
  },
};
</script>
