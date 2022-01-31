<template>
  <div>
    <div class="row">
      <div class="col-xs-6 col-lg-6">
        <div style="display: flex; width: 100%">
          <p class="assign-text-total">{{ tabTitle }}:</p>
          <div class="tagTotalOrder">
            <span>{{ pagination.totalItems }} Jobs</span>
          </div>
        </div>
      </div>

      <div class="col-xs-6 col-lg-6">
        <div style="width: 100%">
          <div class="btn-create" style="display: flex; justify-content: flex-end">
            <div v-if="selectedRowKeys.length > 0" class="text-remove-selection" @click="removeSelection">
              <span>Remove Selection ({{ selectedRowKeys.length }})</span>
            </div>

            <div v-if="keyTab === '1'">
              <!-- <q-btn
                style="margin-left: 14px"
                :disabled="selectedRowKeys.length === 0"
                no-wrap
                dense
                no-caps
                padding="0.5rem"
                :color="selectedRowKeys.length === 0 ? 'button-fill-disable' : 'button-fill-active'"
              >
                <span>Broadcast</span>
              </q-btn> -->

              <q-btn
                style="margin-left: 14px"
                :disabled="selectedRowKeys.length === 0"
                no-wrap
                dense
                no-caps
                padding="0.5rem"
                :color="selectedRowKeys.length === 0 ? 'button-fill-disable' : 'button-fill-active'"
                @click="assignDriver"
              >
                <span>Assign Collection Driver</span>
              </q-btn>
            </div>

            <q-btn
              v-if="keyTab === '2'"
              style="margin-left: 14px"
              :disabled="selectedRowKeys.length === 0"
              no-wrap
              dense
              no-caps
              padding="0.5rem"
              :color="selectedRowKeys.length === 0 ? 'button-fill-disable' : 'button-fill-active'"
              @click="showModalChangeDiver"
            >
              <span>Change Driver</span>
            </q-btn>
          </div>
        </div>
      </div>
    </div>

    <tableJobs
      :get-data-table="dataRenderTable"
      ref="regCollectionTable"
      :get-pagination="{
        total: pagination.totalItems,
        current: pagination.page,
        pageSize: pagination.limit
      }"
      @onSelectChange="onSelectChange"
      @onTableOptionsChanged="onTableOptionsChanged"
      :tableAssigned="tableAssigned"
    >
      <template v-if="tableLoading" v-slot:loading>
        <div class="spinner-loading">
          <q-spinner color="primary" size="3em" />
        </div>
      </template>

      <template v-slot:top>
        <div class="col-12">
          <div class="row justify-start">
            <div class="col-lg-6 col-xl-4">
              <q-tabs
                v-model="keyTab"
                dense
                no-caps
                class="text-color-tab-no-active"
                active-color="black"
                indicator-color="primary"
                align="justify"
                narrow-indicator
                inline-label
              >
                <q-tab name="1" label="Unassigned" />
                <q-tab name="2" label="Assigned" />
                <q-tab name="3" label="Completed" />
                <q-tab name="4" label="Failed" />
              </q-tabs>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-2 col-sm-2">
          <div class="q-pa-md screen-width-1366-select-search">
            <div style="width: 300px; margin-right: 38px">
              <inputSearch placeholder="Search invoice id" @outputSearch="onSearch" />
            </div>
          </div>
        </div>

        <div class="col-lg-9 col-xs-9">
          <div class="box-filter-search">
            <div class="ml-2 q-pa-md" style="width: 150px">
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

            <div class="ml-2 q-pa-md" style="width: 120px">
              <selectSearch
                :data-props="listVehicleType"
                width="width:120px"
                placeholder="All Vehicle"
                :default-value="vehicle_type"
                @updateData="selectVehicle"
              />
            </div>

            <div class="btn-create ml-2 q-pa-md" style="display: flex; justify-content: flex-end">
              <div style="margin-top: 8px"><span>Collection Date: </span></div>
              <div class="ml-2">
                <datePicker @updateData="onChange"></datePicker>
              </div>
            </div>

            <div
              class="btn-create ml-2 q-pa-md screen-width-1366-range-time"
              style="display: flex; justify-content: flex-end width: 20vw"
            >
              <div style="margin: 8px 0px"><span style="padding-right: 5px"> Window: </span></div>
              <timeRange @updateData="onChangeTime"></timeRange>
            </div>
          </div>
        </div>
        <br />
      </template>
    </tableJobs>

    <modalCommon
      v-model="isShowModalConfirm"
      :modalTitle="'Are you sure?'"
      :bodyStyle="'height: 50px'"
      @cancel="handleCancel"
    >
      <template #content>
        <div class="content">
          <div class="content-select">
            <p>Do you want to quit the process? All asignment will not saved.</p>
            <slot></slot>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="action row justify-end q-pa-lg">
          <div>
            <q-btn no-wrap dense no-caps flat padding="0.5rem" color="dark" @click="handleContinue()">
              <span>No, continue editing</span>
            </q-btn>
          </div>
          <div class="q-ml-md">
            <q-btn no-wrap dense no-caps padding="0.5rem 1rem" color="negative" @click="handleCancel()">
              <span>Yes, cancel</span>
            </q-btn>
          </div>
        </div>
      </template>
    </modalCommon>

    <modalTableSelectedDriver
      v-show="isShowModalTableDriver"
      :list-data="listDriver"
      :show.sync="isShowModalTableDriver"
      @tableOK="handleTableDriverOK"
      @tableCancel="handleTableDriverCancel"
      :list-supplier="listSupplier"
      :titleButtonOk="'Review'"
      ref="modalTableSelectedDriver"
    ></modalTableSelectedDriver>

    <modal-table
      v-show="isShowModalTable"
      ref="modalTable"
      :show.sync="isShowModalTable"
      @tableOK="handleTableOK"
      @tableCancel="handleTableCancel"
      @emitAssign="removeSelectedRowKeys"
      :list-data="dataRenderModalTable"
      :list-supplier="listSupplier"
      :titleButtonOk="'Confirm and Assign'"
    />

    <modal-single-select
      v-show="isShowModalAssign"
      :show.sync="isShowModalAssign"
      title-props="Change Driver"
      :array-props="listDriver"
      :defaultModalUpdate="
        keyTab === '2' && selectedSingleItem
          ? selectedSingleItem.driverUserId
          : { value: '', label: 'All Driver' }
      "
      :titleButtonOk="'Update Driver'"
      @updateData="mutationAssignDriver"
      @handleCancel="handleCancelModalSingleSelect"
      ref="modalSingleSelect"
    />
  </div>
