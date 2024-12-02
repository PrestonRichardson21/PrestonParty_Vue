<template>
  <header>
    <nav>
      <h1>Preston Party</h1>
      <ul>
        <li v-if="isLoggedIn">
          <router-link to="/tatb">They are a 10 but...</router-link>
        </li>
        <li v-if="isLoggedIn">
          <router-link to="/hotseat">HotSeat</router-link>
        </li>
        <li v-if="!isLoggedIn">
          <router-link to="/auth">Login/SignUp</router-link>
        </li>
        <li v-if="isLoggedIn">
          <base-button mode="outline" @click="logout">Logout</base-button>
        </li>
      </ul>
    </nav>
  </header>
</template>
<script>
export default {
  computed: {
    // isAuthenticated is a getter in /store/index.js that returns true if the user is authenticated so that the user doesn't have the option to log in if they are already logged in
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
    },
  },
};
</script>
<style scoped>
header {
  width: 100%;
  height: 10rem;
  background-color: #02889f5a;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1rem;
}

header a {
  text-decoration: none;
  color: #006a74;
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: 1px solid transparent;
}

a:active,
a:hover,
a.router-link-active {
  border: 1px solid #006a74;
  border-radius: 30px;
  background-color: #006a7424;

}

h1 {
  margin: 0;
  color: #006a74;
}

h1 a {
  color: white;
  margin: 0;
}

h1 a:hover,
h1 a:active,
h1 a.router-link-active {
  border-color: #006a74;
  background-color: #006a7424;
}

header nav {
  width: 90%;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

li {
  margin: 0 0.5rem;
}
</style>