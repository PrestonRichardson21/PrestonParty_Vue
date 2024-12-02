<template>
  <li>
    <h3>{{ name }}</h3>
    <h2>Answer: {{ answer }}</h2>
    <h4>Score: {{ score }}</h4>
    <base-button @click="incrementScore(1)">Add Point</base-button>
    <base-button @click="incrementScore(-1)">Subtract Point</base-button>

  </li>
</template>
<script>
// import { webLink} from '../../store/index.js';


export default {

  props: ['id', 'name', 'answer', 'score'],
  methods: {
    //incrementScore is used to add or subtract points from the score of an answer
    async incrementScore(amount) {
      if (this.score + amount < 0 || this.score + amount > 10) {
        return;
      }
      const newScore = this.score + amount;



      const response = await fetch(`https://prestonparty-c99aa-default-rtdb.firebaseio.com/answers/${this.id}.json`, {
        method: 'PATCH',
        body: JSON.stringify({ score: newScore }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const responseData = await response.json();
        const error = new Error(responseData.message || 'Failed to update score.');
        throw error;
      }

      this.$emit('update-score', { id: this.id, score: newScore });
      
      //reloads the answers after the score has been updated
      this.loadAnswers(true);
    },
    //loadAnswers is used to load the answers from the backend
    async loadAnswers(refresh = false) {
      //isLoading is used to show a loading spinner while the answers are being loaded
      this.isLoading = true;
      //Used to load Answers. answers is the name of the module in /store/index.js
      try {
        await this.$store.dispatch('answers/loadAnswers', {
          forceRefresh: refresh,
        });
      } catch (error) {
        this.error = error.message || 'Failed to load answers';
      }
      //using the asnyc/await syntax to wait for the answers to load before setting isLoading to false
      this.isLoading = false;
    },

  },

};

</script>
<style scoped>
li {
  margin: 1rem 0;
  border: 1px solid #424242;
  border-radius: 12px;
  padding: 1rem;
}

h3 {
  font-size: 1.5rem;
}

h3,
h4 {
  margin: 0.5rem 0;
}

div {
  margin: 0.5rem 0;
}

.actions {
  display: flex;
  justify-content: flex-end;
}
</style>
