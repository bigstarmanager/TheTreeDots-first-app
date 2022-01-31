<template>
  <div style="margin-top: -20px">
    <div class="q-pa-sm">
      <q-card>
        <div>
          <h5 style="padding-top: 15px; padding-left: 15px; margin-bottom: 10px">User Details</h5>
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
                        <img :src="userData.image_url" />
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
                        >
                          <span>Change</span>
                        </q-btn>

                        <q-btn
                          :disabled="false"
                          no-wrap
                          dense
                          no-caps
                          padding="0.5rem 2rem"
                          outline
                          color="button-border-active"
                          style="margin-left: 1vw"
                        >
                          <span>Remove</span>
                        </q-btn>
                      </q-item-label>

                      <q-item-label class="q-mt-lg" style="margin-top: 15px">
                        <div>You can upload jpg or png file</div>
                        <div style="margin-top: 5px">Max size is 2MB</div>
                      </q-item-label>
                    </div>
                  </div>

                  <div class="zone-right" style="display: flex; align-items: center">
                    <div>Status :</div>

                    <div style="padding-right: 15px">
                      <q-toggle size="lg" v-model="userData.status" label="Active" color="color-main" />
                    </div>

                    <div class="q-pl-md delete-user" style="position: relative">
                      <a href="#" style="color: red" @click="isShowModalRegular = true"> Delete User </a>
                    </div>
                  </div>
                </div>
              </q-card>
            </div>
          </div>

          <div class="col-4">
            <div class="q-pa-md">
              <span style="font-weight: bold">Name</span>
              <q-input
                filled
                v-model="userData.name"
                placeholder="Enter your name"
                style="margin-bottom: 35px"
                :disable="!editUser"
              />
            </div>
          </div>

          <div class="col-4">
            <div class="q-pa-md">
              <span style="font-weight: bold">Email</span>
              <q-input
                filled
                v-model="userData.email"
                placeholder="Enter your email"
                style="margin-bottom: 35px"
                :disable="!editUser"
              />
            </div>
          </div>

          <div class="col-4">
            <div class="q-pa-md">
              <span style="font-weight: bold">Phone</span>
              <q-input
                filled
                v-model="userData.phone"
                placeholder="Enter your phone"
                style="margin-bottom: 35px"
                :disable="!editUser"
              />
            </div>
          </div>

          <div class="col-4">
            <div class="q-pa-md">
              <span style="font-weight: bold">Country</span>
              <q-input
                filled
                v-model="userData.country"
                placeholder="Enter your country"
                style="margin-bottom: 35px"
                :disable="!editUser"
              />
            </div>
          </div>

          <div v-if="!editUser" class="col-4">
            <div class="q-pa-md">
              <span style="font-weight: bold">User Type</span>
              <q-input
                filled
                v-model="userData.userType"
                placeholder="Enter type user"
                style="margin-bottom: 35px"
                :disable="!editUser"
              />
            </div>
          </div>

          <div v-else class="col-4">
            <div class="q-pa-md">
              <span style="font-weight: bold">User Type</span>
              <div style="margin-top: 10px; margin-left: -10px; margin-bottom: 35px">
                <q-radio v-model="userData.userType" val="Member" label="Member" color="teal" />
                <q-radio v-model="userData.userType" val="Driver" label="Driver" color="teal" />
              </div>
            </div>
          </div>

          <div v-if="!editUser" class="col-4">
            <div class="q-pa-md">
              <span style="font-weight: bold">Gender</span>
              <q-input
                filled
                v-model="userData.gender"
                placeholder="Enter your gender"
                style="margin-bottom: 35px"
                :disable="!editUser"
              />
            </div>
          </div>

          <div v-else class="col-4">
            <div class="q-pa-md">
              <span style="font-weight: bold">Gender</span>
              <div style="margin-top: 10px; margin-left: -10px; margin-bottom: 35px">
                <q-radio v-model="userData.gender" val="Male" label="Male" color="teal" />
                <q-radio v-model="userData.gender" val="Female" label="Female" color="teal" />
              </div>
            </div>
          </div>
        </div>

        <q-btn
          v-if="!editUser"
          :disabled="false"
          no-wrap
          dense
          no-caps
          padding="0.5rem 2rem"
          color="button-fill-active"
          style="margin: 1rem"
          @click="(editUser = true), (editPassword = false)"
        >
          <span>Edit Information</span>
        </q-btn>

        <q-btn
          v-else
          no-wrap
          dense
          no-caps
          padding="0.5rem 2rem"
          color="button-fill-active"
          style="margin: 1rem"
          @click="saveUserEdit"
        >
          <span>Save Changes</span>
        </q-btn>
      </q-card>
    </div>

    <div class="q-pa-sm">
      <q-card class="new-card">
        <div class="row">
          <div class="q-pa-md col-md-4">
            <span style="font-weight: bold">Password</span>

            <q-input v-model="userData.password" filled :type="isPwd ? 'password' : 'text'">
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>

          <div class="q-pa-md" style="padding-top: 45px">
            <q-btn
              :disabled="editUser"
              no-wrap
              dense
              no-caps
              padding="0.5rem 1rem"
              color="button-fill-active"
              @click="visible = true"
            >
              <span>Change Password</span>
            </q-btn>
          </div>
        </div>
      </q-card>
    </div>

    <modalConfirm
      modalTitle="Delete User"
      :show.sync="isShowModalRegular"
      :singleAssign="true"
      :titleBtnCancelSingleAssign="'Cancel'"
      :titleBtnActiveSingleAssign="'Delete Permanently'"
      :colorBtn="'negative'"
      :textProps="`Do you want to Delete ${userData.name} ? It will be deleted permanently.`"
      :bodyStyle="'height: 70px'"
      @modalConfirmAssign="deleteUser"
    >
    </modalConfirm>

    <modalCommon
      v-model="visible"
      ref="changePassword"
      :modalTitle="'Change Password'"
      :width="'width: 500px; max-width: 1230px'"
      :bodyStyle="'height: 250px'"
      @cancel="handleCancel"
    >
      <template #content>
        <div class="q-pa-md col-md-4">
          <span style="font-weight: bold">Enter New Password</span>

          <q-input v-model="userData.password" filled :type="isPwd1 ? 'password' : 'text'">
            <template v-slot:append>
              <q-icon
                :name="isPwd1 ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd1 = !isPwd1"
              />
            </template>
          </q-input>
        </div>

        <div class="q-pa-md col-md-4">
          <span style="font-weight: bold">Confirm Password</span>

          <q-input v-model="userData.password" filled :type="isPwd2 ? 'password' : 'text'">
            <template v-slot:append>
              <q-icon
                :name="isPwd2 ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd2 = !isPwd2"
              />
            </template>
          </q-input>
        </div>
      </template>

      <template #footer>
        <div class="action row justify-end q-pa-lg">
          <div>
            <q-btn no-wrap dense no-caps flat padding="0.5rem" color="dark" @click="handleCancel">
              <span>Cancel</span>
            </q-btn>
          </div>
          <div class="q-ml-md">
            <q-btn
              :disabled="false"
              no-wrap
              dense
              no-caps
              padding="0.5rem 1rem"
              color="button-fill-active"
              @click="savePassword"
            >
              <span>Change Password</span>
            </q-btn>
          </div>
        </div>
      </template>
    </modalCommon>
  </div>
