import { createStore } from 'vuex';
import answersModule from './modules/answers/index.js';
import authModule from './modules/auth/index.js';
const store = createStore({
    modules: {
        answers: answersModule,
        auth: authModule
    },


});
export default store;
export const webLink = 'https://prestonparty-c99aa-default-rtdb.firebaseio.com';