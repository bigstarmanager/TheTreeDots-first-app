<template>
  <div>
    <div v-if="keyTab === '1'" class="row justify-between" style="margin-bottom: 40px">
      <div class="headerTitle">Users</div>
      <div class="">
        <q-btn :disabled="false" no-wrap dense no-caps padding="0.5rem" color="button-fill-active">
          <span @click="keyTab = '3'">Add New User</span>
        </q-btn>
      </div>
    </div>

    <div v-else>
      <div class="btn-pointer" style="margin-bottom: 0" @click="callback('1')">
        <q-icon size="24px" name="arrow_back" style="margin-right: 10px" />
        Back
      </div>
    </div>

    <template>
      <div>
        <tableViewUsers
          v-if="keyTab === '1'"
          ref="userViewList"
          :get-data-table="dataRenderTable"
          @onSelectChange="onSelectChange"
          @onTableOptionsChanged="onTableOptionsChanged"
          :get-pagination="{
            total: pagination.totalItems,
            current: pagination.page,
            pageSize: pagination.limit
          }"
          @emitAssign="showUserDetail"
        >
          <template v-if="tableLoading" v-slot:loading>
            <div class="spinner-loading">
              <q-spinner color="primary" size="3em" />
            </div>
          </template>

          <template v-slot:top>
            <div class="row justify-between" style="width: 100%">
              <div style="width: 300px">
                <inputSearch style="border: none" placeholder="Search Driver" @outputSearch="onSearch" />
              </div>

              <div class="row items-center">
                <span style="margin-right: 10px" class="container-btn-filter">
                  <!-- <q-icon style="font-size: 30px" name="mdi-filter-outline" /> -->

                  <q-btn icon="mdi-filter-outline" rounded>
                    <q-menu>
                      <div class="row no-wrap q-pa-md">
                        <div class="column" style="padding: 26px; width: 200px">
                          <div class="q-gutter-sm">
                            <q-checkbox style="margin: 0" color="secondary" v-model="valCheck" label="All" />
                          </div>
                          Status
                          <div class="q-gutter-sm">
                            <q-checkbox
                              style="margin: 0"
                              color="secondary"
                              v-model="valCheck"
                              label="Active"
                            />
                          </div>
                          <div class="q-gutter-sm">
                            <q-checkbox
                              style="margin: 0"
                              color="secondary"
                              v-model="valCheck"
                              label="Inactive"
                            />
                          </div>
                          Country
                          <div class="q-gutter-sm">
                            <q-checkbox
                              style="margin: 0"
                              color="secondary"
                              v-model="valCheck"
                              label="Singapore"
                            />
                          </div>
                          <div class="q-gutter-sm">
                            <q-checkbox
                              style="margin: 0"
                              color="secondary"
                              v-model="valCheck"
                              label="Malaysia"
                            />
                          </div>
                          <div class="q-gutter-sm">
                            <q-checkbox
                              style="margin: 0"
                              color="secondary"
                              v-model="valCheck"
                              label="Indonesia"
                            />
                          </div>
                          Gender
                          <div class="q-gutter-sm">
                            <q-checkbox style="margin: 0" color="secondary" v-model="valCheck" label="Male" />
                          </div>
                          <div class="q-gutter-sm">
                            <q-checkbox
                              style="margin: 0"
                              color="secondary"
                              v-model="valCheck"
                              label="Female"
                            />
                          </div>
                        </div>
                      </div>
                    </q-menu>
                  </q-btn>
                </span>

                <span>
                  <!-- <q-btn
                    :disabled="selectedLength == 0 ? true : false"
                    no-wrap
                    dense
                    no-caps
                    padding="0.5rem"
                    :outline="selectedLength != 0 ? false : true"
                    :color="selectedLength == 0 ? 'button-border-disable' : 'button-fill-active'"
                  >
                    <span
                      >Action <span v-if="selectedLength != 0"> On {{ selectedLength }} Users </span>
                      <q-icon name="mdi-chevron-down" size="1.5rem" />
                    </span>
                  </q-btn> -->

                  <q-btn-dropdown
                    :label="selectedLength != 0 ? 'Action On ' + selectedLength + ' Users' : 'Action'"
                    :disabled="selectedLength == 0 ? true : false"
                    no-wrap
                    dense
                    no-caps
                    padding="0.5rem"
                    :outline="selectedLength != 0 ? false : true"
                    :color="selectedLength == 0 ? 'button-border-disable' : 'button-fill-active'"
                  >
                    <q-list>
                      <q-item clickable v-close-popup @click="onItemClick">
                        <q-item-section>
                          <q-item-label @click="changeStatus('active')">Make Active</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item clickable v-close-popup @click="onItemClick">
                        <q-item-section>
                          <q-item-label @click="changeStatus('inActive')">Make Inactive</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                </span>
              </div>
            </div>
          </template>
        </tableViewUsers>

        <userDetail v-if="keyTab === '2'" @saveUser="saveUser" @savePassword="savePassword"></userDetail>
        <createNewUser v-if="keyTab === '3'"></createNewUser>
      </div>
    </template>
  </div>
