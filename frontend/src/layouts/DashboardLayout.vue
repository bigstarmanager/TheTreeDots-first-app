<template>
  <div id="q-app">
    <q-layout view="hHh Lpr lff" container style="min-height: 99vh">
      <q-header elevated style="background-color: white !important">
        <q-toolbar>
          <q-btn flat round dense icon="menu" class="q-mr-md" />
          <img src="~assets/treelog-logo-page.png" />

          <q-toolbar-title></q-toolbar-title>

          <!--          <a style="margin-right: 15px" href="#"><img src="~assets/logo-noti.png" /></a>-->
          <a style="margin-right: 15px" href="#">
            <img src="~assets/logo-profile.png" />

            <q-menu v-show="showDropdown" :offset="[130, 20]">
              <q-list style="min-width: 100px">
                <q-item clickable v-close-popup style="border-bottom: 1px solid #707070">
                  <q-item-section avatar>
                    <q-avatar v-if="userInfo.image">
                      <template #default>
                        <img class="img-icon-item" :src="userInfo.image" alt="icon" />
                      </template>
                    </q-avatar>
                    <q-avatar v-else icon="people" size="m" color="secondary" />
                  </q-item-section>
                  <q-item-section>
                    <span>{{ userInfo ? userInfo.first_name + ' ' + userInfo.last_name : '' }}</span>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup>
                  <q-item-section avatar>
                    <q-avatar icon="manage_accounts" size="m" color="white" />
                  </q-item-section>

                  <q-item-section>
                    <span>Account</span>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="logout">
                  <q-item-section avatar>
                    <q-avatar icon="logout" size="m" color="white" />
                  </q-item-section>

                  <q-item-section>
                    <span style="color: red">Sign out</span>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </a>
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page style="padding-top: 30px; padding-left: 30px" class="q-pa-md">
          <router-view></router-view>
        </q-page>
      </q-page-container>

      <q-drawer
        v-model="drawer"
        show-if-above
        :mini="!drawer || miniState"
        :width="270"
        :breakpoint="500"
        bordered
        class="bg-grey-3"
      >
        <q-scroll-area class="fit" style="padding-top: 2vh">
          <q-item>
            <q-item-section avatar @click="miniState = false">
              <a style="margin-right: 15px" href="#">
                <q-avatar v-if="userInfo.image">
                  <template #default>
                    <img class="img-icon-item" :src="userInfo.image" alt="icon" />
                  </template>
                </q-avatar>
                <q-avatar v-else icon="people" size="m" color="secondary" />
              </a>
            </q-item-section>

            <q-item-section>
              <span>{{ userInfo ? userInfo.first_name + ' ' + userInfo.last_name : '' }}</span>
            </q-item-section>
          </q-item>

          <q-item class="q-pa-none" v-for="isRouter in renderRouter" :key="`/${isRouter.path}`">
            <q-expansion-item v-if="isRouter.children" @click="miniState = false" style="width: 100%">
              <template v-slot:header>
                <q-item-section avatar>
                  <q-avatar>
                    <template #default>
                      <img class="img-icon-item" :src="isRouter.icon" alt="icon" />
                    </template>
                  </q-avatar>
                </q-item-section>
                <q-item-section>{{ isRouter.title }}</q-item-section>
              </template>

              <q-list
                v-for="subRouter in isRouter.children"
                :key="`/${isRouter.path}/${subRouter.path}`"
                class="q-pl-lg"
                @click="goto(`${isRouter.path}/${subRouter.path}`)"
              >
                <q-item :active="`/${isRouter.path}/${subRouter.path}` === activeRouters" to="#">
                  <q-item-section avatar></q-item-section>

                  <q-item-section>
                    <q-item-label>{{ subRouter.title }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
            <q-item
              v-if="!isRouter.children"
              :active="`/${isRouter.path}` === activeRouters"
              to="#"
              style="width: 100%"
              @click="goto(`${isRouter.path}`)"
            >
              <q-item-section avatar>
                <q-avatar>
                  <template #default>
                    <img class="img-icon-item" :src="isRouter.icon" alt="icon" />
                  </template>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ isRouter.title }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-item>
        </q-scroll-area>

        <div class="q-mini-drawer-hide absolute" style="top: 30px; right: -17px">
          <q-btn
            class="btn-mini-menu"
            dense
            round
            unelevated
            text-color="black"
            icon="chevron_left"
            @click="miniState = true"
          />
        </div>
      </q-drawer>
    </q-layout>
  </div>
</template>

<script>
import { MAIN_ROUTER } from 'src/router/routes.js';
import { queryMe } from 'src/api/user';
import { _ } from 'src/utils/function';

export default {
  name: 'DashboardLayout',
  components: {},
  data() {
    return {
      showDropdown: false,
      drawer: false,
      miniState: false,
      listRouter: [...MAIN_ROUTER],
      activeLayoutPage: ''
    };
  },
  created() {
    if (!this.userInfo.id) {
      this.initUserData();
    }
  },
  mounted() {},
  methods: {
    goto(path) {
      this.$router.push(`/${path}`);
    },
    mouseOver() {
      this.showDropdown = !this.showDropdown;
    },
    logout() {
      this.$store.dispatch('clearUserState');
      this.$router.push('/login');
    },
    initUserData() {
      this.$apollo
        .query({
          query: queryMe
        })
        .then((res) => {
          this.$store.dispatch('setUser', _.get(res, 'data.getOneUser', {}));
        })
        .catch((err) => {
          console.log('err queryMe ::: ', err);
        });
    }
  },
  computed: {
    activeRouters() {
      return this.$route.matched.map((x) => x.path).at(-1);
    },
    renderRouter() {
      return this.listRouter.sort((a, b) => a.order - b.order);
    },
    userInfo() {
      return this.$store.state.user.user;
    }
  }
};
</script>
<style scoped lang="scss">
.btn-mini-menu {
  background: white;
  color: black;
  border: 1px solid #c1c1c1;
  box-shadow: rgba(0, 0, 0, 0.5) 0 0 3px;
}

.q-item--active {
  color: #04565a;
  background: rgba(4, 86, 90, 0.1);
}

.q-expansion-item__content > .q-pl-lg.q-list {
  padding-left: 0px;
}

.q-item--active {
  font-weight: bold;
}

.img-icon-item {
  width: 30px !important;
  height: 24px !important;
}
.q-avatar img:not(.q-icon) {
  border-radius: unset;
}
</style>
