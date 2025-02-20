<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar
          isBlur="blur  border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
          v-bind:darkMode="true"
          isBtn="bg-gradient-success"
        />
      </div>
    </div>
  </div>
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div
              class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0"
            >
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">Sign In</h4>
                  <p class="mb-0">Enter your email and password to sign in</p>
                </div>
                <div class="card-body">
                  <div class="form-group">
                    <input
                      v-model="data.email"
                      type="email"
                      class="form-control"
                      placeholder="Email"
                      aria-label="Email Address"
                    />
                  </div>
                  <div class="form-group">
                    <input
                      v-model="data.password"
                      type="text"
                      class="form-control"
                      placeholder="Password"
                      aria-label="password"
                    />
                  </div>

                  <!-- Add a button to submit the form -->
                  <div class="text-center">
                    <button class="btn btn-primary bg-dark" @click="submitForm">
                      Sign in
                    </button>
                  </div>
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    Don't have an account?
                    <a
                      href="javascript:;"
                      class="text-success text-gradient font-weight-bold"
                      >Sign up</a
                    >
                  </p>
                </div>
              </div>
            </div>
            <div
              class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column"
            >
              <div
                class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                style="
                  background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-ill.jpg');
                  background-size: cover;
                "
              >
                <span class="mask bg-gradient-success opacity-6"></span>
                <h4
                  class="mt-5 text-white font-weight-bolder position-relative"
                >
                  "TestSuite 2.0"
                </h4>
                <p class="text-white position-relative">
                  Automatic translation quality testing tool.
                </p>
                <p class="text-white position-relative">Developed by DFKI</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import Navbar from "@/examples/PageLayout/Navbar.vue";
import axios from "axios";
const body = document.getElementsByTagName("body")[0];

export default {
  name: "signin",
  components: {
    Navbar,
  },
  data() {
    return {
      loggedIn: false,
      username: "",
      api: "http://127.0.0.1:8000/",
      data: {
        password: "",
        email: "",
      },
    };
  },
  methods: {
    submitForm(e1) {
      e1.preventDefault();
      // console.log(this.data);
      // Send the form data to the backend API endpoint
      axios
        .post(
          this.api + "/accounts/login/",
          {
            email: this.data.email,
            password: this.data.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          const token = response.data.token; 
          localStorage.setItem("token", token); 
          this.loggedIn = true;
          this.username = response.data.user.first_name;
          console.log(response.data);
          console.log(this.username);
          // Redirect to the dashboard after successful login
          this.$router.push("/dashboard");
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