</template>

<script>
import iconFilter from '../../assets/images/icon/icon-filter.png';
import singleSelect from '../../components/jobs/main/singleSelect.vue';

export default {
  name: 'index',
  components: {
    singleSelect,
    inputSearch: () => import('src/components/share/Search.vue'),
    tableViewUsers: () => import('../../components/jobs/table/tableViewUsers.vue'),
    modalGMap: () => import('../../components/jobs/modal/modalGMap.vue'),
    createNewUser: () => import('./CreateUser.vue'),
    userDetail: () => import('src/pages/users/userDetail.vue')
  },
  data() {
    return {
      inception: false,
      valCheck: false,
      status: 'active',
      selectedLength: 0,
      iconFilter: iconFilter,
      selectedRowKeys: [], // Check here to configure the default column
      tableLoading: false,
      dataTable: [],
      pagination: {
        totalItems: 0,
        page: 1,
        limit: 10
      },
      userDetailInfor: {},
      keyTab: '1'
    };
  },
  async created() {
    this.$q.loading.show();
    this.initData();
  },
  computed: {
    userInfo() {
      return this.$store.state.user.user;
    },
    dataRenderTable() {
      let arr = [];
      if (!!this.dataTable) {
        this.dataTable.map((item) => {
          let obj = {
            ...item
          };

          arr.push(obj);
        });
      }
      return arr || [];
    }
  },
  watch: {},
  methods: {
    onItemClick() {},
    onSearch() {},
    resetData() {
      this.removeSelection();
      this.pagination = {
        totalItems: 0,
        page: 1,
        limit: 10
      };
    },
    async saveUser(value) {
      this.keyTab = '1';
      await this.initData();
    },
    async savePassword(value) {
      this.keyTab = '1';
      await this.initData();
    },
    async reload() {
      if (this.keyTab === '1') {
        await this.initData();
      }
    },
    async callback(value) {
      await this.resetData();
      this.keyTab = value;
      this.initData();
    },
    initData() {
      this.tableLoading = true;
      let arr = [
        {
          id: 1,
          name: 'tien',
          email: 'tien@gmail.com',
          phone: '0337765433',
          gender: 'Male',
          country: 'Malaysia',
          userType: 'Drive',
          active: true
        },
        {
          id: 2,
          name: 'tien',
          email: 'tien@gmail.com',
          phone: '0337765433',
          gender: 'Male',
          country: 'Malaysia',
          userType: 'Drive',
          active: true
        },
        {
          id: 3,
          name: 'tien',
          email: 'tien@gmail.com',
          phone: '0337765433',
          gender: 'Male',
          country: 'Malaysia',
          userType: 'Drive',
          active: true
        },
        {
          id: 4,
          name: 'tien',
          email: 'tien@gmail.com',
          phone: '0337765433',
          gender: 'Male',
          country: 'Malaysia',
          userType: 'Drive',
          active: true
        },
        {
          id: 5,
          name: 'tien',
          email: 'tien@gmail.com',
          phone: '0337765433',
          gender: 'Male',
          country: 'Malaysia',
          userType: 'Drive',
          active: true
        },
        {
          id: 6,
          name: 'tien',
          email: 'tien@gmail.com',
          phone: '0337765433',
          gender: 'Male',
          country: 'Malaysia',
          userType: 'Drive',
          active: true
        },
        {
          id: 7,
          name: 'tien',
          email: 'tien@gmail.com',
          phone: '0337765433',
          gender: 'Male',
          country: 'Malaysia',
          userType: 'Drive',
          active: true
        },
        {
          id: 8,
          name: 'tien',
          email: 'tien@gmail.com',
          phone: '0337765433',
          gender: 'Male',
          country: 'Malaysia',
          userType: 'Drive',
          active: true
        },
        {
          id: 9,
          name: 'tien',
          email: 'tien@gmail.com',
          phone: '0337765433',
          gender: 'Male',
          country: 'Malaysia',
          userType: 'Drive',
          active: true
        }
      ];
      this.dataTable = arr;
      this.pagination.totalItems = arr.length;
      this.$q.loading.hide();
      this.tableLoading = false;
    },
    tableCancel() {
      this.isSHowModalGMap = false;
      this.removeSelection();
    },
    onTableOptionsChanged(pagination) {
      this.pagination = {
        ...this.pagination,
        page: pagination.current,
        limit: pagination.pageSize
      };
      this.reload();
    },
    triggerPositive() {
      this.$q.notify({
        type: 'positive',
        position: 'top',
        message: `Successful`
      });
    },
    showUserDetail(value) {
      this.userDetailInfor = { ...value };
      this.keyTab = '2';
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedLength = this.selectedRowKeys.length;
    },
    changeStatus(status) {
      this.$q.notify({
        type: 'positive',
        message: `Success Message here...`
      });
    },
    //=================mutation driver===============================
    //=================mutation remove jobs===============================
    mutationRemove() {
      if (this.keyTab === '1') {
        let payloadArray = [];
        this.selectedRowKeys.map((item) => {
          payloadArray.push(item.id);
        });
        this.mutationRemoveJobs(payloadArray);
      } else {
        this.mutationAssignDriver(this.driverUserId);
      }
    },
    removeSelection() {
      this.selectedRowKeys = [];
      // this.$refs.userViewList.handleSetDataSelectedRowKey([]);
    },
    handleSetDataSelectedRowKey(data) {
      let arr = [...data];
      this.selectedRowKeys = arr;
      console.log('this.selectedRowKeys', this.selectedRowKeys);
    }
  }
};
</script>

