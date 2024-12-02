<template>
    <div>
        <!-- we are using the !! because it will return a boolean value instead of a error string if there is an error -->
        <base-dialog :show="!!error" title="An error occured!" @close="handleError">
            <p>{{ error }}</p>
        </base-dialog>
        <section>
            <base-button @click="spin" class="rule" id="spin">Spin</base-button>
            <div class="rule" id="cardResult">{{ spinResult }} {{ cardResult }}</div>
            <base-card>
                <div class="controls">

                    <base-button mode="outline" v-if="!isLoading" @click="loadAnswers(true)">Refresh</base-button>




                    <base-button link to="/tatb/answer" v-if="isLoggedIn">Register Answer</base-button>
                    <base-button mode="outline" @click="deleteAllAnswers">New Game</base-button>
                </div>

                <base-spinner v-if="isLoading"></base-spinner>
                <!-- hasCoaches is pulled from answers/getters.js and checks if answers is empty -->
                <ul v-else-if="hasAnswers">
                    <answer-item v-for="(answer, index) in filteredAnswers" :key="answer.id" :id="answer.id"
                        :name="answer.name" :answer="answer.answer" :score="answer.score" @update-score="updateScore"
                        :class="{ highlighted: index === highlightedIndex }">


                    </answer-item>


                </ul>
                <h3 v-else>No answers found</h3>
            </base-card>

            <base-button class="rule" link to="/tatb/rules">Rules</base-button>
        </section>
    </div>
</template>
<script>
import AnswerItem from '../../components/answers/AnswerItem.vue';
import BaseButton from '../../components/ui/BaseButton.vue';
import { badCardLibrary, nuetralCardLibrary, goodCardLibrary } from './tatbCardLibrary.js';

import { webLink } from '../../store/index.js';
import BaseCard from '../../components/ui/BaseCard.vue';

export default {
    components: {
        AnswerItem,
        BaseButton,

        BaseCard,
    },
    data() {
        return {
            isLoading: false,
            error: null,
            cardResult: '',
            spinResult: '',

            selectedAnswer: null,
        }
    },

    computed: {
        isLoggedIn() {
            return this.$store.getters.isAuthenticated;
        },
        isAnswer() {

            return this.$store.getters['answers/isAnswer'];
        },

        filteredAnswers() {
            //answers is the name of the module in /store/index.js
            return this.$store.getters['answers/answers']
        },
        hasAnswers() {

            return !this.isLoading && this.$store.getters['answers/hasAnswers']

        },
        isHighlightedUser() {
            const highlightedAnswer = this.filteredAnswers[this.highlightedIndex];
            const userId = this.$store.getters['auth/userId']; // Assuming you have a getter for the user's ID
            return highlightedAnswer && highlightedAnswer.userId === userId;
        },


    },
    // dispateches the loadAnswers action when the page is loaded "auth!= null"

    async created() {

        await this.loadAnswers();
        await this.fetchHighlightedIndex();
    },
    methods: {
        async fetchHighlightedIndex() {
            const token = this.$store.getters['auth/token']; // Ensure the token is retrieved from getters
            const response = await fetch(`${webLink}/highlightedIndex.json?auth=${token}`);
            if (response.ok) {
                const data = await response.json();
                this.highlightedIndex = data.highlightedIndex || 0;
                console.log(`Fetched highlighted index: ${this.highlightedIndex}`);
            } else {
                console.error('Failed to fetch highlighted index');
            }
        },
        testAnswers(incrementAmount) {
            this.$store.dispatch('answers/testAnswers', { forceRefresh: true, incrementAmount });
        },
        // dispatches the loadAnswers action from the answers module
        async loadAnswers(refresh = false) {
            //isLoading is used to show a loading spinner while the answers are being loaded
            this.isLoading = true;
            //Used to load Answers. answers is the name of the module in /store/index.js
            try {
                await this.$store.dispatch('answers/loadAnswers', {
                    forceRefresh: refresh,
                });
                await this.fetchHighlightedIndex();
            } catch (error) {
                this.error = error.message || 'Failed to load answers';
            }
            //using the asnyc/await syntax to wait for the answers to load before setting isLoading to false
            this.isLoading = false;
        },
        async incrementMatchingScores() {
            const highlightedAnswer = this.filteredAnswers[this.highlightedIndex].answer;
            for (const answer of this.filteredAnswers) {
                if (answer.answer === highlightedAnswer && answer.id !== this.filteredAnswers[this.highlightedIndex].id) {
                    answer.score += 1;
                    this.$store.commit('answers/updateScore', { id: answer.id, score: answer.score });
                    await this.$store.dispatch('answers/updateScore', { id: answer.id, score: answer.score });
                }
            }
        },
        handleError() {
            this.error = null;
        },
        async spin() {
            let result = Math.floor(Math.random() * 10 + 1);

            this.spinResult = "They are a " + result + " but...";
            let pick = Math.floor(Math.random() * 3);

            if (result >= 1 && result <= 3) {
                this.cardResult = goodCardLibrary[pick];
            } else if (result >= 4 && result <= 7) {
                this.cardResult = nuetralCardLibrary[pick];
            } else {
                this.cardResult = badCardLibrary[pick];
            }
            await this.highlightNextCard();
            await delay(500);
            this.loadAnswers(true);
        },
        async highlightNextCard() {

            if (this.highlightedIndex < this.filteredAnswers.length - 1) {
                this.highlightedIndex++;
            } else {
                this.highlightedIndex = 0; // Loop back to the first card
            }
            console.log(`Highlighted index: ${this.highlightedIndex}`);

            const token = this.$store.getters['auth/token']; // Ensure the token is retrieved from getters
            const newResponseData = { highlightedIndex: this.highlightedIndex }; // Ensure the data format is correct

            const response = await fetch(`${webLink}/highlightedIndex.json?auth=${token}`, {
                method: 'PATCH',
                body: JSON.stringify(newResponseData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const error = new Error('Failed to update highlighted index!');
                throw error;
            }
            this.incrementMatchingScores();
        },
        //for updating score
        saveData(data) {
            this.$store.dispatch('answers/updateScore', data);

        },
        updateScore(data) {
            const { id, score } = data;
            // Find the answer by id and update its score
            const answer = this.filteredAnswers.find(answer => answer.id === id);
            if (answer) {
                answer.score = score;
                // Update the score in the Vuex store or local state
                this.$store.commit('answers/updateScore', { id, score });
                // Optionally, update the score in the backend
                this.$store.dispatch('answers/updateScore', { id, score });
                console.log(`Answer with id ${id} updated with score ${score}`);
            } else {
                console.error(`Answer with id ${id} not found`);
            }
        },
        deleteAllAnswers() {
            this.$store.dispatch('answers/deleteAllAnswers');
        },
        async handleButtonClick() {
            await this.loadAnswers();
        },




    },

};
// Helper function to create a delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

</script>
<style scoped>
.rule {
    display: flex;
    justify-content: center;
    /* Center horizontally */
    align-items: center;
    /* Center vertically */
    height: 5vh;
}

ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.controls {
    display: flex;
    justify-content: space-between;
}

.highlighted {
    background-color: rgba(0, 255, 247, 0.232);
    /* Highlight color */
}
</style>
