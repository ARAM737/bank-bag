<template>
    <nav class="navbar teal lighten-2">
      <div class="nav-wrapper">
        <div class="navbar-left">
          <h1 class="logo">BAG<span class="mini-text">bank by Aram Grigoryan</span></h1>
        </div>

        <ul class="right">
          <li>
            <a class="dropdown-trigger black-text" href="#" data-target="dropdown" ref="dropdown">
              {{ this.$store.state.username }}
              <i class="material-icons right">arrow_drop_down</i>
            </a>

            <ul id='dropdown' class='dropdown-content'>
              <li class="divider" tabindex="-1"></li>
              <li>
                <router-link to="/" class="black-text" @click="clear">
                  <i class="material-icons">assignment_return</i>Выйти
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
</template>

<script>
export default {
  mounted() {
    M.Dropdown.init(this.$refs.dropdown, {
      constrainWidth: true
    });
  },
  methods: {
    onClick() {
      this.$store.state.visible = !this.$store.state.visible;
    },
    clear() {
      localStorage.clear();
      this.$store.state.token = '';
      this.$store.state.username = '';
    },
  }
}
</script>

<style scoped>
.large {
  font-size: 2.5rem;
}
.mini-text {
  font-size: 14px;
}

@media screen and (max-width: 500px) {
  .mini-text {
   display: none;
  }

  .logo {
    transform: translateY(-10px);
  }
}
</style>