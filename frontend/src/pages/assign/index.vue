<template>
  <div>
    <a-row>
      <a-col :xs="{ span: 24, offset: 0 }" :lg="{ span: 12, offset: 0 }">
        <div style="display: flex; width: 100%" v-if="!isChangeTab">
          <singleSelect
            :data-props="listSupplier"
            width="width:150px"
            :default-value="td_tenant_id"
            @updateData="selectSupplier"
          />
          <div style="min-width: 200px" class="ml-2">
            <a-date-picker
              @change="onChange"
              placeholder="Filter by delivery date(s)"
              :format="dateFormat"
              style="width: 100%"
            />
          </div>

          <div style="display: flex" class="ml-2">
            <singleSelect
              :data-props="listWindow"
              width="width:150px"
              :default-value="delivery_window"
              @updateData="selectWindow"
            />
            <!--            <a-time-picker use12-hours format="h:mm a" @change="onChange" :minute-step="60"/>-->
            <!--            <a-time-picker use12-hours format="h:mm a" @change="onChange" :minute-step="60" class="ml-2"/>-->
          </div>
        </div>
      </a-col>
      <a-col :xs="{ span: 24, offset: 0 }" :lg="{ span: 12, offset: 0 }">
        <div class="btn-create">
          <a-button
            type="primary"
            :size="SITE_CONFIG.SIZE_ELEMENT"
            icon="plus"
            @click="handleAssignPack"
            :disabled="selectedRowKeys.length === 0"
          >
            Bulk assign (packing)
          </a-button>
          <a-button
            type="primary"
            :size="SITE_CONFIG.SIZE_ELEMENT"
            icon="plus"
            class="ml-2"
            @click="handleAssignDel"
            :disabled="selectedRowKeys.length > 0 ? false : true"
          >
            Bulk assign (delivery)
          </a-button>
        </div>
      </a-col>
    </a-row>
    <br />
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="Unassigned">
        <template v-if="keyTab === '1'">
          <template v-if="tableLoading">
            <div style="padding: 5rem 0; text-align: center">
              <a-spin :size="SITE_CONFIG.SIZE_ELEMENT" />
            </div>
          </template>
          <template v-else>
            <div v-if="dataTable.length === 0" style="padding: 2rem 0">
              <a-alert message="No Data" type="info" show-icon />
            </div>
            <div v-for="table in dataTable" :key="table.date_created" style="margin-bottom: 30px">
              <!--            {{table.jobs}}-->
              <UnAssigned
                :get-data-table="table.jobs"
                :ref="`UnAssigned-${table.date_created}`"
                :keyTable="table.date_created"
                :listSelect="modalArray"
                @onSelectChange="onSelectChange"
                @selectedItem="changeSelect"
              >
              </UnAssigned>
            </div>
          </template>
        </template>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Assigned">
        <template v-if="keyTab === '2'">
          <template v-if="tableLoading">
            <div style="padding: 5rem 0; text-align: center">
              <a-spin :size="SITE_CONFIG.SIZE_ELEMENT" />
            </div>
          </template>
          <template v-else>
            <div v-if="dataTable.length === 0" style="padding: 2rem 0">
              <a-alert message="No Data" type="info" show-icon />
            </div>
            <div v-for="table in dataTable" :key="table.date_created" style="margin-bottom: 30px">
              <assigned
                :get-data-table="table.jobs"
                :ref="`Assigned-${table.date_created}`"
                :keyTable="table.date_created"
                :listSelect="modalArray"
                @onSelectChange="onSelectChange"
                @handleEdit="handleEdit"
              >
              </assigned>
            </div>
          </template>
        </template>
      </a-tab-pane>
    </a-tabs>

    <div class="btn-create">
      <a-button
        type="danger"
        :size="SITE_CONFIG.SIZE_ELEMENT"
        class="ml-2"
        @click="assignTeam"
        v-if="!tableLoading"
        :disabled="selectedRowKeys.length > 0 ? false : true"
      >
        {{ buttonText }}
      </a-button>
    </div>

    <modal-job
      :show.sync="isSHowModal"
      :title-props="modalTitle"
      :array-props="modalArray"
      @updateData="handleEmit"
    />
  </div>
</template>