</template>

<script>
import { SITE_CONFIG } from '../../config/site.config';
import singleSelect from '../../components/jobs/main/singleSelect.vue';
import icon_assign_3pl_white from '../../../src/assets/images/icon/icon_assign_3pl_white.png';
import icon_remove_small from '../../../src/assets/images/icon/icon-remove-small.png';
import {
  allUserDriveForTeamPreview,
  bulkAllocateCollectionTasksUnderTeam,
  getAllUnassignedRegJobsUnderMasterFranchise,
  getAllAssignedRegJobsUnderMasterFranchise,
  getAllCompletedRegJobsUnderMasterFranchise,
  getAllFailedRegJobsUnderMasterFranchise
} from '../../api/jobs/index';
import { changeTimeDateString } from '../../utils/function';
import { listWindow } from '../../constants/assign';
import { listStatus } from '../../constants/jobs/index';

export default {
  data() {
    return {
      icon_assign_3pl_white,
      icon_remove_small,
      tableLoading: false,
      SITE_CONFIG: SITE_CONFIG,
      dataTable: [],
      pagination: {
        totalItems: 0,
        page: 1,
        limit: 10
      },
      td_invoice_id: null,
      listSupplier: [{ value: '', label: 'All Supplier' }],
      listDeliverType: [{ value: '', label: 'All Deliver Type' }],
      startDate: '',
      endDate: '',
      startTime: null,
      endTime: null,
      td_tenant_id: { value: '', label: 'All Supplier' },
      listZone: [{ value: '', label: 'All Zone' }],
      zone: { value: '', label: 'All Zone' },
      zoneId: '',
      listWindow: [...listWindow],
      delivery_window: { value: '', label: 'All Window' },
      dateFormat: 'DD/MM/YYYY',
      selectedRowKeys: [], // Check here to configure the default column,
      //   driver
      isShowModalTableDriver: false,
      isShowModalAssign: false,
      listDriver: [{ value: '', label: 'All Driver' }],
      //   table
      isShowModalTable: false,
      //  tab
      keyTab: '1',
      //   cache selected
      cacheSelected: null,
      selectedSingleItem: null,
      deliverType: '',
      tableAssigned: '1',
      driverId: { value: '', label: 'All Driver' },
      defaultStatus: { value: '', label: 'All Status' },
      listStatus: [...listStatus],
      isShowModalConfirm: false,
      tabTitle: 'Unassigned Regular Collection',

      listVehicleType: [{ value: '', label: 'All Vehicle' }],
      vehicle_type: { value: '', label: 'All Vehicle' }
    };
  },
  components: {
    singleSelect,
    selectSearch: () => import('src/components/jobs/main/selectSearch'),
    tableJobs: () => import('../../components/jobs/table/tableRegCollection.vue'),
    modalTableSelectedDriver: () => import('../../components/jobs/collection/modalTableSelectedDriver.vue'),
    modalTable: () => import('../../components/jobs/collection/modalTable.vue'),
    ModalSingleSelect: () => import('../../components/jobs/modal/modalSingleSelect.vue'),
    inputSearch: () => import('src/components/share/Search.vue'),
    datePicker: () => import('src/components/jobs/main/datePicker.vue'),
    timeRange: () => import('src/components/jobs/main/timeRange.vue')
  },
  watch: {
    keyTab(val) {
      this.removeSelection();
      this.callback(val);
      this.tableAssigned = val;
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
            obj.driverUserName = this.renderNameDriver(this.cacheSelected);
            obj.driverUserId = this.cacheSelected;
          }
          arr.push(obj);
        });
      }
      return arr || [];
    },
    dataRenderTable() {
      let arr = [];
      if (this.dataTable) {
        this.dataTable.map((item) => {
          let obj = {
            ...item
          };

          arr.push(obj);
        });
      }
      if (this.td_invoice_id) {
        arr = arr.filter((item) => {
          if (item.td_invoice_id.toString().toLowerCase().includes(this.td_invoice_id)) {
            return item;
          }

          if (
            item.receipient?.toString()?.toLowerCase()?.includes(this.td_invoice_id.toLowerCase()) ||
            false
          ) {
            return item;
          }
        });
      }
      return arr || [];
    }
  },
  created() {
    this.$q.loading.show();
    this.initData();
    this.initListDriver();
  },
  methods: {
    selectDeliverType(value) {
      if (value) {
        this.deliverType = value;
      } else {
        this.deliverType = '';
      }
      this.reload();
    },
    handleContinue() {
      this.isShowModalConfirm = false;
      this.isShowModalTable = true;
    },
    handleCancel() {
      this.isShowModalTableDriver = false;
      this.isShowModalConfirm = false;
      this.removeSelection();
    },
    async reload() {
      if (this.keyTab === '1') {
        this.tabTitle = 'Unassigned Regular Collection';
        await this.initData();
      }
      if (this.keyTab === '2') {
        this.tabTitle = 'Assigned Regular Collection';
        await this.initDataAssigned();
      }
      if (this.keyTab === '3') {
        this.tabTitle = 'Completed Regular Collection';
        await this.initDataCompleted();
      }
      if (this.keyTab === '4') {
        this.tabTitle = 'Failed Regular Collection';
        await this.initDataFailed();
      }
    },
    selectStatus(value) {
      if (value) {
        this.defaultStatus = value;
      } else {
        this.defaultStatus = '';
      }
      this.reload();
    },
    onTableOptionsChanged(pagination) {
      this.pagination = {
        ...this.pagination,
        page: pagination.current,
        limit: pagination.pageSize
      };
      this.reload();
    },
    getRecipient(value) {
      return value?.invoices?.OrderItem[0]?.customer?.name;
    },
    initData() {
      this.tableLoading = true;
      this.$apollo
        .query({
          query: getAllUnassignedRegJobsUnderMasterFranchise,
          variables: {
            td_tenant_id: Number(this.td_tenant_id.value) || null,
            start_collection_date: this.startDate || null,
            end_collection_date: this.endDate || null,
            collection_time_from: this.collection_time_from || null,
            collection_time_to: this.collection_time_to || null,
            vehicle_type: this.vehicle_type.value || null,
            td_invoice_id: null,
            zones: (this.zoneId ? this.zoneId.value : this.zone.value) || null,
            b2b_delivery: false,
            tl_service_task_type_id: 1,
            page: this.pagination.page,
            limit: this.pagination.limit
          },
          fetchPolicy: 'no-cache'
        })
        .then((res) => {
          // this.$store.dispatch('setAllJobsManagement', _.get(res, 'data.allJobs', []));
          if (res && res.data && res.data.getAllUnassignedRegJobsUnderMasterFranchise) {
            this.dataTable = [];
            this.listVehicleType = [{ value: '', label: 'All Vehicle' }];
            this.listZone = [{ value: '', label: 'All Zone' }];

            res.data.getAllUnassignedRegJobsUnderMasterFranchise.items.map((item) => {
              const collectionTimeFrom = item.collection_time_from
                ? new Date(item.collection_time_to.replace('T', ' ').replace('Z', ''))
                    .toTimeString()
                    .split(' ')[0]
                : '-';
              const collectionTimeTo = item.delivery_time_from
                ? new Date(item.delivery_time_to.replace('T', ' ').replace('Z', ''))
                    .toTimeString()
                    .split(' ')[0]
                : '-';
              const collectionWindow = collectionTimeFrom.concat(
                `${item.collection_time_from ? ' to ' : ' '}`,
                collectionTimeTo
              );
              let obj = {
                ...item,
                collection_time_from: collectionTimeFrom,
                collection_time_to: collectionTimeTo,
                key: item.id,
                invoice_id: item.invoices.id,
                supplier: item.tenants.tenant.name,
                receipient: this.getRecipient(item) || '',
                total_items: this.calculatorQty(item.TlServices) || '',
                vehicle: item.vehicle_requirement,
                date: changeTimeDateString(item.collection_date),
                window: collectionWindow,
                location: item.collection_location,
                zone: item.zones
              };
              this.dataTable.push(obj);
            });

            res.data.getAllUnassignedRegJobsUnderMasterFranchise.vehicleType.map((vehicle) => {
              let obj = {
                label: vehicle.name || '',
                value: vehicle.name || ''
              };
              this.listVehicleType.push(obj);
            });

            res.data.getAllUnassignedRegJobsUnderMasterFranchise.zones.map((zone) => {
              let obj = {
                label: zone.name || '',
                value: zone.name || ''
              };
              this.listZone.push(obj);
            });

            this.pagination.totalItems = res.data.getAllUnassignedRegJobsUnderMasterFranchise.totalItem;
            this.initSupplierSearch(res.data.getAllUnassignedRegJobsUnderMasterFranchise.tenants);
          }
        })
        .catch((error) => {
          console.log('error ::: ', error);
        })
        .finally(() => {
          this.$q.loading.hide();
          this.tableLoading = false;
        });
    },
    initDataAssigned() {
      this.tableLoading = true;
      this.$apollo
        .query({
          query: getAllAssignedRegJobsUnderMasterFranchise,
          variables: {
            td_tenant_id: Number(this.td_tenant_id.value) || null,
            collection_time_from: this.collection_time_from || null,
            collection_time_to: this.collection_time_to || null,
            start_delivery_date: this.startDate || null,
            end_delivery_date: this.endDate || null,
            vehicle_type: this.vehicle_type.value || null,
            td_invoice_id: null,
            zones: (this.zoneId ? this.zoneId.value : this.zone.value) || null,
            b2b_delivery: false,
            tl_service_task_type_id: 1,
            page: this.pagination.page,
            limit: this.pagination.limit
          },
          fetchPolicy: 'no-cache'
        })
        .then((res) => {
          // this.$store.dispatch('setAllJobsManagement', _.get(res, 'data.allJobs', []));
          if (res && res.data && res.data.getAllAssignedRegJobsUnderMasterFranchise) {
            this.dataTable = [];
            this.listVehicleType = [{ value: '', label: 'All Vehicle' }];
            this.listZone = [{ value: '', label: 'All Zone' }];

            res.data.getAllAssignedRegJobsUnderMasterFranchise.items.map((item) => {
              let obj = {
                ...item,
                key: item.id,
                invoice_id: item.invoices.id,
                supplier: item.tenants.tenant.name,
                receipient: this.getRecipient(item) || '',
                total_items: this.calculatorQty(item.TlServices) || '',
                vehicle: item.vehicle_requirement,
                date: changeTimeDateString(item.collection_date),
                window: item.collection_window,
                location: item.collection_location,
                zone: item.zones,
                driverUserName:
                  item?.TlTasks[0]?.TlUsers.first_name + ' ' + item?.TlTasks[0]?.TlUsers.last_name
              };
              this.dataTable.push(obj);
            });

            res.data.getAllAssignedRegJobsUnderMasterFranchise.vehicleType.map((vehicle) => {
              let obj = {
                label: vehicle.name || '',
                value: vehicle.name || ''
              };
              this.listVehicleType.push(obj);
            });

            res.data.getAllAssignedRegJobsUnderMasterFranchise.zones.map((zone) => {
              let obj = {
                label: zone.name || '',
                value: zone.name || ''
              };
              this.listZone.push(obj);
            });

            this.pagination.totalItems = res.data.getAllAssignedRegJobsUnderMasterFranchise.totalItem;
            this.initSupplierSearch(res.data.getAllAssignedRegJobsUnderMasterFranchise.tenants);
          }
        })
        .catch((error) => {
          console.log('error ::: ', error);
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    initDataCompleted() {
      this.tableLoading = true;
      this.$apollo
        .query({
          query: getAllCompletedRegJobsUnderMasterFranchise,
          variables: {
            td_tenant_id: Number(this.td_tenant_id.value) || null,
            collection_time_from: this.collection_time_from || null,
            collection_time_to: this.collection_time_to || null,
            start_delivery_date: this.startDate || null,
            end_delivery_date: this.endDate || null,
            vehicle_type: this.vehicle_type.value || null,
            td_invoice_id: null,
            zones: (this.zoneId ? this.zoneId.value : this.zone.value) || null,
            b2b_delivery: false,
            tl_service_task_type_id: 1,
            page: this.pagination.page,
            limit: this.pagination.limit
          },
          fetchPolicy: 'no-cache'
        })
        .then((res) => {
          // this.$store.dispatch('setAllJobsManagement', _.get(res, 'data.allJobs', []));
          if (res && res.data && res.data.getAllCompletedRegJobsUnderMasterFranchise) {
            this.dataTable = [];
            this.listVehicleType = [{ value: '', label: 'All Vehicle' }];
            this.listZone = [{ value: '', label: 'All Zone' }];

            res.data.getAllCompletedRegJobsUnderMasterFranchise.items.map((item) => {
              let obj = {
                ...item,
                key: item.id,
                invoice_id: item.invoices.id,
                supplier: item.tenants.tenant.name,
                receipient: this.getRecipient(item) || '',
                total_items: this.calculatorQty(item.TlServices) || '',
                vehicle: item.vehicle_requirement,
                date: changeTimeDateString(item.collection_date),
                window: item.collection_window,
                location: item.collection_location,
                zone: item.zones,
                driverUserName:
                  item?.TlTasks[0]?.TlUsers.first_name + ' ' + item?.TlTasks[0]?.TlUsers.last_name
              };
              this.dataTable.push(obj);
            });

            res.data.getAllCompletedRegJobsUnderMasterFranchise.vehicleType.map((vehicle) => {
              let obj = {
                label: vehicle.name || '',
                value: vehicle.name || ''
              };
              this.listVehicleType.push(obj);
            });

            res.data.getAllCompletedRegJobsUnderMasterFranchise.zones.map((zone) => {
              let obj = {
                label: zone.name || '',
                value: zone.name || ''
              };
              this.listZone.push(obj);
            });

            this.pagination.totalItems = res.data.getAllCompletedRegJobsUnderMasterFranchise.totalItem;
            this.initSupplierSearch(res.data.getAllCompletedRegJobsUnderMasterFranchise.tenants);
          }
        })
        .catch((error) => {
          console.log('error ::: ', error);
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    initDataFailed() {
      this.tableLoading = true;
      this.$apollo
        .query({
          query: getAllFailedRegJobsUnderMasterFranchise,
          variables: {
            td_tenant_id: Number(this.td_tenant_id.value) || null,
            collection_time_from: this.collection_time_from || null,
            collection_time_to: this.collection_time_to || null,
            start_delivery_date: this.startDate || null,
            end_delivery_date: this.endDate || null,
            vehicle_type: this.vehicle_type.value || null,
            td_invoice_id: null,
            zones: (this.zoneId ? this.zoneId.value : this.zone.value) || null,
            b2b_delivery: false,
            tl_service_task_type_id: 1,
            page: this.pagination.page,
            limit: this.pagination.limit
          },
          fetchPolicy: 'no-cache'
        })
        .then((res) => {
          // this.$store.dispatch('setAllJobsManagement', _.get(res, 'data.allJobs', []));
          if (res && res.data && res.data.getAllFailedRegJobsUnderMasterFranchise) {
            this.dataTable = [];
            this.listVehicleType = [{ value: '', label: 'All Vehicle' }];
            this.listZone = [{ value: '', label: 'All Zone' }];

            res.data.getAllFailedRegJobsUnderMasterFranchise.items.map((item) => {
              let obj = {
                ...item,
                key: item.id,
                invoice_id: item.invoices.id,
                supplier: item.tenants.tenant.name,
                receipient: this.getRecipient(item) || '',
                total_items: this.calculatorQty(item.TlServices) || '',
                vehicle: item.vehicle_requirement,
                date: changeTimeDateString(item.collection_date),
                window: item.collection_window,
                location: item.collection_location,
                zone: item.zones,
                driverUserName:
                  item?.TlTasks[0]?.TlUsers.first_name + ' ' + item?.TlTasks[0]?.TlUsers.last_name
              };
              this.dataTable.push(obj);
            });

            res.data.getAllFailedRegJobsUnderMasterFranchise.vehicleType.map((vehicle) => {
              let obj = {
                label: vehicle.name || '',
                value: vehicle.name || ''
              };
              this.listVehicleType.push(obj);
            });

            res.data.allCompleteJobsUnderMasterFranchise.zones.map((zone) => {
              let obj = {
                label: zone.name || '',
                value: zone.name || ''
              };
              this.listZone.push(obj);
            });

            this.pagination.totalItems = res.data.getAllFailedRegJobsUnderMasterFranchise.totalItem;
            this.initSupplierSearch(res.data.getAllFailedRegJobsUnderMasterFranchise.tenants);
          }
        })
        .catch((error) => {
          console.log('error ::: ', error);
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },

    initSupplierSearch(tenants) {
      if (tenants) {
        tenants.map((item) => {
          let obj = {
            label: item?.tenant?.name || '',
            value: item.id || ''
          };
          this.listSupplier.push(obj);
        });
      }
    },
    initListDriver() {
      this.$apollo
        .query({
          query: allUserDriveForTeamPreview,
          fetchPolicy: 'no-cache'
        })
        .then((res) => {
          if (res.data.allUserDriveForTeamPreview && res.data.allUserDriveForTeamPreview.length > 0) {
            this.listDriver = [{ value: '', label: 'All Driver' }];
            res.data.allUserDriveForTeamPreview.map((item) => {
              let obj = {
                ...item,
                label: item.first_name + ' ' + item.last_name || '',
                value: item.id || '',
                totalAssignedZone: item.dataZone.length || 0,
                totalAssignedPoints: this.calculatorCount(item.dataZone, 'countPoint'),
                totalAssignedInvoice: this.calculatorCount(item.dataZone, 'countInvoice')
              };
              this.listDriver.push(obj);
            });
          } else this.listDriver = [{ value: '', label: 'All Driver' }];
        })
        .catch((err) => {
          console.log('err queryMe ::: ', err);
        });
    },

    async callback(key) {
      await this.resetData();
      // this.keyTab = key;
      await this.reload();
    },
    onSearch(val) {
      if (val) {
        this.td_invoice_id = val;
      } else {
        this.td_invoice_id = '';
      }
      //   this.initData()
    },
    //  selectZone
    selectZone(value) {
      if (value) {
        this.zone = value;
      } else {
        this.zone = null;
      }
      this.reload();
    },
    selectSupplier(value) {
      if (value) {
        this.td_tenant_id = value;
      } else {
        this.td_tenant_id = '';
      }
      this.reload();
    },
    selectWindow(value) {
      if (value) {
        this.delivery_window = value;
      } else {
        this.delivery_window = '';
      }
      this.reload();
    },
    onChange(startDate, endDate) {
      if (startDate && endDate) {
        this.startDate = startDate;
        this.endDate = endDate;
      } else {
        this.startDate = null;
        this.endDate = null;
      }
      this.reload();
    },
    onChangeTime(startTime, endTime) {
      if (startTime && endTime) {
        this.collection_time_from = convertTimeTo24h(startTime);
        this.collection_time_to = convertTimeTo24h(endTime);
      } else {
        this.startTime = null;
        this.endTime = null;
      }

      this.reload();
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
    calculatorCount(array, key) {
      let count = 0;
      array.map((item) => {
        count += item[key];
      });
      return count;
    },

    //=================
    onSelectChange(val) {
      this.selectedRowKeys = [...val];
    },
    removeSelection() {
      this.selectedRowKeys = [];
      this.$refs.regCollectionTable.handleSetDataSelectedRowKey([]);
    },
    //===========table modal driver=============
    handleTableDriverCancel() {
      this.isShowModalTableDriver = false;
      this.removeSelection();
    },
    handleTableDriverOK(value) {
      this.cacheSelected = value;
      this.isShowModalTable = true;
      // this.assignTeam()
    },
    removeSelectedRowKeys(value) {
      this.selectedRowKeys = this.selectedRowKeys.filter((item) => item.id !== value.id);
      let arrSelected = [];
      this.selectedRowKeys.map((item) => {
        arrSelected.push(item);
      });
      this.$refs.regCollectionTable.handleSetDataSelectedRowKey(arrSelected);
    },
    assignDriver() {
      this.isShowModalTableDriver = true;
    },
    showModalChangeDiver() {
      this.isShowModalAssign = true;
    },
    //  selectVehicle
    selectVehicle(value) {
      if (value) {
        this.vehicle_type = value;
      } else {
        this.vehicle_type = null;
      }
      this.reload();
    },
    //  ======= modal table====
    handleTableOK(value) {
      this.assignTeam(this.dataRenderModalTable);
    },
    handleTableCancel() {
      this.isShowModalConfirm = true;
    },
    //  ======= assigned====
    async mutationAssignDriver(driverUserId) {
      let payloadArray = [];
      this.selectedRowKeys.map((item) => {
        payloadArray.push({
          tl_job_id: item.id,
          tl_user_id: driverUserId.value
        });
      });
      try {
        await this.mutationDriverCollection(payloadArray);
        await this.$refs.modalSingleSelect.handleCancel();
      } catch (e) {
        console.log(e);
      } finally {
        this.triggerPositive();
      }
    },
    triggerPositive() {
      this.$q.notify({
        type: 'positive',
        position: 'top',
        message: `Assign Collection Successful`
      });
    },
    async assignTeam(value) {
      let payloadArray = [];
      value.map((item) => {
        payloadArray.push({
          tl_job_id: item.id,
          tl_user_id: item.driverUserId
        });
      });
      try {
        await this.mutationDriverCollection(payloadArray);
        await this.$refs.modalTableSelectedDriver.handleBack();
        await this.$refs.modalTable.handleBack();

        // await this.handleCancelModalSingleSelect()
      } catch (e) {
        console.log(e);
      } finally {
        this.triggerPositive();
      }
    },
    mutationDriverCollection(data) {
      this.$apollo
        .mutate({
          mutation: bulkAllocateCollectionTasksUnderTeam,
          variables: {
            items: data
          }
        })
        .then((res) => {
          if (res && res.data && res.data.bulkAllocateCollectionTasksUnderTeam) {
            this.removeSelection();
            this.reload();
          }
        })
        .catch((error) => {
          console.log('error ::: ', error);
        })
        .finally(() => {
          this.keyTab = '2';
        });
    },
    renderNameDriver(id) {
      return this.listDriver.find((item) => item.value === id).label || '';
    },
    //reset
    resetData() {
      this.selectedRowKeys = [];
      this.td_tenant_id = { value: '', label: 'All Supplier' };
      this.driverId = { value: '', label: 'All Driver' };
      this.delivery_window = { value: '', label: 'All Window' };
      this.defaultStatus = { value: '', label: 'All Status' };
      this.listSupplier = [{ value: '', label: 'All Supplier' }];
      this.listVehicleType = [{ value: '', label: 'All Vehicle' }];
      this.vehicle_type = { value: '', label: 'All Vehicle' };
      this.td_invoice_id = null;
      this.startDate = null;
      this.endDate = null;
      this.collection_time_from = null;
      this.collection_time_to = null;
      this.selectedSingleItem = null;
      this.pagination = {
        totalItems: 0,
        page: 1,
        limit: 10
      };
    },
    handleCancelModalSingleSelect() {
      this.selectedSingleItem = null;
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

.text-remove-selection {
  padding-top: 8px;
  cursor: pointer;

  span {
    font-size: 14px;
    line-height: 20px;
    color: #04565a;
  }
}
</style>
<style lang="scss">
.select {
  width: 150px;
  margin-top: 15px;
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
</style>
