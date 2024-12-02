<template>
  <button v-if="!link" :class="mode">
    <slot></slot>
  </button>
  <router-link v-else :to="to" :class="mode">
    <slot></slot>
  </router-link>
</template>
<script>
//We add this scrip so that it can only accept a router link or a button not both
export default {
  props: {
    //mode allows us to apply CSS
    mode: {
      type: String,
      required: false,
      default: null
    },
    //Like is applied if boolean is truthy
    link: {
      type: Boolean,
      required: false,
      default: false
    },
    // used to direct where the link shoud take us
    to: {
      type: String,
      required: false,
      default: '/'
    }

  }
}
</script>

<style scoped>
button,
a {
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  font: inherit;
  background-color: #006a74;
  border: 1px solid #006a74;
  color: white;
  cursor: pointer;
  border-radius: 30px;
  margin-right: 0.5rem;
  display: inline-block;
}

a:hover,
a:active,
button:hover,
button:active {
  background-color: #006a74;
  border-color: #006a74;
}

.flat {
  background-color: transparent;
  color: #006a74;
  border: none;
}

.outline {
  background-color: transparent;
  border-color: #006a74;
  color: #006a74;
}

.flat:hover,
.flat:active,
.outline:hover,
.outline:active {
  background-color: #edd2ff;
}
</style>