</template>

<script>
export default {
  name: 'userDetail',
  props: {},
  components: {
    modalConfirm: () => import('src/components/jobs/main/modalConfirm.vue')
  },
  data() {
    return {
      userStatus: true,
      isPwd: true,
      isPwd1: true,
      isPwd2: true,
      group: [],
      options: [{ label: 'Friend request', value: true, color: 'green' }],
      modalConfirmTitle: '',
      modalConfirmContent: '',
      modalConfirmOk: '',
      modalConfirmCancel: '',
      userData: {},
      editUser: false,
      isShowModalRegular: false,
      visible: false
    };
  },
  watch: {
    getUserData: {
      deep: true,
      handler(value) {
        this.userData = {
          image_url: 'https://cdn.quasar.dev/img/boy-avatar.png',
          status: 'active',
          name: 'Davis Stanton',
          email: 'treelogs_test@gmail.com',
          phone: '+ 84 19001009',
          country: 'Singapore',
          userType: 'Driver',
          gender: 'male',
          password: '12345678'
        };
      }
    }
  },
  created() {
    this.userData = {
      image_url: 'https://cdn.quasar.dev/img/boy-avatar.png',
      status: 'active',
      name: 'Davis Stanton',
      email: 'treelogs_test@gmail.com',
      phone: '+ 84 19001009',
      country: 'Singapore',
      userType: 'Driver',
      gender: 'male',
      password: '12345678'
    };
  },
  computed: {},
  methods: {
    deleteUser() {
      this.triggerPositive();
      this.$emit('saveUser', true);
    },
    handleCancel() {
      this.visible = false;
    },
    saveUserEdit() {
      // call API save
      this.triggerPositive();
      this.$emit('saveUser', true);
    },
    savePassword() {
      // call API save
      this.triggerPositive();
      this.$emit('savePassword', true);
    },
    triggerPositive() {
      this.$q.notify({
        type: 'positive',
        position: 'top',
        message: `Changed Successful!`
      });
    }
  },
  props: {
    // userData: {
    //   type: Object,
    //   default() {
    //     return [];
    //   },
    //   required: false
    // }
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
