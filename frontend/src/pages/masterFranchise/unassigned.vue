<template>
  <div>
    <div class="headerTitle">Unassigned service orders</div>
    <tableMasterUnassigned
      :get-data-table="dataTable"
      :listSelect="modalArray"
      ref="UnAssignedTable"
      @onSelectChange="onSelectChange"
      @emitAssign="singleAssign"
      @onTableOptionsChanged="onTableOptionsChanged"
      :get-pagination="{
        total: pagination.totalItems,
        current: pagination.page,
        pageSize: pagination.limit
      }"
    >
      <template v-if="tableLoading" v-slot:loading>
        <div class="spinner-loading">
          <q-spinner color="primary" size="3em" />
        </div>
      </template>
      <template v-slot:top>
        <div style="display: flex; width: 100%">
          <p class="assign-text-total">Total Unassigned Orders:</p>
          <div class="tagTotalOrder">
            <span>{{ pagination.totalItems }} order</span>
          </div>
        </div>
        <q-separator style="width: 100%" />

        <div class="row" style="width: 100%">
          <!-- new -->
          <div class="col-lg-3 col-md-2 col-sm-2">
            <div class="q-pa-md">
              <div style="width: 21vw; margin-right: 38px">
                <inputSearch placeholder="Search invoice id or receipient" @outputSearch="onSearch" />
              </div>
            </div>
          </div>

          <div class="col-lg-9 col-md-10 col-sm-10">
            <div class="box-filter-search">
              <div class="ml-2 q-pa-md">
                <selectSearch
                  :data-props="listSupplier"
                  width="width:120px"
                  placeholder="All Supplier"
                  :default-value="td_tenant_id"
                  @updateData="selectSupplier"
                />
              </div>

              <div class="ml-2 q-pa-md">
                <selectSearch
                  :data-props="listZone"
                  width="width:120px"
                  placeholder="All Zone"
                  :default-value="zone"
                  @updateData="selectZone"
                />
              </div>

              <div class="ml-2 q-pa-md">
                <selectSearch
                  :data-props="listVehicleType"
                  width="width:120px"
                  placeholder="All Vehicle"
                  :default-value="vehicle_type"
                  @updateData="selectVehicle"
                />
              </div>

              <div class="screen-width-max-1366-active q-pa-md" style="display: flex">
                <div style="display: flex; justify-content: flex-end">
                  <div style="margin-top: 8px"><span>Delivery date:</span></div>
                  <div class="ml-2">
                    <datePicker @updateData="onChange"></datePicker>
                  </div>
                </div>

                <div style="display: flex; justify-content: flex-end; width: 17vw">
                  <div style="margin: 8px 0px"><span style="padding-right: 8px"> Window: </span></div>
                  <timeRange @updateData="onChangeTime" style="margin-top: 10px"></timeRange>
                </div>
              </div>
            </div>
          </div>

          <div class="row screen-width-max-1366-active" style="width: 100%">
            <div class="text-selected q-pl-md" style="margin: 26px 65px 0 0">
              <span v-if="selectedRowKeys.length === 0">Selected (0)</span>
              <div v-else style="display: flex">
                Selected
                <div class="text-tag-selected" @click="onChangeSelectedAll">
                  {{ selectedRowKeys.length }}
                  <q-icon
                    style="margin-left: 5px; height: 90%; margin-top: 1px"
                    name="mdi-close-circle"
                    color="negative"
                    size="1rem"
                  />
                </div>
              </div>
            </div>

            <div class="q-ml-md q-my-md">
              <q-btn
                :disabled="selectedRowKeys.length === 0"
                no-wrap
                dense
                no-caps
                padding="0.5rem"
                :color="selectedRowKeys.length === 0 ? 'button-fill-disable' : 'button-fill-active'"
                @click="selectedAssign"
              >
                <img :src="icon_update_3pl_white" alt="" />
                <span class="q-ml-sm">Update Assignment</span>
              </q-btn>
            </div>
          </div>

          <div class="col-lg-12 col-xs-12 screen-width-max-1366-off" style="height: 60px">
            <div class="box-filter-search">
              <div class="text-selected q-pl-md">
                <span v-if="selectedRowKeys.length === 0">Selected (0)</span>
                <div v-else style="display: flex">
                  Selected
                  <div class="text-tag-selected" @click="onChangeSelectedAll">
                    {{ selectedRowKeys.length }}
                    <q-icon
                      style="margin-left: 5px; height: 90%; margin-top: 1px"
                      name="mdi-close-circle"
                      color="negative"
                      size="1rem"
                    />
                  </div>
                </div>
              </div>

              <div class="q-ml-md q-my-md">
                <q-btn
                  :disabled="selectedRowKeys.length === 0"
                  no-wrap
                  dense
                  no-caps
                  padding="0.5rem"
                  :color="selectedRowKeys.length === 0 ? 'button-fill-disable' : 'button-fill-active'"
                  @click="selectedAssign"
                >
                  <img :src="icon_update_3pl_white" alt="" />
                  <span class="q-ml-sm">Update Assignment</span>
                </q-btn>
              </div>

              <div class="btn-create ml-2 q-pa-md" style="display: flex; justify-content: flex-end">
                <div style="margin-top: 8px"><span>Delivery date:</span></div>
                <div class="ml-2">
                  <datePicker @updateData="onChange"></datePicker>
                </div>
              </div>

              <div
                class="btn-create ml-2 q-pa-md"
                style="display: flex; justify-content: flex-end; width: 20vw"
              >
                <div style="margin: 8px 0px"><span style="padding-right: 8px"> Window: </span></div>
                <timeRange @updateData="onChangeTime" style="margin-top: 10px"></timeRange>
              </div>
            </div>
          </div>
        </div>

        <br />
      </template>
    </tableMasterUnassigned>

    <!-- =================================== -->

    <modal-job
      v-show="isSHowModal"
      :is-open-modal.sync="isSHowModal"
      width="width:600px;"
      body-style="height:200px"
      :modal-title="modalTitle"
      :array-props="modalArray"
      @updateData="handleEmit"
      :selectedSingleItem="selectedSingleItem"
    />
    <modal-confirm
      v-show="isShowModalConfirm"
      :show.sync="isShowModalConfirm"
      title-props="Are you sure?"
      body-style="height:100px"
      :textProps="
        isSignleAssign
          ? 'You will send assignements to Primary 3PL. Are you sure you want to send it?'
          : 'You will cancel this process. You will have to redo the process from the beginning if you cancel it.'
      "
      :singleAssign="isSignleAssign"
      @modalConfirmAssign="handleConfirmAssign"
      @modalConfirmCancel="closeAllModal"
    />
    <modal-table
      v-show="isShowModalTable"
      :show.sync="isShowModalTable"
      width="width:735px;"
      body-style="height:500px"
      @tableOK="handleTableOK"
      @tableCancel="handleTableCancel"
      @emitAssign="removeSelectedRowKeys"
      :list-data="dataRenderModalTable"
      :listSupplier="listSupplier"
    />
  </div>
