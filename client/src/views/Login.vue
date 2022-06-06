<template>
  <div class="grey darken-1 empty-layout">
    <Form class="card auth-card" @submit="onSubmit" :validation-schema="schema">
      <div class="card-content">
        <span class="card-title">Авторизация</span>
        <small v-if="error" class="helper-text invalid">Неправильно введен логин/пароль</small>
        <div class="input-field">
          <Field name="name" type="text" />
          <ErrorMessage name="name" class="helper-text invalid" />
          <label>Логин</label>
        </div>
        <div class="input-field">
          <Field name="password" type="password"/>
          <ErrorMessage name="password" class="helper-text invalid" />
          <label>Пароль</label>
        </div>
        <p>Если вы еще не зарегистрированы перейдите на страницу <span style="color: blue; cursor: pointer" @click="reg()">Регистрации</span></p>
      </div>
      <div class="card-action">
        <button class="btn waves-effect waves-light auth-submit" type="submit">Войти</button>
      </div>
    </Form>
    <div v-if="isWaitingSubmit" class="progressOverlay">
      <div class="progresss">
        <p>Подождите...</p>
        <p>Вы будете перенаправлены в личный кабинет</p>
        <progress-bar />
      </div>
    </div>
  </div>
</template>

<script>
import {Form, Field, ErrorMessage} from 'vee-validate';
import {$host} from '@/http/index.js';
import * as yup from 'yup';
import ProgressBar from '@/components/ProgressBar';

export default {
  name: 'login',
  data() {
    const schema = yup.object({
      name: yup.string().required("Поле обязательно для заполнения"),
      password: yup.string().required("Поле обязательно для заполнения").min(8, "Пароль должен содержать 8 или более символов"),
    });
    return {
      schema,
      error: false,
      isWaitingSubmit: false
    };
  },
  components: {
    ProgressBar,
    Field,
    Form,
    ErrorMessage,
  },
  methods: {
    reg() {
      this.$router.push('/registration');
    },
    async onSubmit(values) {
      this.isWaitingSubmit = true;
      await $host.post(`api/user/login`, {'email': values.name.trim(), 'password': values.password.trim()})
          .then((res) => {
            console.log('user', res.data);
            localStorage.setItem('username', values.name);
            localStorage.setItem('userId', res.data.id);
            localStorage.setItem('token', res.data.token);
            this.$store.state.token = localStorage.getItem('token');
            this.$store.state.username = localStorage.getItem('username');
            this.$store.state.userId = localStorage.getItem('userId');
            this.$router.push('/account');
          })
          .catch((error) => {
            this.isWaitingSubmit = false;
            console.log('error', error);
            this.error = true;
          })
          .finally(() => {
            this.isWaitingSubmit = false;
          })
    },
  },
}
</script>

<style scoped>
.progressOverlay {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  transform: translateY(-30%);
}
.progresss {
  position: relative;
  width: 300px;
  text-align: center;
  max-height: 200px;
  max-width: 700px;
  align-self: center;
  overflow-x: hidden;
  overflow-y: auto;
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
}

.progresss p {
  margin: 8px
}
</style>
