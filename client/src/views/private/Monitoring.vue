<template>
  <div class="app-main-layout">
    <NavBar />
    <main class="app-content full">
      <div class="app-page">

        <div style="display: flex;">
          <div class="card test">
            <div class="card-content">
              <h4>Кошелёк</h4>
              <span class="card-title">{{ $store.state.wallet }} ₽</span>
            </div>
          </div>

          <div class="card test">
            <div class="card-content">
              <h4>Курс валют</h4>
              <span class="card-title">USD {{ this.usd.toFixed(2) }}</span>
              <span class="card-title">EUR {{ this.eur.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <div>
          <div class="page-title">
            <h3>История</h3>
          </div>
        </div>

        <button class="btn waves-effect waves-light auth-submit" style="margin-bottom: 16px" @click="$router.push('/post')">Добавить запись</button>

        <section v-if="this.posts.count === 0">
          <h3 style="text-align: center">Список истории пуст</h3>
        </section>

        <section v-else>
          <table class="responsive-table">
            <thead>
              <tr>
                <th>№</th>
                <th>Сумма</th>
                <th>Дата</th>
                <th>Категория</th>
                <th>Тип</th>
              </tr>
            </thead>
            <tbody class="scroll-custom">
              <tr v-for="(post, idx) in posts.rows" :key="idx">
                <td>{{ idx + 1 }}</td>
                <td>{{ post.total }}</td>
                <td>{{ this.formatDate(post.createdAt) }}</td>
                <td>{{ post.category }}</td>
                <td v-if="post.type" style="color: green">доход</td>
                <td v-if="!post.type" style="color: red">расход</td>
              </tr>
            </tbody>
          </table>
          <ul v-if="count.length >= 6" class="pagination">
            <li
                v-for="pageNumber in totalPages"
                :key="pageNumber"
                class="waves-effect"
                :class="{
                  'active teal lighten-2': page === pageNumber
                }"
                @click="changePage(pageNumber)"
            >
              <a href="#!">{{ pageNumber }}</a>
            </li>
          </ul>
        </section>

      </div>
    </main>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar';
import {$authHost} from '@/http/index.js';
import Axios from 'axios';

export default {
  components: {
    NavBar,
  },
  data () {
    return {
      posts: {},
      usd: 0.00,
      eur: 0.00,
      page: 1,
      limit: 6,
      totalPages: 0,
      count: [],
    }
  },
  created() {
    this.api();
  },
  methods: {
    formatDate(date) {
      date = date.split('T');
      date = date[0].replaceAll('-', '.').split('.').reverse().join('.');

      return date;
    },
    changePage(pageNumber) {
      this.page = pageNumber;
      this.showPosts();
    },
    api() {
      Axios.get('https://api.exchangerate.host/convert?from=USD&to=RUB',)
          .then(response => {
            this.usd = response.data.result;
          })
          .catch(error => {
            console.log(error.message);
          });
      Axios.get('https://api.exchangerate.host/convert?from=EUR&to=RUB',)
          .then(response => {
            this.eur = response.data.result;
          })
          .catch(error => {
            console.log(error.message);
          });
      $authHost
          .get('api/post/' + this.$store.state.userId, {
            params: {
              limit: this.limit,
              page: this.page
            }
          })
          .then((response) => {
            this.totalPages = Math.ceil(response.data.count / this.limit);
            this.posts = response.data;
            this.count = response.data.rows;
            console.log(this.posts);
          })
          .catch((e) => {
            console.log('error ', e.message);
            if(e.message === 'Request failed with status code 401') {
              localStorage.clear();
              this.$router.push('/login');
            }
          });
      $authHost.get('api/wallet/' + this.$store.state.userId).then(res => {
        this.$store.state.wallet = res.data.total
      }).catch(e => {
        console.log('error ', e.message);
        if(e.message === 'Request failed with status code 401') {
          localStorage.clear();
          this.$router.push('/login');
        }
      })
    },
    showPosts() {
      $authHost
          .get('api/post/' + this.$store.state.userId, {
            params: {
              limit: this.limit,
              page: this.page
            }
          })
          .then((response) => {
            this.totalPages = Math.ceil(response.data.count / this.limit);
            this.posts = response.data;
            console.log(this.posts);
          })
          .catch((e) => {
            console.log('error ', e.message);
            if(e.message === 'Request failed with status code 401') {
              localStorage.clear();
              this.$router.push('/login');
            }
          });
    }
  },
}
</script>

<style scoped>
.card {
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25)
}

.test {
  flex-grow: 1;
  margin-right: 16px;
}

.test:last-child {
  margin-right: 0;
}

.btn {
  margin-right: 10px;
}

.scroll-custom::-webkit-scrollbar-button {
  background-image: url('');
  background-repeat: no-repeat;
  width: 7px;
  height: 0;
}

.scroll-custom::-webkit-scrollbar-thumb {
  -webkit-border-radius: 0;
  border-radius: 10px;
  background-color: #d1d1d1;
}

.scroll-custom::-webkit-scrollbar-thumb:hover {
  background-color: #a19f9f
}

.scroll-custom::-webkit-resizer {
  background-image: url('');
  background-repeat: no-repeat;
  width: 7px;
  height: 0;
}

.scroll-custom::-webkit-scrollbar {
  width: 7px;
  height: 7px
}
</style>