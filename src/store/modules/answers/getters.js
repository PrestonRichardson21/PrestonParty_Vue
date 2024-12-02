export default {
    answers(state) {
        return state.answers;
    },
    //checks to see if there are answers in the state so that it can display no answers if there are none
    hasAnswers(state) {
        return state.answers && state.answers.length > 0;
    },

    //Used to time out login if the user is inactive for 60 seconds
    shouldUpdate(state) {
        const lastFetch = state.lastFetch;
        if (!lastFetch) {
            return true;
        }
        const currentTimeStamp = new Date().getTime();
        return (currentTimeStamp - lastFetch) / 1000 > 60;
    },

};