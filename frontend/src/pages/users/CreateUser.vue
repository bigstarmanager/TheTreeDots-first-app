<template>
  <div style="margin-top: -20px">
    <div class="q-pa-md">
      <q-card>
        <div>
          <h5 style="padding-top: 15px; padding-left: 15px; margin-bottom: 10px">Create New User</h5>
        </div>

        <div class="row">
          <div class="col-md-12">
            <div class="q-pa-md">
              <q-card>
                <div
                  class="tong"
                  style="display: flex; justify-content: space-between; align-items: start; padding: 25px"
                >
                  <div class="zone-left" style="display: flex">
                    <div class="q-mr-md">
                      <q-avatar style="height: 100px; width: 100px">
                        <img style="object-fit: cover" :src="previewAvatar || defaultAvatar" />
                      </q-avatar>
                    </div>

                    <div>
                      <q-item-label class="q-mt-sm">
                        <q-btn
                          :disabled="false"
                          no-wrap
                          dense
                          no-caps
                          padding="0.5rem 2rem"
                          color="button-fill-active"
                          style="position: relative"
                        >
                          <span>Upload</span>
                          <q-file
                            style="opacity: 0; position: absolute; z-index: 20; width: 100%"
                            accept=".jpg, image/*"
                            v-model="fileAvatar"
                          />
                        </q-btn>
                      </q-item-label>

                      <q-item-label class="q-mt-lg" style="margin-top: 15px">
                        <div>You can upload jpg or png file</div>
                        <div style="margin-top: 5px">Max size is 2MB</div>
                      </q-item-label>
                    </div>
                  </div>
                </div>
              </q-card>
            </div>
          </div>

          <div class="col-4">
            <div class="q-pa-md">
              <span style="font-weight: bold">Name</span>
              <q-input filled v-model="user.name" placeholder="Enter Name" style="margin-bottom: 35px" />
            </div>
          </div>

          <div class="col-4">
            <div class="q-pa-md">
              <span style="font-weight: bold">Email</span>
              <q-input
                filled
                v-model="user.email"
                placeholder="Enter Email"
                type="email"
                style="margin-bottom: 35px"
              />
            </div>
          </div>

          <div class="col-4">
            <div class="q-pa-md">
              <span style="font-weight: bold">Phone</span>
              <q-input
                :prefix="'65 + '"
                mask="#### - #### "
                filled
                v-model="user.phone"
                placeholder="Phone Number"
                style="margin-bottom: 35px"
              >
                <template v-slot:prepend>
                  <img :src="iconSingapore" alt="" />
                </template>
              </q-input>
            </div>
          </div>

          <div class="col-4">
            <div class="q-pa-md">
              <span style="font-weight: bold">Country</span>
              <q-select filled v-model="user.country" :options="options" style="margin-bottom: 35px" />
            </div>
          </div>
          <div class="col-4">
            <div class="q-pa-md">
              <span style="font-weight: bold">Gender</span>
              <div style="margin-top: 10px; margin-left: -10px; margin-bottom: 35px">
                <q-radio v-model="user.gender" val="Male" label="Male" color="teal" />
                <q-radio v-model="user.gender" val="Female" label="Female" color="teal" />
              </div>
            </div>
          </div>
          <div class="col-4">
            <div class="q-pa-md">
              <span style="font-weight: bold">User Type</span>
              <div style="margin-top: 10px; margin-left: -10px; margin-bottom: 35px">
                <q-radio v-model="user.userType" val="Member" label="Member" color="teal" />
                <q-radio v-model="user.userType" val="Driver" label="Driver" color="teal" />
              </div>
            </div>
          </div>

          <div class="col-4">
            <div class="q-pa-md">
              <span style="font-weight: bold">Password</span>
              <q-input
                v-model="user.password"
                filled
                :type="isPwd ? 'password' : 'text'"
                placeholder="Enter Password"
                autocomplete="new-password"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </div>
          </div>
          <div class="col-4">
            <div class="q-pa-md">
              <span style="font-weight: bold">Confirm Password</span>
              <q-input
                v-model="user.confirmPassword"
                filled
                :type="isConfirmPwd ? 'password' : 'text'"
                placeholder="Confirm Password"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isConfirmPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isConfirmPwd = !isConfirmPwd"
                  />
                </template>
              </q-input>
            </div>
          </div>
          <div class="col-4">
            <div class="q-pa-md">
              <span style="font-weight: bold">Status</span>
              <div style="margin-left: -15px">
                <q-toggle size="lg" v-model="user.status" label="Active" color="color-main" />
              </div>
            </div>
          </div>
        </div>

        <q-btn
          :disabled="false"
          no-wrap
          dense
          no-caps
          padding="0.5rem 2rem"
          color="button-fill-active"
          style="margin: 1rem"
        >
          <span>Add New User</span>
        </q-btn>
      </q-card>
    </div>
  </div>
</template>

<script>
import defaultAvatar from '../../assets/images/icon/default-avatar-profile-icon-social.jpg';
import iconSingapore from '../../assets/icon_singapore.png';
export default {
  name: 'createNewUser',
  props: {},
  components: {},
  data() {
    return {
      iconSingapore,
      defaultAvatar,
      userStatus: true,
      previewAvatar: null,
      fileAvatar: null,
      group: [],
      options: ['Singapore', 'Malaysia', 'Indonexia'],
      modalConfirmTitle: '',
      modalConfirmContent: '',
      modalConfirmOk: '',
      modalConfirmCancel: '',
      isPwd: true,
      isConfirmPwd: true,
      user: {
        avata: '',
        name: '',
        email: '',
        phone: '',
        country: 'Singapore',
        gender: 'Male',
        userType: 'Member',
        password: '',
        confirmPassword: '',
        status: false
      }
    };
  },
  watch: {
    fileAvatar: function (val) {
      if (val.size / (1024 * 1024) > 2) {
        this.$q.notify({
          type: 'warning',
          message: `You can upload jpg or png file Max size is 2MB`
        });
      } else {
        this.previewAvatar = this.createObjectURL(val);
      }
    }
  },
  created() {},
  computed: {},
  methods: {
    createObjectURL(object) {
      return window.URL ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
    }
  }
};
</script>

<style lang="scss" scoped>
.delete-user {
  &::before {
    content: '';
    width: 1px;
    height: 15px;
    background: #000;
    position: absolute;
    top: 50%;
    left: 0;
    z-index: 1222;
    transform: translateY(-50%);
  }
}
</style>
