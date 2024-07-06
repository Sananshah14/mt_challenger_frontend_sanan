<template>
  <div class="popup-overlay">
    <div class="popup-container">
      <!-- Top Fixed Section -->
      <div class="fixed-top">
        <div class="container-interface">
          <div class="row mt-1">
            <!-- Source Section -->
            <div class="col-md-6">
              <div class="section-box">
                <h4>Source</h4>
                <p>{{ this.sourceText }}</p>
              </div>
            </div>
            <!-- Translation Section -->
            <div class="col-md-6">
              <div
                class="section-box"
                :class="{
                  'translation-warning': result === 'WARNING',
                  'translation-pass': result === 'PASS',
                  'translation-fail': result === 'FAIL',
                  'translation-conflict': this.result === 'CONFLICT',
                }"
              >
                <h4 style="color: white">Translation</h4>
                <p>{{ this.translationText }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Section -->
      <div class="content-section mt-2">
        <div class="row">
          <!-- Positive Regex Section -->
          <div class="col-md-6">
            <div class="section-box">
              <h4 class="section-title">Positive Regex</h4>
              <hr />
              <div
                class="input-group mb-1"
                v-for="(regex, index) in positiveRegexes"
                :key="index"
              >
                <textarea
                  v-model="positiveRegexes[index].value"
                  class="form-control"
                  rows="2"
                ></textarea>
                <button
                  class="btn btn-danger"
                  type="button"
                  @click="removePositiveRegex(index)"
                >
                  Delete
                </button>
              </div>
              <button class="btn btn-success mt-1" @click="addPositiveRegex">
                Add
              </button>
            </div>
          </div>
          <!-- Negative Regex Section -->
          <div class="col-md-6">
            <div class="section-box">
              <h4 class="section-title">Negative Regex</h4>
              <hr />
              <div
                class="input-group mb-1"
                v-for="(regex, index) in negativeRegexes"
                :key="index"
              >
                <textarea
                  v-model="negativeRegexes[index].value"
                  class="form-control"
                  rows="2"
                ></textarea>
                <button
                  class="btn btn-danger"
                  type="button"
                  @click="removeNegativeRegex(index)"
                >
                  Delete
                </button>
              </div>
              <button class="btn btn-success mt-1" @click="addNegativeRegex">
                Add
              </button>
            </div>
          </div>
        </div>

        <div class="row mt-2">
          <!-- Positive Tokens Section -->
          <div class="col-md-6">
            <div class="section-box">
              <h4 class="section-title">Positive Tokens</h4>
              <hr />
              <div
                class="input-group mb-1"
                v-for="(token, index) in positiveTokens"
                :key="index"
              >
                <textarea
                  v-model="positiveTokens[index].value"
                  class="form-control"
                  rows="2"
                ></textarea>
                <button
                  class="btn btn-danger"
                  type="button"
                  @click="removePositiveToken(index)"
                >
                  Delete
                </button>
              </div>
              <button class="btn btn-success mt-1" @click="addPositiveToken">
                Add
              </button>
            </div>
          </div>
          <!-- Negative Tokens Section -->
          <div class="col-md-6">
            <div class="section-box">
              <h4 class="section-title">Negative Tokens</h4>
              <hr />
              <div
                class="input-group mb-1"
                v-for="(token, index) in negativeTokens"
                :key="index"
              >
                <textarea
                  v-model="negativeTokens[index].value"
                  class="form-control"
                  rows="2"
                ></textarea>
                <button
                  class="btn btn-danger"
                  type="button"
                  @click="removeNegativeToken(index)"
                >
                  Delete
                </button>
              </div>
              <button class="btn btn-success mt-1" @click="addNegativeToken">
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Fixed Buttons Section -->
      <div class="fixed-bottom py-1">
        <div class="container-fluid d-flex justify-content-center">
          <button
            class="btn btn-primary"
            style="margin-right: 5px"
            @click="handleClick"
          >
            Save
          </button>
          <button class="btn btn-secondary ml-1" @click="discardChanges">
            Discard Changes
          </button>
          <button
            class="btn btn-primary ml-1"
            style="margin-left: 5px"
            @click="$emit('close')"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PopupInterface",
  data() {
    return {
      sourceText: "",
      translationText: "",
      positiveRegexes: [{ id: null, value: "" }],
      negativeRegexes: [{ id: null, value: "" }],
      positiveTokens: [{ id: null, value: "" }],
      negativeTokens: [{ id: null, value: "" }],
      positiveRegexMatch: false,
      negativeRegexMatch: false,
      positiveTokenMatch: false,
      negativeTokenMatch: false,
      result: "WARNING",
    };
  },
  props: {
    translationId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    resultClass() {
      return {
        "translation-warning": this.result === "WARNING",
        "translation-pass": this.result === "PASS",
        "translation-fail": this.result === "FAIL",
        "translation-conflict": this.result === "CONFLICT",
      };
    },
  },
  watch: {
    translationText() {
      this.debouncedCheckMatches();
    },
    positiveRegexes: {
      handler() {
        this.debouncedCheckMatches();
      },
      deep: true,
    },
    negativeRegexes: {
      handler() {
        this.debouncedCheckMatches();
      },
      deep: true,
    },
    positiveTokens: {
      handler() {
        this.debouncedCheckMatches();
      },
      deep: true,
    },
    negativeTokens: {
      handler() {
        this.debouncedCheckMatches();
      },
      deep: true,
    },
  },
  mounted() {
    this.fetchRules();
    this.debouncedCheckMatches = this.debounce(this.checkMatches, 300);
  },
  methods: {
    discardChanges() {
      this.positiveRegexes = [""];
      this.negativeRegexes = [""];
      this.positiveTokens = [""];
      this.negativeTokens = [""];
      this.debouncedCheckMatches();
    },
    addPositiveRegex() {
      this.positiveRegexes.push({ id: null, value: "" });
    },
    removePositiveRegex(index) {
      this.positiveRegexes.splice(index, 1);
      if (this.positiveRegexes.length === 0) {
        this.positiveRegexes.push({ id: null, value: "" });
      }
      this.debouncedCheckMatches();
    },
    addNegativeRegex() {
      this.negativeRegexes.push({ id: null, value: "" });
    },
    removeNegativeRegex(index) {
      this.negativeRegexes.splice(index, 1);
      if (this.negativeRegexes.length === 0) {
        this.negativeRegexes.push({ id: null, value: "" });
      }
      this.debouncedCheckMatches();
    },
    addPositiveToken() {
      this.positiveTokens.push({ id: null, value: "" });
    },
    removePositiveToken(index) {
      this.positiveTokens.splice(index, 1);
      if (this.positiveTokens.length === 0) {
        this.positiveTokens.push({ id: null, value: "" });
      }
      this.debouncedCheckMatches();
    },
    addNegativeToken() {
      this.negativeTokens.push({ id: null, value: "" });
    },
    removeNegativeToken(index) {
      this.negativeTokens.splice(index, 1);
      if (this.negativeTokens.length === 0) {
        this.negativeTokens.push({ id: null, value: "" });
      }
      this.debouncedCheckMatches();
    },
    fetchRules() {
      axios
        .get(
          `http://127.0.0.1:8000/api/translations/${this.translationId}/rules/`
        )
        .then((response) => {
          const rules = response.data.rules;
          this.sourceText = response.data.source_sentence;
          this.translationText = response.data.target_sentence;
          if (rules.length > 0) {
            this.positiveRegexes = rules
              .filter((rule) => rule.regex && rule.positive)
              .map((rule) => ({ id: rule.id, value: rule.string }));
            this.negativeRegexes = rules
              .filter((rule) => rule.regex && !rule.positive)
              .map((rule) => ({ id: rule.id, value: rule.string }));
            this.positiveTokens = rules
              .filter((rule) => !rule.regex && rule.positive)
              .map((rule) => ({ id: rule.id, value: rule.string }));
            this.negativeTokens = rules
              .filter((rule) => !rule.regex && !rule.positive)
              .map((rule) => ({ id: rule.id, value: rule.string }));
          } else {
            this.positiveRegexes = [{ id: null, value: "" }];
            this.negativeRegexes = [{ id: null, value: "" }];
            this.positiveTokens = [{ id: null, value: "" }];
            this.negativeTokens = [{ id: null, value: "" }];
          }
          this.debouncedCheckMatches();
        })
        .catch((error) => {
          console.error("Error fetching translation data:", error);
        });
    },
    checkPositiveRegexes() {
      this.positiveRegexMatch = this.positiveRegexes.some((regex) => {
        const trimmedRegex = regex.value.trim();
        return (
          trimmedRegex.length > 0 &&
          new RegExp(trimmedRegex).test(this.translationText)
        );
      });
    },
    checkNegativeRegexes() {
      this.negativeRegexMatch = this.negativeRegexes.some((regex) => {
        const trimmedRegex = regex.value.trim();
        return (
          trimmedRegex.length > 0 &&
          new RegExp(trimmedRegex).test(this.translationText)
        );
      });
    },
    checkPositiveTokens() {
      this.positiveTokenMatch = this.positiveTokens.some((token) => {
        const trimmedToken = token.value.trim();
        return (
          trimmedToken.length > 0 && this.translationText.includes(trimmedToken)
        );
      });
    },
    checkNegativeTokens() {
      this.negativeTokenMatch = this.negativeTokens.some((token) => {
        const trimmedToken = token.value.trim();
        return (
          trimmedToken.length > 0 && this.translationText.includes(trimmedToken)
        );
      });
    },
    debounce(func, wait) {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    },
    addItem(array) {
      array.push("");
      this.debouncedCheckMatches();
    },
    removeItem(array, index) {
      array.splice(index, 1);
      if (array.length === 0) {
        array.push("");
      }
      this.debouncedCheckMatches();
    },
    checkMatches() {
      this.checkPositiveRegexes();
      this.checkNegativeRegexes();
      this.checkPositiveTokens();
      this.checkNegativeTokens();

      if (
        (this.positiveRegexMatch && this.negativeRegexMatch) ||
        (this.positiveTokenMatch && this.negativeTokenMatch)
      ) {
        this.result = "CONFLICT"; // result is set to "CONFLICT" if both positive and negative regexes match or both positive and negative tokens match.
      } else if (this.positiveRegexMatch) {
        this.result = "PASS"; // The result is set to "PASS" if only the positive regexes match.
      } else if (this.negativeRegexMatch) {
        this.result = "FAIL"; // The result ist set to "FAIL" if only the negative regexes match.
      } else if (this.positiveTokenMatch) {
        this.result = "PASS"; // If the above condition is not met, the result is set to "PASS" if only the positive tokens match.
      } else if (this.negativeTokenMatch) {
        this.result = "FAIL"; // The result is set to "FAIL" if only the negative regexes match.
        //If the above condition is not met, the result is set to "FAIL" if only the negative tokens match.
      } else {
        this.result = "WARNING"; // If none of the above condition are met, the result is set to "WARNING"
      }
    },
    handleClick() {
      const data = {
        translation_id: this.translationId,
        positive_regexes: this.positiveRegexes
          .filter((regex) => regex.value.trim() !== "")
          .map((regex) => ({ id: regex.id || null, string: regex.value })),
        negative_regexes: this.negativeRegexes
          .filter((regex) => regex.value.trim() !== "")
          .map((regex) => ({ id: regex.id || null, string: regex.value })),
        positive_tokens: this.positiveTokens
          .filter((token) => token.value.trim() !== "")
          .map((token) => ({ id: token.id || null, string: token.value })),
        negative_tokens: this.negativeTokens
          .filter((token) => token.value.trim() !== "")
          .map((token) => ({ id: token.id || null, string: token.value })),
      };

      console.log("Data being sent:", data);

      axios
        .post("http://127.0.0.1:8000/api/update-rules/", data)
        .then((response) => {
          console.log("Response received:", response);
          this.sourceText = response.data.source_sentence;
          this.translationText = response.data.target_sentence;
          console.log("Created rules:", response.data.created_rules);
          console.log("Updated rules:", response.data.updated_rules);
          console.log(
            "Deleted rules count:",
            response.data.deleted_rules_count
          );
          this.fetchRules(); // Fetch latest data after saving
          alert("Rules updated successfully");
        })
        .catch((error) => {
          console.error("Error updating rules:", error);
          alert("Failed to update rules");
        });
    },
  },
};
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* Ensure it is on top of other elements */
}

