<template>
  <div class="q-pa-md" style="max-width: 488px; margin: 0 auto">
    <div class="column" style="height: 6vh; margin-top: 12vh">
      <div class="col" style="margin: 0 auto">
        <q-toolbar-title style="text-align: center; color: #586472">
          Sign In to TreeLogs Dashboard
        </q-toolbar-title>
      </div>
    </div>

    <div class="column" style="height: 12vh">
      <div class="q-pa-md">
        <div class="q-gutter-y-md">
          <q-btn-toggle
            v-model="signWith"
            class="my-custom-toggle"
            spread
            no-caps
            color="white"
            text-color="teal-9"
            toggle-color="teal-9"
            size="md"
            style="border-radius: 5px"
            :options="[
              { label: 'Sign In with Email Address', value: 'email' },
              { label: 'Sign In with Phone Number', value: 'phoneNumber' }
            ]"
          />
        </div>
      </div>
    </div>

    <div class="column" style="height: 150px">
      <div class="col">
        <q-form @submit="onSubmit" class="q-gutter-lg">
          <div v-if="signWith === 'email'">
            <span style="font-weight: bold">Email</span>
            <q-input filled v-model="user" placeholder="Enter your email" style="margin-bottom: 35px" />

            <span style="font-weight: bold">Password</span>
            <q-input filled v-model="password" placeholder="Enter your password" />
          </div>

          <div v-else>
            <span style="font-weight: bold">Phone Number</span>
            <q-input filled v-model="user" placeholder="Enter your phone" />
          </div>

          <p class="forgot-password">
            <span @click="isShowForgotPassword = true" color="#66717C">Forgot Password?</span>
          </p>

          <div>
            <q-btn
              label="Sign In"
              type="submit"
              text-color="white"
              no-caps
              style="width: 100%; background-color: #04565a"
            />
          </div>
        </q-form>
      </div>
    </div>

    <ForgotPassword
      v-model="isShowForgotPassword"
      :sendForgotPassword="sendForgotPassword"
      @cancel="handleCancel"
    />
  </div>
</template>

<script>
import { mutationUserSignIn } from 'src/api/user';
import { cipher } from 'src/utils/cipher';
import { _ } from 'src/utils/function';
import { setToken } from 'src/utils/user-local';
export default {
  name: 'PageLoginIndex',
  components: {
    ForgotPassword: () => import('components/modals/ForgotPassword.vue')
  },
  data() {
    return {
      user: '',
      password: '',
      signWith: 'email',
      isShowForgotPassword: false,
      sendForgotPassword: 'not send'
    };
  },
  methods: {
    onSubmit() {
      this.$apollo
        .mutate({
          mutation: mutationUserSignIn,
          variables: {
            identity: this.user,
            password: cipher()(this.password)
          }
        })
        .then((res) => {
          // this.loading = false;
          const tokenJwt = _.get(res, 'data.signIn.tokenJWT', '');
          if (!tokenJwt) return;
          setToken(tokenJwt);
          this.$store.dispatch('setIsLogin', true);
          this.$store.dispatch('setUser', res.data.signIn);
          this.$router.push({ name: 'Dashboard' });
        })
        .catch((err) => {
          // this.loading = false;
          // const { graphQLErrors, networkError } = err;
          const { graphQLErrors } = err;
          graphQLErrors.forEach((x) => {
            this.openNotificationWithIcon(x.message);
          });
        });
    },
    handleCancel() {
      this.isShowForgotPassword = false;
    },
    openNotificationWithIcon(msg) {
      this.$q.notify({
        type: 'warning',
        message: msg,
        position: 'top'
      });
    }
  }
};
</script>

<style lang="scss">
.my-custom-toggle {
  border: 1px solid #04565a;
}
</style>
