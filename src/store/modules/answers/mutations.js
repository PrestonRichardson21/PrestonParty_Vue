export default {
    registerAnswer(state, payload) {
        state.answers.push(payload);

    },
    setAnswers(state, payload) {
        state.answers = payload;
    },
    setHighlight(state, payload) {
        state.highlightedIndex = payload;
    },
    setFetchTimestamp(state) {
        state.lastFetch = new Date().getTime();
    },
    updateScore(state, payload) {

        state.answers.push(payload);
    },

    registerHighlightedIndex(state, payload) {
        state.answers.push(payload);

    },
    clearAnswers(state) {
        state.answers = [];
    },


};