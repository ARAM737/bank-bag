<template>
  <div class="app-main-layout">

    <NavBar />

    <main class="app-content full">

      <div class="app-page">

        <div>

          <div class="page-title">
            <h3>Добавление записи</h3>
          </div>

          <section>
            <div class="row">
              <p class="flow-text">Сумма</p>
              <div class="input-field col s12">
                <input type="number" class="materialize-textarea textSize" data-length="120" v-model="total" placeholder="Сумма" />
                <p v-if="errorTotal" style="color: red">{{ error }}</p>
              </div>
            </div>
            <div class="row">
              <p class="flow-text">Категория</p>
              <div class="input-field col s12">
                <input type="text" class="materialize-textarea textSize" data-length="120" v-model="category" placeholder="Категория" />
                <p v-if="errorCategory" style="color: red">{{ error }}</p>
              </div>
            </div>
            <div class="row">
              <p class="flow-text">Тип</p>
              <p v-for="(itm, idx) in this.types" :key="idx" :class="{type: true, active: idx === idxType}" @click="addType(idx)">{{ itm }}</p>
            </div>
            <div class="groupbtn">
              <button class="green darken-3 btn" @click="update">Сохранить</button>
              <button class="teal lighten-2 btn rghtbtn" @click="back">Отмена</button>
            </div>
          </section>

        </div>

      </div>

    </main>

  </div>
</template>

<script>
import {$authHost} from '@/http/index.js';
import NavBar from '@/components/NavBar';

export default {
  data() {
    return {
      total: 0,
      category: '',
      idxType: 0,
      types: ['расход', 'доход'],
      type: false,
      error: '',
      errorTotal: false,
      errorCategory: false,
    }
  },
  components: {
    NavBar
  },
  methods: {
    back() {
      this.$router.push('/account');
    },
    addType(idx) {
      this.idxType = idx;
      if(this.idxType === 0)
        return this.type = false;
      if(this.idxType === 1)
        return this.type = true;
    },
    async update() {
      if(!this.total) {
        this.errorTotal = true;
        return this.error = 'Поле обязательно для заполнения';
      }
      if(!this.category) {
        this.errorCategory = true;
        return this.error = 'Поле обязательно для заполнения';
      }
      await $authHost
          .post(`api/post/`,
              {
                'total': this.total,
                'type': this.type,
                'category': this.category,
                'userId': this.$store.state.userId,
              })
          .then(() => {
            this.addWallet();
          })
          .catch((e) => {
            console.log('error', e);
            if(e.message === 'Request failed with status code 401') {
              localStorage.clear();
              this.$router.push('/login');
            }
          });
    },
    async addWallet() {
      if(!this.type)
        this.total = this.total * (-1);
      await $authHost
          .put(`api/wallet/update/` + this.$store.state.userId,
              {
                'total': this.total + this.$store.state.wallet,
              })
          .then((res) => {
            console.log(res.data);
            this.$router.push('/account');
          })
          .catch((e) => {
            console.log('error', e);
            if(e.message === 'Request failed with status code 401') {
              localStorage.clear();
              this.$router.push('/login');
            }
          });
    }
  }
}
</script>

<style scoped>
.row{
  margin-top: 30px;
}
.textSize {
  max-width: 500px;
}
.rghtbtn {
  margin-left: 30px;
}
.groupbtn {
  margin-top: 30px;
}

.type {
  cursor: pointer;
}

.active {
  padding-left: 5px;
  border-left: 5px solid green;
}

:focus::-webkit-input-placeholder {
  color: transparent
}

:focus::-moz-placeholder {
  color: transparent
}

:focus:-moz-placeholder {
  color: transparent
}

:focus:-ms-input-placeholder {
  color: transparent
}
</style>
