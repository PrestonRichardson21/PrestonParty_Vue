import { webLink } from '../../index.js';
export default {
    async registerAnswer(context, data) {
        const userId = context.rootGetters.userId;
        const answerData = {

            name: data.name,
            answer: data.answer,
            score: data.score
        };
        const token = context.rootGetters.token;
        const response = await fetch(
            `${webLink}/answers/${userId}.json?auth=` +
            token,
            {
                method: 'PUT',
                body: JSON.stringify(answerData)

            });


        // error handling
        if (!response.ok) {
            const responseData = await response.json();
            const error = new Error(responseData.message || 'Failed to register answer!');
            throw error;
        }

        context.commit('registerAnswer', {
            ...answerData,
            id: userId
        });
    },
    async registerHighlightedIndex(context, payload) {

        if (!payload.forceRefresh && !context.getters.shouldUpdate) {
            return;
        }

        const responseInput = await fetch(`${webLink}/highlightedIndex.json`);
        const responseData = await responseInput.json();

        if (!responseInput.ok) {
            const error = new Error(responseData.message || 'Failed to fetch!');
            throw error;
        }



    },
    async updateScore(context, payload) {
        const userId = context.rootGetters.userId;
        const answerData = {
            id: payload.id,
            name: payload.name,
            answer: payload.answer,
            score: payload.score
        };

        const response = await fetch(`${webLink}/answers/${payload.id}.json`, {
            method: 'PATCH',
            body: JSON.stringify(answerData)
        });


        // error handling
        if (!response.ok) {
            const responseData = await response.json();
            const error = new Error(responseData.message || 'Failed to register answer!');
            throw error;
        }
        context.commit('updateScore', {
            ...answerData,
            id: userId
        });
    },
    //fetches all answers from the database
    async loadAnswers(context, payload) {
        if (!payload.forceRefresh && !context.getters.shouldUpdate) {
            return;
        }
        const response = await fetch(
            `${webLink}/answers.json`
        );
        const responseHighlight = await fetch(
            `${webLink}/highlightedIndex.json`
        );
        const responseData = await response.json();
        if (!response.ok) {
            const error = new Error(responseData.message || 'Failed to fetch!');
            throw error;
        }
        const highlightedIndex = await responseHighlight.json();
        const answers = [];
        for (const key in responseData) {
            const answer = {
                id: key,
                name: responseData[key].name,
                answer: responseData[key].answer,
                score: responseData[key].score
            };
            answers.push(answer);

        }

        context.commit('setAnswers', answers);
        context.commit('setFetchTimestamp');
        context.commit('setHighlight', highlightedIndex);
    },
    async deleteAllAnswers(context) {
        const response = await fetch(`${webLink}/answers.json`);
        const responseData = await response.json();

        if (!response.ok) {
            const error = new Error(responseData.message || 'Failed to fetch answers!');
            throw error;
        }

        const deletePromises = [];
        for (const key in responseData) {
            const deleteResponse = fetch(`${webLink}/answers/${key}.json`, {
                method: 'DELETE'
            });
            deletePromises.push(deleteResponse);
        }

        await Promise.all(deletePromises);

        context.commit('clearAnswers');
    },

};