<style lang="scss" scoped>
.container-btn-filter::v-deep .q-btn__wrapper::before {
  box-shadow: unset !important;
}

.headerTitle {
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 20px;
  letter-spacing: 0.32px;
  display: flex;
  align-items: center;
  // padding-bottom: 30px;
}
.btn-create {
  text-align: right;
}

.ml-2 {
  margin-left: 8px;

  ::placeholder {
    color: rgba(0, 0, 0, 0.65);
  }
}

.mt-2 {
  margin-top: 8px;
}

.tagTotalOrder {
  background-color: rgba(188, 0, 0, 0.1);
  color: #bc0000 !important;
  border-radius: 44px;
  width: fit-content;
  padding: 10px 14px;
  height: 40px;

  span {
    font-weight: bold;
  }
}

.text-selected {
  margin: 8px 65px 0 0;
  white-space: nowrap;

  span {
    white-space: nowrap;
    font-size: 14px;
    line-height: 20px;
    color: #66717c;
  }

  .text-tag-selected {
    display: flex;
    cursor: pointer;
    background: #e1e4e6;
    border-radius: 44px;
    color: #010219;
    font-weight: bold;
    font-size: 14px;
    width: max-content;
    margin-left: 6px;
    padding: 0 4px 0 6px;
  }
}

.ant-btn.buttonDisable {
  border-color: #a2acb5;
  background: #a2acb5;

  &:hover {
    background: #a2acb5;

    span {
      color: white;
    }
  }
}

.buttonDisable {
  border-color: #a2acb5;
  background: #a2acb5;
  height: 36px;
  padding: 6px 12px;

  span {
    color: white;
  }

  &:hover {
    background: #a2acb5;

    span {
      color: white;
    }
  }

  &:focus {
    background: #a2acb5;
    border-color: #a2acb5;

    span {
      color: white;
    }
  }
}

.buttonActive {
  border-color: #04565a;
  background: #04565a;
  height: 36px;
  padding: 6px 12px;

  span {
    color: white;
  }

  &:hover {
    background: #04565a;

    #A2ACB5 span {
      color: white;
    }
  }

  &:focus {
    background: #04565a;
    border-color: #04565a;

    span {
      color: white;
    }
  }
}

.buttonActive-regular {
  border-color: #04565a;
  background: white;
  height: 36px;
  padding: 6px 12px;

  span {
    color: #04565a;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
  }

  &:hover {
    background: white;

    #A2ACB5 span {
      color: #04565a;
    }
  }

  &:focus {
    border-color: #04565a;
    background: white;

    span {
      color: #04565a;
    }
  }
}
</style>
