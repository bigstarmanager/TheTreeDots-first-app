<template>
  <div>
    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="showForgotPass">
        <q-card style="width: 100%">
          <q-toolbar>
            <q-toolbar-title>
              <span class="text-weight-bold" style="color: #586472"> Forgot Password</span>
            </q-toolbar-title>

            <q-btn flat round dense icon="close" v-close-popup @click="handleCancel" />
          </q-toolbar>

          <q-card-section v-if="sendForgotPassword == 'not send'">
            <div style="color: #586472; font-size: 15px; margin-bottom: 15px">
              Please enter your registered email. We will send a link to email to reset your password.
            </div>

            <div>
              <p style="margin-bottom: 10px">Email</p>
              <q-input filled v-model="password" placeholder="Enter your password" />
            </div>

            <div style="margin-top: 2vh">
              <q-btn
                label="Send Link"
                type="submit"
                text-color="white"
                no-caps
                style="width: 100%; background-color: #04565a"
                @click="onSubmit"
              />
            </div>
          </q-card-section>

          <q-card-section v-else-if="sendForgotPassword == 'sending'">
            <div class="q-pa-md">
              <div class="q-gutter-md row">
                <q-spinner style="margin: 0 auto" color="primary" size="3em" />
              </div>
            </div>

            <div style="margin-top: 5vh; text-align: center">
              <span> Sending an email... </span>
            </div>
          </q-card-section>

          <q-card-section v-else>
            <div style="color: #586472; font-size: 15px; margin-bottom: 15px">
              Plesase check your email to reset password. If you can't find it, also check the junk and spam
              pages.
            </div>

            <div style="color: #586472; font-size: 15px; margin-bottom: 5px">
              Didn't received the mail? Click button below.
            </div>

            <div style="margin-top: 2vh">
              <q-btn
                label="Resend Link"
                type="submit"
                text-color="white"
                no-caps
                style="width: 100%; background-color: #04565a"
                @click="onSubmit"
              />
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForgotPassword',
  props: {
    sendForgotPassword: {
      type: String,
      required: true,
      default: 'not send'
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      password: ''
    };
  },
  methods: {
    onSubmit() {
      this.sendForgotPassword = 'sending';

      //Call api send email new password
    },
    handleCancel() {
      this.$emit('cancel', false);
    }
  },
  computed: {
    showForgotPass: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('udpate:input', val);
      }
    }
  },
  data() {
    return {
      password: ''
    };
  }
};
</script>
