<template>
    <section>
        <base-card>
            <h2>Register an answer</h2>
            <answer-form @save-data="saveData" :default-name="defaultName"></answer-form>
        </base-card>
    </section>
</template>
<script>
import AnswerForm from '../../components/answers/AnswerForm.vue'
export default {
    components: {
        AnswerForm,
    },
    data() {
        return {
            defaultName: localStorage.getItem('lastUsedName') || ''
        };
    },
    methods: {
        saveData(data) {
            localStorage.setItem('lastUsedName', data.name);
            this.$store.dispatch('answers/registerAnswer', data);
            this.$router.replace('/tatb');
        }
    }
};
</script>