<script>
import { SITE_CONFIG } from '../../config/site.config';
// import { queryAllJobs } from '../../../api/management/jobsManagement';
// import {_} from '../../utils/function';
import ModalJob from '../../components/jobs/main/modalBulk.vue';
import singleSelect from '../../components/jobs/main/singleSelect.vue';
//table
import UnAssigned from '../../components/assign/UnAssigned';

//functions
import { getDataSupplier, getDataWindow } from '../../utils/function';

//API call
import {
  getAllPrimaryTeamUnderMasterFranchise,
  allUnassignedJobsUnderMasterFranchise,
  assignAllSelectedServices,
  allAssignedJobsUnderMasterFranchise,
  bulkAssignAllSelectedServices
} from '../../api/assign/index';
import { queryMe } from '../../api/user';
import { _ } from '../../utils/function';

export default {
  name: 'index',
  components: {
    ModalJob,
    singleSelect,
    UnAssigned
  },
  data() {
    return {
      SITE_CONFIG: SITE_CONFIG,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      keyTab: '1',
      isSHowModal: false,
      modalTitle: '',
      buttonText: 'Confirm Assignment',
      tableLoading: false,
      listSupplier: [{ value: '', label: 'Filter by supplier' }],
      listWindow: [{ value: '', label: 'Filter by window' }],
      modalArray: [{ value: '', label: 'Assign 3PL for selected rows' }],
      // dateFormat: 'YYYY/MM/DD',
      dateFormat: 'DD/MM/YYYY',
      dataTable: [],
      delivery_date: '',
      td_tenant_id: '',
      delivery_window: '',
      listChangeData: [],
      filterCreated: true,
      isChangeTab: false
      //dataEmitFromBulk : [],
    };
  },
  async created() {
    if (!this.userInfo.id) {
      await this.initUserData();
      // await this.initData();
    } else {
      await this.initData();
    }
    await this.initSelect();
  },
  computed: {
    userInfo() {
      return this.$store.state.user.user;
    }
  },
  methods: {
    initData() {
      this.tableLoading = true;
      this.$apollo
        .query({
          query: allUnassignedJobsUnderMasterFranchise,
          variables: {
            userId: this.userInfo.id,
            delivery_date: this.delivery_date || null,
            td_tenant_id: Number(this.td_tenant_id) || null,
            delivery_window: this.delivery_window || null
          },
          fetchPolicy: 'no-cache'
        })
        .then((res) => {
          // this.$store.dispatch('setAllJobsManagement', _.get(res, 'data.allJobs', []));
          if (res && res.data && res.data.allUnassignedJobsUnderMasterFranchise) {
            this.dataTable = [];
            res.data.allUnassignedJobsUnderMasterFranchise.map((item) => {
              let obj = {
                ...item,
                selectedRowKeys: []
              };
              this.dataTable.push(obj);
            });
            console.log('datatable: ', this.dataTable);
            //init data for filter select
            if (this.filterCreated) {
              this.listSupplier = this.getSupplier(this.dataTable);
              //console.log('listSupplier: ', this.listSupplier);
              this.listWindow = this.getDeliveryWindow(this.dataTable);
              //console.log('listWindow: ', this.listWindow);
              this.filterCreated = false;
            }
            //
            this.tableLoading = false;
          }
        })
        .catch((error) => {
          console.log('error ::: ', error);
        });
    },
    initDataAssigned() {
      this.tableLoading = true;
      this.$apollo
        .query({
          query: allAssignedJobsUnderMasterFranchise,
          variables: {
            userId: this.userInfo.id,
            delivery_date: this.delivery_date || null,
            td_tenant_id: Number(this.td_tenant_id) || null,
            delivery_window: this.delivery_window || null
          },
          fetchPolicy: 'no-cache'
        })
        .then((res) => {
          // this.$store.dispatch('setAllJobsManagement', _.get(res, 'data.allJobs', []));
          if (res && res.data && res.data.allAssignedJobsUnderMasterFranchise) {
            this.dataTable = [];
            res.data.allAssignedJobsUnderMasterFranchise.map((item) => {
              let obj = {
                ...item,
                selectedRowKeys: []
              };
              this.dataTable.push(obj);
            });
            console.log('datatable: ', this.dataTable);
            //init data for filter select
            if (this.filterCreated) {
              this.listSupplier = this.getSupplier(this.dataTable);
              //console.log('listSupplier: ', this.listSupplier);
              this.listWindow = this.getDeliveryWindow(this.dataTable);
              //console.log('listWindow: ', this.listWindow);
              this.filterCreated = false;
            }
            //
            this.tableLoading = false;
          }
        })
        .catch((error) => {
          console.log('error ::: ', error);
        });
    },
    initSelect() {
      this.$apollo
        .query({
          query: getAllPrimaryTeamUnderMasterFranchise,
          fetchPolicy: 'no-cache'
        })
        // .then((res) => {
        //   this.$store.dispatch('setAllJobsManagement', _.get(res, 'data.allJobs', []));
        // })
        .then((res) => {
          if (res && res.data && res.data.getAllPrimaryTeamUnderMasterFranchise) {
            //console.log('Select options from API:',res.data.getAllPrimaryTeamUnderMasterFranchise);
            let selectOptions = res.data.getAllPrimaryTeamUnderMasterFranchise;
            let selectOptionsArr = [{ value: '', label: 'Assign 3PL for selected rows' }];
            selectOptions.map((item) => {
              let itemOptions = {
                value: item.id ? item.id : '',
                label: item.name ? item.name : ''
              };
              selectOptionsArr.push(itemOptions);
            });
            //this.modalArray.push(selectOptionsArr);
            this.modalArray = selectOptionsArr;
          }
        })
        .catch((error) => {
          console.log('error ::: ', error);
        });
    },
    initUserData() {
      this.$apollo
        .query({
          query: queryMe
        })
        .then((res) => {
          this.$store.dispatch('setUser', _.get(res, 'data.getOneUser', {}));
          this.initData();
        })
        .catch((err) => {
          console.log('err queryMe ::: ', err);
        });
    },
    async callback(key) {
      this.resetData();
      if (this.keyTab === '1') {
        this.filterCreated = true;
        await this.initDataAssigned();
      } else {
        this.filterCreated = true;
        await this.initData();
      }
      await this.changeKeyTab(key);
      this.isSelected = false;
      this.isChangeTab = false;
      if (this.keyTab === '1') this.buttonText = 'Confirm Assignment';
      else this.buttonText = 'Update Changes';
    },
    changeKeyTab(key) {
      this.keyTab = key;
      this.isChangeTab = true;
    },
    // start() {
    //   this.loading = true;
    //   // ajax request after empty completing
    //   setTimeout(() => {
    //     this.loading = false;
    //     this.selectedRowKeys = [];
    //   }, 1000);
    // },
    onSelectChange(selectedRowKeys, keyTable) {
      //this.dataEmitFromBulk = selectedRowKeys;
      this.dataTable.forEach((item) => {
        if (item.date_created === keyTable) {
          item.selectedRowKeys = selectedRowKeys;
          return;
        }
      });
      this.setSelectedRowKeys();
    },
    setSelectedRowKeys() {
      let arr = [];
      this.dataTable.map((item) => {
        arr = arr.concat(item.selectedRowKeys);
      });
      this.selectedRowKeys = arr;
      console.log('test:::::selected:::', this.selectedRowKeys);
    },
    setAllSelected(data) {
      let value = { ...data };
      let check = false;
      this.listChangeData.forEach((item) => {
        if (item.ids[0] === value.ids[0]) {
          check = true;
          return (item = { ...value });
        }
      });
      if (!check) {
        this.listChangeData.push(value);
      }
    },
    handleTableChange(pagination) {
      console.log(pagination);
    },
    handleEdit(value, keyTable) {
      console.log(value, keyTable);
      let arr = [...this.dataTable];
      arr.forEach((item) => {
        if (item.date_created === keyTable) {
          item.jobs.forEach((item2) => {
            if (item2.ids[0] === value.ids[0]) {
              item2 = {
                ...value
              };
              let refName = `Assigned-${item.date_created}`;
              this.$refs[refName][0].handleSetDataTable(item.jobs);
              return;
            }
          });
        }
      });
      this.dataTable = arr;
    },
    handleAssignPack() {
      this.isSHowModal = true;
      this.modalTitle = 'Please select the 3PL for packing';
      // this.modalArray = [{value:'Pack1',label:'testPack1'},{value:'Pack2',label:'testPack2'}];
    },
    handleAssignDel() {
      this.isSHowModal = true;
      this.modalTitle = 'Please select the 3PL for delivery';
      // this.modalArray = [{value: 'Del1', label: 'testDel1'}, {value: 'Del2', label: 'testDel2'}];
    },
    onChange(time, timeString) {
      console.log(time, timeString);
      if (time) {
        let myDate = timeString.split('/');
        // var newDate = new Date( myDate[2], myDate[1] - 1, myDate[0]);
        let getTime = new Date(Date.UTC(myDate[2], myDate[1] - 1, myDate[0]));
        console.log(getTime.getTime().toString());
        this.delivery_date = getTime.getTime().toString();
      } else {
        this.delivery_date = null;
      }

      if (this.keyTab === '1') this.initData();
      else this.initDataAssigned();
    },

    //  selectSupplier
    selectSupplier(value) {
      if (value) {
        this.td_tenant_id = value;
      } else {
        this.td_tenant_id = '';
      }
      if (this.keyTab === '1') this.initData();
      else this.initDataAssigned();
    },
    //  selectWindow
    selectWindow(value) {
      console.log(value);
      if (value) {
        this.delivery_window = value;
      } else {
        this.delivery_window = '';
      }
      if (this.keyTab === '1') this.initData();
      else this.initDataAssigned();
    },

    getSupplier(options) {
      return getDataSupplier(options);
    },
    getDeliveryWindow(options) {
      return getDataWindow(options);
    },
    resetData() {
      this.selectedRowKeys = [];
      this.td_tenant_id = '';
      this.delivery_window = '';
      this.delivery_date = null;
    },
    checkAllocationPacking(item) {
      let check = false;
      item.TlServices.map((item2) => {
        if (item2.tl_service_type_id === 3) {
          check = true;
          return;
        }
      });
      return check;
    },
    checkAllocationDelivery(item) {
      let check = false;
      item.TlServices.map((item2) => {
        if (item2.tl_service_type_id === 4) {
          check = true;
          return;
        }
      });
      return check;
    },

    //   edit
    assignTeam() {
      let listAssignTeam = [];
      this.dataTable.map((item) => {
        item.jobs.map((item2) => {
          if ('packingAllocation' in item2 || 'deliveryAllocation' in item2) {
            console.log('Enter for loop');
            let obj = {
              ids: []
            };
            item2.ids.forEach((item3) => {
              console.log(item3, Number(item3));
              obj.ids.push(Number(item3));
            });
            // console.log(obj)
            if ('packingAllocation' in item2 && this.checkAllocationPacking(item2)) {
              obj.type1 = {
                team_id: item2.packingAllocation,
                service_type_id: 3
              };
            }
            if ('deliveryAllocation' in item2 && this.checkAllocationDelivery(item2)) {
              obj.type2 = {
                team_id: item2.deliveryAllocation,
                service_type_id: 4
              };
            }
            listAssignTeam.push(obj);
          }
        });
      });
      console.log('listAssignTeam', listAssignTeam);
      // if(listAssignTeam.length > 0) this.mutationServices(listAssignTeam)
    },
    mutationServices(data) {
      console.log('mutation update services');
      this.$apollo
        .mutate({
          mutation: bulkAssignAllSelectedServices,
          variables: {
            item: data
          }
        })
        .then((res) => {
          if (res && res.data && res.data.bulkAssignAllSelectedServices) {
            this.selectedRowKeys = [];
            this.initData();
          }
        })
        .catch((error) => {
          console.log('error ::: ', error);
        });
    },
    handleEmit(value) {
      this.isSHowModal = false;
      // this.listError = [];
      this.dataTable.map((item) => {
        if (item.selectedRowKeys.length > 0) {
          item.selectedRowKeys.map((item2) => {
            let obj = item2;
            if (value.data) {
              obj.packingAllocation = value.packingAllocation;
              obj.deliveryAllocation = value.deliveryAllocation;
            }
            this.changeSelect(obj, item.date_created);
          });
        }
      });
    },
    changeSelect(value, keyTable) {
      console.log(value, keyTable);
      let arr = [...this.dataTable];
      arr.forEach((item) => {
        if (item.date_created === keyTable) {
          item.jobs.forEach((item2) => {
            if (item2.ids[0] === value.ids[0]) {
              item2 = {
                ...value
              };
              this.setAllSelected(value);
              return;
            }
          });
        }
      });
      this.dataTable = arr;
      this.assignTeam();
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-create {
  text-align: right;
}

.ml-2 {
  margin-left: 8px;

  ::placeholder {
    color: rgba(0, 0, 0, 0.65);
  }
}
</style>