.popup-container {
  position: relative;
  background: white;
  max-height: 90vh;
  max-width: 90vw;
  width: 90%;
  height: auto;
  overflow-y: auto;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.fixed-top {
  padding: 10px 0;
  z-index: 1000;
  position: sticky;
  top: 0;
  background: white; /* Ensure the sticky header has a background */
}

.fixed-bottom {
  padding: 10px 0;
  z-index: 1000;
  position: sticky;
  bottom: 0;
  background: white; /* Ensure the sticky footer has a background */
}

.container-interface {
  width: 100%;
}

.content-section {
  padding-bottom: 30px;
  overflow-x: hidden;
}

.section-box {
  background-color: rgb(171, 222, 208);
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
}

.section-title {
  margin-bottom: 10px;
  font-weight: bold;
}

.input-group {
  display: flex;
  align-items: flex-start;
}

.input-group textarea {
  flex-grow: 1;
  margin-right: 10px;
  resize: vertical; /* Allow vertical resizing */
}

.btn {
  white-space: nowrap;
  padding: 10px 15px;
  font-size: 14px;
}

.row {
  margin-left: 0;
  margin-right: 0;
}

.translation-warning {
  border: 2px solid orange;
  background-color: orange;
  color: white;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
}

.translation-pass {
  border: 2px solid green;
  background-color: green;
  color: white;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
}

.translation-fail {
  border: 2px solid red;
  background-color: red;
  color: white;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
}

.translation-conflict {
  border: 2px solid purple;
  background-color: purple;
  color: white;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
}

/* Add media queries for smaller devices */
@media (max-width: 768px) {
  .popup-container {
    width: 95%;
    height: 95%;
    padding: 15px;
  }

  .input-group {
    flex-direction: column;
  }

  .input-group textarea {
    margin-right: 0;
    margin-bottom: 10px;
  }

  .fixed-top,
  .fixed-bottom {
    padding: 10px 0;
  }

  .btn {
    font-size: 12px;
    padding: 8px 12px;
  }

  .section-box {
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .popup-container {
    width: 100%;
    height: 100%;
    border-radius: 0;
    padding: 10px;
  }

  .section-box {
    padding: 8px;
    margin-bottom: 15px;
  }

  .input-group textarea {
    margin-bottom: 5px;
  }

  .btn {
    font-size: 12px;
    padding: 5px 10px;
  }

  .translation-warning,
  .translation-pass,
  .translation-fail,
  .translation-conflict {
    padding: 5px;
  }
}
</style>
