<template>
  <form @submit.prevent="submitForm">
    <!-- Add the class invalid to the label if the name is not valid -->
    <div class="form-control" :class="{ invalid: !name.isValid }">
      <label for="name">Name</label>
      <input type="text" id="name" v-model.trim="name.val" @blur="clearValidity('name')" />
      <p v-if="!name.isValid">Please enter a valid name.</p>
    </div>
    <div class="form-control" :class="{ invalid: !answer.isValid }">

      <label for="answer">Answer</label>
      <input type="number" id="answer" v-model.number="answer.val" @blur="clearValidity('answer')" />
      <p v-if="!answer.isValid">Please enter a valid number from 1 to 10.</p>
    </div>
    <p v-if="!formIsValid">Please correct above errors</p>
    <base-button>Submit</base-button>
  </form>
</template>
<script>
export default {
  // emits the save-data event so that the parent component can listen for it
  emits: ['save-data'],
  props: ['defaultName'],
  data() {
    return {
      name: {
        // default name is saved for this user when submiting another answer
        val: this.defaultName,
        isValid: true
      },
      answer: {
        val: null,
        isValid: true
      },
      // score is set to 0 by when submitting your first answer
      score: {
        val: 0,
        isValid: true
      },
      formIsValid: true
    };
  },
  methods: {
    // makes it where the error is no loger displayed when the user types in the input box
    clearValidity(input) {
      this[input].isValid = true;
    },
    // checks if the name and answer are valid
    validateForm() {
      this.formIsValid = true;
      if (this.name.val === '') {
        this.name.isValid = false;
        this.formIsValid = false;
      }
      if (this.answer.val === '' || this.answer.val < 1 || this.answer.val > 10) {
        this.answer.isValid = false;
        this.formIsValid = false;
      }


    },
    // emits the save-data event so that the parent component can listen for it if the form input/form is valid
    submitForm() {
      this.validateForm();
      if (!this.formIsValid) {
        return;
      }
      const formData = {
        name: this.name.val,
        answer: this.answer.val,
        score: this.score.val
      };
      this.$emit('save-data', formData)

    }
  }
};
</script>
<style scoped>
.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}

input[type='checkbox']+label {
  font-weight: normal;
  display: inline;
  margin: 0 0 0 0.5rem;
}

input,
textarea {
  display: block;
  width: 100%;
  border: 1px solid #ccc;
  font: inherit;
}

input:focus,
textarea:focus {
  background-color: #f0e6fd;
  outline: none;
  border-color: #00738d;
}

input[type='checkbox'] {
  display: inline;
  width: auto;
  border: none;
}

input[type='checkbox']:focus {
  outline: #00738d solid 1px;
}

h3 {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.invalid label {
  color: red;
}

.invalid input,
.invalid textarea {
  border: 1px solid red;
}
</style>