</template>

<script>
import { SITE_CONFIG } from 'src/config/site.config';
// import ModalJob from 'components/jobs/main/modalBulk.vue';
// import ModalTable from 'components/jobs/main/modalTable.vue';
// import ModalConfirm from 'components/jobs/main/modalConfirm.vue';
//table
import UnAssigned from 'components/assign/UnAssigned.vue';
// import iconFilter from '../../assets/images/icon/icon-filter.png';

//API call
import {
  getAllPrimaryTeamUnderMasterFranchise,
  allUnassignedJobsUnderMasterFranchise,
  bulkAssignAllSelectedServices,
  allDistinctCollectionWindowJobsUnderMasterFranchise,
  allDistinctTenantJobsUnderMasterFranchise
} from 'src/api/assign/index';
import { queryMe } from 'src/api/user';
import { _ } from 'src/utils/function';
import icon_assign_3pl_white from 'src/assets/images/icon/icon_assign_3pl_white.png';
import icon_update_3pl_white from 'src/assets/images/icon/icon_update_3pl_white.png';
import icon_remove_small from 'src/assets/images/icon/icon-remove-small.png';
import { listWindow } from 'src/constants/assign';
import { convertTimeTo24h } from 'src/utils/function';

export default {
  name: 'index',
  components: {
    ModalJob: () => import('components/jobs/main/modalBulk.vue'),
    ModalConfirm: () => import('components/jobs/main/modalConfirm.vue'),
    ModalTable: () => import('components/jobs/main/modalTable.vue'),
    singleSelect: () => import('components/jobs/main/singleSelect.vue'),
    inputSearch: () => import('src/components/share/Search.vue'),
    selectSearch: () => import('src/components/jobs/main/selectSearch.vue'),
    tableMasterUnassigned: () => import('src/components/assign/tableMasterUnassigned.vue'),
    datePicker: () => import('src/components/jobs/main/datePicker.vue'),
    timeRange: () => import('src/components/jobs/main/timeRange.vue')
  },
  data() {
    return {
      icon_assign_3pl_white,
      icon_update_3pl_white,
      icon_remove_small,
      SITE_CONFIG: SITE_CONFIG,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      isSHowModal: false,
      isSHowError: false,
      modalTitle: '',
      buttonText: 'Confirm Assignment',
      tableLoading: false,
      // ====
      listSupplier: [{ value: '', label: 'All Supplier' }],
      listZone: [{ value: '', label: 'All Zone' }],
      zone: { value: '', label: 'All Zone' },
      listWindow: [...listWindow],
      // listZone: [{value: '', label: 'All Zone'}],
      modalArray: [{ value: '', label: 'Select Primary 3PL' }],

      // ========
      // dateFormat: 'YYYY/MM/DD',
      dateFormat: 'DD/MM/YYYY',
      dataTable: [],
      // delivery_date: '',
      startDate: '',
      endDate: '',
      startTime: null,
      endTime: null,
      td_tenant_id: { value: '', label: 'All Supplier' },
      zoneId: '',
      td_invoice_id: null,
      listChangeData: [],
      filterCreated: true,
      isChangeTab: false,
      //dataEmitFromBulk : [],
      totalOrder: 0,
      pagination: {
        totalItems: 0,
        page: 1,
        limit: 10
      },
      isShowModalConfirm: false,
      isShowModalTable: false,
      isSignleAssign: false,

      //   cache selected
      cacheSelected: null,
      selectedSingleItem: null,
      listVehicleType: [{ value: '', label: 'All Vehicle' }],
      vehicle_type: { value: '', label: 'All Vehicle' }
    };
  },
  async created() {
    this.$q.loading.show();
    if (!this.userInfo.id) {
      await this.initUserData();
      // await this.initData();
    } else {
      await this.initData();
      await this.initSelectFilter();
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.user;
    },
    dataRenderModalTable() {
      let arr = [];
      if (this.selectedRowKeys) {
        this.selectedRowKeys.map((item) => {
          let obj = {
            ...item
          };
          if (this.cacheSelected) {
            console.log(this.cacheSelected);
            obj.packingAllocation = this.renderNameAllocation(this.cacheSelected.packingAllocation);
            obj.deliveryAllocation = this.renderNameAllocation(this.cacheSelected.deliveryAllocation);
            obj.collectionAllocation = this.renderNameAllocation(this.cacheSelected.collectionAllocation);
          }
          arr.push(obj);
        });
      }
      return arr || [];
    }
  },
  watch: {},

  methods: {
    initSelectFilter() {
      this.initSelect();
      // this.initZoneSearch();
      // this.initWindowSearch();
      this.initSupplierSearch();
    },
    onTableOptionsChanged(pagination) {
      this.pagination = {
        ...this.pagination,
        page: pagination.current,
        limit: pagination.pageSize
      };
      this.initData();
    },
    initData() {
      this.tableLoading = true;
      this.$apollo
        .query({
          query: allUnassignedJobsUnderMasterFranchise,
          variables: {
            userId: this.userInfo.id,
            // delivery_date: this.delivery_date || null,
            td_tenant_id: Number(this.td_tenant_id.value) || null,
            start_delivery_date: this.startDate || null,
            end_delivery_date: this.endDate || null,
            delivery_time_from: this.startTime || null,
            delivery_time_to: this.endTime || null,
            td_invoice_id: this.td_invoice_id ? Number(this.td_invoice_id.trim()) : null,
            zones: (this.zoneId ? this.zoneId.value : this.zone.value) || null,
            vehicle_type: this.vehicle_type.value || null,
            page: this.pagination.page,
            limit: this.pagination.limit
          },
          fetchPolicy: 'no-cache'
        })
        .then((res) => {
          // this.$store.dispatch('setAllJobsManagement', _.get(res, 'data.allJobs', []));
          if (res && res.data && res.data.allUnassignedJobsUnderMasterFranchise) {
            this.dataTable = [];
            this.listVehicleType = [{ value: '', label: 'All Vehicle' }];
            this.listZone = [{ value: '', label: 'All Zone' }];

            res.data.allUnassignedJobsUnderMasterFranchise.items.map((item) => {
              const DeliveryTimeFrom = item.delivery_time_from
                ? new Date(item.delivery_time_from.replace('T', ' ').replace('Z', ''))
                    .toTimeString()
                    .split(' ')[0]
                : '-';
              const DeliveryTimeTo = item.delivery_time_from
                ? new Date(item.delivery_time_to.replace('T', ' ').replace('Z', ''))
                    .toTimeString()
                    .split(' ')[0]
                : '-';
              const deliveryWindow = DeliveryTimeFrom.concat(
                `${item.delivery_time_from ? ' to ' : ' '}`,
                DeliveryTimeTo
              );
              let obj = {
                ...item,
                delivery_time_from: DeliveryTimeFrom,
                delivery_time_to: DeliveryTimeTo,
                delivery_window: deliveryWindow,
                qty: this.calculatorQty(item.TlServices) || '',
                supplier_name: item.tenants.tenant.name || ''
              };
              this.dataTable.push(obj);
            });

            res.data.allUnassignedJobsUnderMasterFranchise.vehicleType.map((vehicle) => {
              let obj = {
                label: vehicle.name || '',
                value: vehicle.name || ''
              };
              this.listVehicleType.push(obj);
            });

            res.data.allUnassignedJobsUnderMasterFranchise.zones.map((zone) => {
              let obj = {
                label: zone.name || '',
                value: zone.name || ''
              };
              this.listZone.push(obj);
            });

            this.pagination.totalItems = res.data.allUnassignedJobsUnderMasterFranchise?.totalItem;
            this.totalOrder = this.dataTable.length;
          }
        })
        .catch((error) => {
          console.log('error ::: ', error);
        })
        .finally(() => {
          this.tableLoading = false;
          this.$q.loading.hide();
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
            let selectOptionsArr = [{ value: '', label: 'Select Primary 3PL' }];
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
          this.initSelectFilter();
        })
        .catch((err) => {
          console.log('err queryMe ::: ', err);
        });
    },
    initWindowSearch() {
      this.$apollo
        .query({
          query: allDistinctCollectionWindowJobsUnderMasterFranchise,
          variables: {
            userId: this.userInfo.id,
            type: 'Unassigned'
          },
          fetchPolicy: 'no-cache'
        })
        .then((res) => {
          if (
            res.data.allDistinctCollectionWindowJobsUnderMasterFranchise &&
            res.data.allDistinctCollectionWindowJobsUnderMasterFranchise.length > 0
          ) {
            this.listWindow = [{ value: '', label: 'All Window' }];
            res.data.allDistinctCollectionWindowJobsUnderMasterFranchise.map((item) => {
              if (item) {
                let obj = {
                  label: item || '',
                  value: item || ''
                };
                // obj.qty = this.calculatorQty(item.TlServices)
                this.listWindow.push(obj);
              }
            });
          } else this.listWindow = [{ value: '', label: 'All Window' }];
        })
        .catch((err) => {
          console.log('err queryMe ::: ', err);
        });
    },
    initSupplierSearch() {
      this.$apollo
        .query({
          query: allDistinctTenantJobsUnderMasterFranchise,
          variables: {
            userId: this.userInfo.id,
            type: 'Unassigned'
          },
          fetchPolicy: 'no-cache'
        })
        .then((res) => {
          if (
            res.data.allDistinctTenantJobsUnderMasterFranchise &&
            res.data.allDistinctTenantJobsUnderMasterFranchise.length > 0
          ) {
            this.listSupplier = [{ value: '', label: 'All Supplier' }];
            res.data.allDistinctTenantJobsUnderMasterFranchise.map((item) => {
              if (item) {
                let obj = {
                  label: item.tenant.name || '',
                  value: item.id || ''
                };
                // obj.qty = this.calculatorQty(item.TlServices)
                this.listSupplier.push(obj);
                // console.log('testdata:::::',obj)
              }
            });
          } else this.listSupplier = [{ value: '', label: 'All Supplier' }];
        })
        .catch((err) => {
          console.log('err queryMe ::: ', err);
        });
    },

    // ====================================================================================
    onSearch(val) {
      console.log(val);
      if (val) {
        this.td_invoice_id = val;
      } else {
        this.td_invoice_id = '';
      }
      this.initData();
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    handleTableChange(pagination) {
      console.log(pagination);
    },
    handleAssignPack() {
      this.isSHowModal = true;
      this.modalTitle = 'Please select the 3PL for packing';
    },

    onChange(startDate, endDate) {
      if (startDate && endDate) {
        this.startDate = startDate;
        this.endDate = endDate;
      } else {
        this.startDate = null;
        this.endDate = null;
      }
      this.initData();
    },

    //  selectVehicle
    selectVehicle(value) {
      if (value) {
        this.vehicle_type = value;
      } else {
        this.vehicle_type = null;
      }
      this.initData();
    },
    //  selectSupplier
    selectSupplier(value) {
      if (value) {
        this.td_tenant_id = value;
      } else {
        this.td_tenant_id = null;
      }
      this.initData();
    },
    //  selectZone
    selectZone(value) {
      if (value) {
        this.zone = value;
      } else {
        this.zone = null;
      }
      // this.reload();
    },
    //  selectWindow

    onChangeTime(startTime, endTime) {
      if (startTime && endTime) {
        this.startTime = convertTimeTo24h(startTime);
        this.endTime = convertTimeTo24h(endTime);
      } else {
        this.startTime = null;
        this.endTime = null;
      }

      this.initData();
    },
    selectZone(value) {
      console.log(value);
      if (value) {
        this.zoneId = value;
      } else {
        this.zoneId = '';
      }
      this.initData();
    },

    resetData() {
      this.selectedRowKeys = [];
      this.td_tenant_id = [{ value: '', label: 'All Supplier' }];
      this.delivery_date = null;
    },
    checkAllocation(item, type) {
      let check = false;
      item.TlServices.map((item2) => {
        if (item2.tl_service_type_id === type) {
          check = true;
          return;
        }
      });
      return check;
    },

    //   new

    onChangeSelectedAll() {
      // if (e.target.checked) {
      //   this.selectedRowKeys = this.dataTable;
      //   let arrSelected = [];
      //   this.selectedRowKeys.map((item) => {
      //     arrSelected.push(item.id)
      //   })
      //   this.$refs.UnAssignedTable.handleSetDataSelectedRowKey(arrSelected);
      // } else {
      this.$refs.UnAssignedTable.handleSetDataSelectedRowKey([]);
      this.selectedRowKeys = [];
      // }
    },
    removeSelectedRowKeys(value) {
      console.log(value);
      this.selectedRowKeys = this.selectedRowKeys.filter((item) => item.id !== value.id);
      let arrSelected = [];
      this.selectedRowKeys.map((item) => {
        arrSelected.push(item);
      });
      this.$refs.UnAssignedTable.handleSetDataSelectedRowKey(arrSelected);
    },

    assignTeam() {
      let listAssignTeam = [];
      if (this.isSignleAssign && this.selectedSingleItem) {
        let obj = {
          id: this.selectedSingleItem.id
        };
        if (this.checkAllocation(this.selectedSingleItem, 3)) {
          obj.type1 = {
            team_id: this.cacheSelected.packingAllocation.value,
            service_type_id: 3
          };
        }
        if (this.checkAllocation(this.selectedSingleItem, 4)) {
          obj.type2 = {
            team_id: this.cacheSelected.deliveryAllocation.value,
            service_type_id: 4
          };
        }
        if (this.checkAllocation(this.selectedSingleItem, 1)) {
          obj.type3 = {
            team_id: this.cacheSelected.collectionAllocation.value,
            service_type_id: 1
          };
        }
        listAssignTeam.push(obj);
      } else {
        this.selectedRowKeys.map((item2) => {
          let obj = {
            id: item2.id
          };
          if (this.checkAllocation(item2, 3)) {
            obj.type1 = {
              team_id: this.cacheSelected.packingAllocation.value,
              service_type_id: 3
            };
          }
          if (this.checkAllocation(item2, 4)) {
            obj.type2 = {
              team_id: this.cacheSelected.deliveryAllocation.value,
              service_type_id: 4
            };
          }
          if (this.checkAllocation(item2, 1)) {
            obj.type3 = {
              team_id: this.cacheSelected.collectionAllocation.value,
              service_type_id: 1
            };
          }
          listAssignTeam.push(obj);
        });
      }
      console.log('listAssignTeam', listAssignTeam);
      if (listAssignTeam.length > 0) this.mutationServices(listAssignTeam);
    },
    async mutationServices(data) {
      await this.$apollo
        .mutate({
          mutation: bulkAssignAllSelectedServices,
          variables: {
            item: data
          }
        })
        .then((res) => {
          if (res && res.data && res.data.bulkAssignAllSelectedServices) {
            this.closeAllModal();
            this.onChangeSelectedAll();
            this.totalOrder = 0;
            this.initData();
          }
        })
        .catch((error) => {
          console.log('error ::: ', error);
        });
      this.$q.notify({
        type: 'positive',
        position: 'top',
        message: `Service orders succesfully assigned.`
      });
    },
    handleEmit(value) {
      if (this.isSignleAssign) {
        this.isShowModalConfirm = true;
      } else {
        this.isShowModalTable = true;
      }

      this.cacheSelected = value;
    },
    // ======== function Cacullator======
    calculatorQty(value) {
      if (!value) return 0;
      let qty = 0;
      value.map((item) => {
        item.TlTasks.map((item2) => {
          qty = qty + item2.quantity;
        });
      });
      return qty;
    },

    //=================

    //=============button function=============
    //if single assign
    singleAssign(value) {
      this.selectedSingleItem = value;
      this.isSignleAssign = true;
      this.isSHowModal = true;
      this.modalTitle = 'Primary 3PL Allocation';
    },
    //if select mutiple assign
    selectedAssign() {
      this.selectedSingleItem = null;
      this.isSignleAssign = false;
      this.modalTitle = 'Primary 3PL Allocation';
      this.isSHowModal = true;
    },

    //===========table modal=============
    handleTableCancel(value) {
      this.isShowModalConfirm = true;
    },
    handleTableOK() {
      this.assignTeam();
    },
    //===========confirm modal=============
    handleConfirmAssign() {
      this.assignTeam();
    },
    closeAllModal() {
      this.isSHowModal = false;
      this.isShowModalTable = false;
      this.isShowModalConfirm = false;
    },

    //   ================
    renderNameAllocation(object) {
      let name = '';
      if (object) {
        let target = this.modalArray.filter((item2) => item2.value === object.value)[0];
        if (target) name = target.label;
      }
      return name;
    }
  }
};
</script>

<style lang="scss" scoped>
.headerTitle {
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 20px;
  letter-spacing: 0.32px;
  padding-bottom: 30px;
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
    margin-left: 10px;
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
    margin-left: 10px;
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
</style>
