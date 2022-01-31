<template>
  <div>
    <div class="row">
      <div class="col-xs-6 col-lg-6">
        <div style="display: flex; width: 100%">
          <p v-if="keyTab === '1'" class="assign-text-total">Unassigned Regular Deliveries:</p>
          <p v-if="keyTab === '2'" class="assign-text-total">Assigned Regular Deliveries:</p>
          <p v-if="keyTab === '3'" class="assign-text-total">Completed Regular Deliveries:</p>
          <p v-if="keyTab === '4'" class="assign-text-total">Failed Regular Deliveries:</p>

          <div class="tagTotalOrder">
            <span>{{ pagination.totalItems }} Jobs</span>
          </div>
        </div>
      </div>

      <div class="col-xs-6 col-lg-6">
        <div class="btn-create" style="display: flex; justify-content: flex-end">
          <div v-if="selectedRowKeys.length > 0" class="text-remove-selection" @click="removeSelection">
            <span>Remove Selection ({{ selectedRowKeys.length }})</span>
          </div>

          <template v-if="keyTab === '1'">
            <q-btn
              style="margin-left: 14px"
              :disabled="selectedRowKeys.length === 0"
              no-wrap
              dense
              no-caps
              padding="0.5rem"
              @click="showModalBackToBack"
              :color="selectedRowKeys.length === 0 ? 'button-fill-disable' : 'button-fill-active'"
            >
              <span>Back to Back</span>
            </q-btn>

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
              @click="showModalAssign"
            >
              <span>Assign Delivery Driver</span>
            </q-btn>
          </template>

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

    <!-- ======================tabel -->
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

        <div class="col-lg-3 col-xs-3">
          <div class="q-pa-md" style="width: 300px; margin-right: 38px">
            <inputSearch placeholder="Search invoice id" @outputSearch="onSearch" />
          </div>
        </div>

        <div class="col-lg-9 col-xs-9">
          <div class="box-filter-search">
            <div class="ml-2 q-pa-md" style="width: 150px">
              <selectSearch
                :data-props="listDriver"
                width="width:150px"
                :default-value="driverId"
                @updateData="selectDriver"
                placeholder="All Driver"
              />
            </div>

            <div class="ml-2 q-pa-md" style="width: 150px">
              <selectSearch
                :data-props="listZone"
                width="width:150px"
                placeholder="All Zone"
                :default-value="zone"
                @updateData="selectZone"
              />
            </div>

            <div class="ml-2 q-pa-md" style="width: 150px">
              <selectSearch
                :data-props="listSupplier"
                width="width:150px"
                :default-value="td_tenant_id"
                @updateData="selectSupplier"
                placeholder="All Supplier"
              />
            </div>

            <div class="ml-2 q-pa-md" style="width: 150px">
              <selectSearch
                :data-props="listVehicleType"
                width="width:150px"
                placeholder="All Vehicle"
                :default-value="vehicle_type"
                @updateData="selectVehicle"
              />
            </div>

            <div class="screen-width-max-1366-active q-pa-md" style="display: flex">
              <div style="display: flex; justify-content: flex-end">
                <div style="margin-top: 8px"><span>Delivery Date: </span></div>
                <div class="ml-2">
                  <datePicker @updateData="onChange"></datePicker>
                </div>
              </div>

              <div style="display: flex; justify-content: flex-end; width: 17vw">
                <div style="margin: 8px 0px"><span style="padding-right: 5px"> Window: </span></div>
                <timeRange @updateData="onChangeTime"></timeRange>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-12 col-xs-12 screen-width-max-1366-off" style="height: 60px">
          <div class="box-filter-search">
            <div class="btn-create ml-2 q-pa-md" style="display: flex; justify-content: flex-end">
              <div style="margin-top: 8px"><span>Delivery Date: </span></div>
              <div class="ml-2">
                <datePicker @updateData="onChange"></datePicker>
              </div>
            </div>

            <div
              class="btn-create ml-2 q-pa-md"
              style="display: flex; justify-content: flex-end; width: 20vw"
            >
              <div style="margin: 8px 0px"><span style="padding-right: 5px"> Window: </span></div>
              <timeRange @updateData="onChangeTime"></timeRange>
            </div>
          </div>
        </div>
        <br />
      </template>
    </tableJobs>

    <modalGMap
      v-show="isSHowModalGMap"
      :show.sync="isSHowModalGMap"
      :default-market="defaultMarket"
      :default-paths="geofenceZones"
      :drivers="listDriver"
      :driver-user-id="driverUserId"
      @mutationAllDriver="mutationAllDriver"
      @tableCancel="closeMapModal"
      ref="modalGMap"
    ></modalGMap>

    <modal-confirm
      v-show="isShowModalRegular"
      :show.sync="isShowModalRegular"
      title-props="Are you sure?"
      :textProps="
        isBackToBack ? 'Change selected invoices from Regular Orders to Back-To-Back Orders?' : textProps
      "
      :singleAssign="isBackToBack"
      :titleBtnActiveSingleAssign="titleBtnActiveSingleAssign"
      :bodyStyle="'height: 8vh'"
      @modalConfirmAssign="keyTab == '2' ? mutationAssignDriver(changedDriver, '') : mutationRemove()"
      @modalConfirmCancel="closeAll"
    />

    <modal-single-select
      v-show="isShowModalAssign"
      :show.sync="isShowModalAssign"
      title-button-ok="Send Assignment"
      title-props="Change Driver?"
      :array-props="listDriver"
      :defaultModalUpdate="defaultDriver"
      @updateData="(e) => showModalConfirm(e)"
      @handleCancel="handleCancelModalSingleSelect"
      ref="modalSingleSelect"
    />
    <!-- @updateData="(e) => mutationAssignDriver(e, '')" -->
  </div>
</template>

<script>
import { SITE_CONFIG } from '../../config/site.config';
import singleSelect from '../../components/jobs/main/singleSelect.vue';
import icon_assign_3pl_white from '../../../src/assets/images/icon/icon_assign_3pl_white.png';
import icon_remove_small from '../../../src/assets/images/icon/icon-remove-small.png';
import {
  allUserDriveForTeamPreview,
  bulkAllocateDeliveryTasksUnderTeam,
  getAllUnassignedRegJobsUnderMasterFranchise,
  getAllAssignedRegJobsUnderMasterFranchise,
  changeB2bDeliveryJobToBackToBack,
  getAllCompletedRegJobsUnderMasterFranchise,
  getAllFailedRegJobsUnderMasterFranchise
} from '../../api/jobs/index';
import { changeTimeStamp, changeTimeDateString } from '../../utils/function';
import { listWindow } from '../../constants/assign';
import { listStatus } from '../../constants/jobs/index';
import { convertTimeTo24h } from 'src/utils/function';

export default {
  name: 'RegDeliveries',
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
      startDate: '',
      endDate: '',
      startTime: null,
      endTime: null,
      td_tenant_id: { value: '', label: 'All Supplier' },
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
      cacheSelected: null,
      selectedSingleItem: null,
      listZone: [{ value: '', label: 'All Zone' }],
      zone: { value: '', label: 'All Zone' },
      // tab
      keyTab: '1',
      //
      isSHowModalGMap: false,

      isShowModalRegular: false,
      //  map
      geofenceZones: null,
      defaultMarket: [],
      driverUserId: { value: '', label: 'All Driver' },
      tableAssigned: '1',
      driverId: { value: '', label: 'All Driver' },
      listStatus: [...listStatus],
      defaultStatus: { value: '', label: 'All Status' },
      isBackToBack: false,
      defaultDriver: { value: '', label: 'All Driver' },
      changedDriver: null,
      textProps: 'Do you want to quit the process? All assignment will not be saved.',
      titleBtnActiveSingleAssign: 'Yes, Proceed',

      listVehicleType: [{ value: '', label: 'All Vehicle' }],
      vehicle_type: { value: '', label: 'All Vehicle' }
    };
  },
  watch: {
    keyTab(val) {
      this.removeSelection();
      this.callback(val);
      this.tableAssigned = val;
    }
  },
  components: {
    singleSelect,
    selectSearch: () => import('../../components/jobs/main/selectSearch'),
    tableJobs: () => import('../../components/jobs/table/tableRegCollection.vue'),
    modalConfirm: () => import('../../components/jobs/main/modalConfirm.vue'),
    modalGMap: () => import('../../components/jobs/modal/modalGMap.vue'),
    ModalSingleSelect: () => import('../../components/jobs/modal/modalSingleSelect.vue'),
    inputSearch: () => import('src/components/share/Search.vue'),
    datePicker: () => import('src/components/jobs/main/datePicker.vue'),
    timeRange: () => import('src/components/jobs/main/timeRange.vue')
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
        });
      }
      return arr || [];
    }
  },
  async created() {
    this.$q.loading.show();
    await this.initData();
    await this.initListDriver();
  },
  methods: {
    async reload() {
      if (this.keyTab === '1') {
        await this.initData();
      }
      if (this.keyTab === '2') {
        await this.initDataAssigned();
      }
      if (this.keyTab === '3') {
        await this.initDataCompleted();
      }
      if (this.keyTab === '4') {
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
    selectDriver(value) {
      if (value) {
        this.driverId = value;
      } else {
        this.driverId = '';
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
            start_delivery_date: this.startDate || null,
            vehicle_type: this.vehicle_type.value || null,
            end_delivery_date: this.endDate || null,
            delivery_time_from: this.startTime || null,
            delivery_time_to: this.endTime || null,
            td_invoice_id: null,
            zones: (this.zoneId ? this.zoneId.value : this.zone.value) || null,
            b2b_delivery: false,
            tl_service_task_type_id: 6,
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
                key: item.id,
                invoice_id: item.invoices.id,
                receipient: this.getRecipient(item) || '',
                supplier: item.tenants.tenant.name,
                total_items: this.calculatorQty(item.TlServices) || '',
                vehicle: item.vehicle_requirement,
                date: changeTimeStamp(item.delivery_date),
                window: deliveryWindow,
                location: item.delivery_address,
                zone: item.zones,
                latlngInvoices: item.invoices.latlng,
                driverUserId: { value: '', label: 'All Driver' }
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
            this.geofenceZones = res.data.getAllUnassignedRegJobsUnderMasterFranchise?.geofenceZones;
            this.initSupplierSearch(res.data.getAllUnassignedRegJobsUnderMasterFranchise.tenants);
            this.$q.loading.hide();
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
            delivery_time_from: this.startTime || null,
            delivery_time_to: this.endTime || null,
            start_delivery_date: this.startDate || null,
            vehicle_type: this.vehicle_type.value || null,
            end_delivery_date: this.endDate || null,
            td_invoice_id: null,
            zones: (this.zoneId ? this.zoneId.value : this.zone.value) || null,
            b2b_delivery: false,
            tl_service_task_type_id: 6,
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
                total_items: this.calculatorQty(item.TlServices) || '',
                vehicle: item.vehicle_requirement,
                date: changeTimeDateString(item.delivery_date),
                window: item.collection_window,
                location: item.collection_location,
                zone: item.zones,
                driverUserName:
                  item?.TlTasks[0]?.TlUsers.first_name + ' ' + item?.TlTasks[0]?.TlUsers.last_name,
                latlngInvoices: item.invoices.latlng
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
            this.geofenceZones = res.data.getAllAssignedRegJobsUnderMasterFranchise?.geofenceZones;
            this.initSupplierSearch(res.data.getAllAssignedRegJobsUnderMasterFranchise.tenants);
          }
        })
        .catch((error) => {
          console.log('error ::: ', error);
        })
        .finally(() => (this.tableLoading = false));
    },
    initDataCompleted() {
      this.tableLoading = true;
      this.$apollo
        .query({
          query: getAllCompletedRegJobsUnderMasterFranchise,
          variables: {
            td_tenant_id: Number(this.td_tenant_id.value) || null,
            delivery_time_from: this.startTime || null,
            delivery_time_to: this.endTime || null,
            vehicle_type: this.vehicle_type.value || null,
            start_delivery_date: this.startDate || null,
            end_delivery_date: this.endDate || null,
            td_invoice_id: null,
            zones: (this.zoneId ? this.zoneId.value : this.zone.value) || null,
            b2b_delivery: false,
            tl_service_task_type_id: 6,
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
                total_items: this.calculatorQty(item.TlServices) || '',
                vehicle: item.vehicle_requirement,
                date: changeTimeDateString(item.delivery_date),
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
        .finally(() => (this.tableLoading = false));
    },
    initDataFailed() {
      this.tableLoading = true;
      this.$apollo
        .query({
          query: getAllFailedRegJobsUnderMasterFranchise,
          variables: {
            td_tenant_id: Number(this.td_tenant_id.value) || null,
            delivery_time_from: this.startTime || null,
            delivery_time_to: this.endTime || null,
            vehicle_type: this.vehicle_type.value || null,
            start_delivery_date: this.startDate || null,
            end_delivery_date: this.endDate || null,
            td_invoice_id: null,
            zones: (this.zoneId ? this.zoneId.value : this.zone.value) || null,
            b2b_delivery: false,
            tl_service_task_type_id: 6,
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
                total_items: this.calculatorQty(item.TlServices) || '',
                vehicle: item.vehicle_requirement,
                date: changeTimeDateString(item.delivery_date),
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

            res.data.getAllFailedRegJobsUnderMasterFranchise.zones.map((zone) => {
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
        .finally(() => (this.tableLoading = false));
    },

    initSupplierSearch(array) {
      if (array) {
        this.listSupplier = [{ value: '', label: 'All Supplier' }];
        array.map((item) => {
          let obj = {
            label: item?.tenant?.name || '',
            value: item.id || ''
          };
          this.listSupplier.push(obj);
        });
      } else this.listSupplier = [{ value: '', label: 'All Supplier' }];
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
      this.keyTab = key;
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

    onChangeTime(startTime, endTime) {
      if (startTime && endTime) {
        this.startTime = convertTimeTo24h(startTime);
        this.endTime = convertTimeTo24h(endTime);
      } else {
        this.startTime = null;
        this.endTime = null;
      }

      this.reload();
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
      this.isShowModalConfirm = false;
    },
    showModalConfirm(e) {
      this.changedDriver = e;
      this.textProps = 'You will be update ther driver for this item. Procced?';
      this.titleBtnActiveSingleAssign = 'Yes, Update Driver';
      this.isBackToBack = true;
      this.isShowModalAssign = false;

      this.isShowModalRegular = true;
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
      this.mutationAllDriver(this.dataRenderModalTable);
    },
    handleTableCancel() {
      this.isShowModalTable = false;
    },

    //  ======= mutationAllDriver====
    async mutationAssignDriver(driverUserId) {
      let payloadArray = [];
      this.selectedRowKeys.map((item) => {
        payloadArray.push({
          tl_job_id: item.id,
          tl_user_id: driverUserId.value
        });
      });
      try {
        await this.mutationDriverDelivery(payloadArray);
        await this.$refs.modalSingleSelect.handleCancel();
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    async mutationAllDriver(value) {
      let payloadArray = [];
      value.map((item) => {
        payloadArray.push({
          tl_job_id: item.id,
          tl_user_id: item.driverUserId.id
        });
      });
      await this.$refs.modalGMap.setLoading(true);
      try {
        await this.mutationDriverDelivery(payloadArray);
        await this.$refs.modalGMap.handleBack();
        this.closeAll();
        await this.handleCancelModalSingleSelect();
      } catch (e) {
        console.log(e);
      } finally {
        await this.$refs.modalGMap.setLoading(false);
      }
    },
    mutationDriverDelivery(data) {
      this.$apollo
        .mutate({
          mutation: bulkAllocateDeliveryTasksUnderTeam,
          variables: {
            items: data
          }
        })
        .then((res) => {
          if (res && res.data && res.data.bulkAllocateDeliveryTasksUnderTeam) {
            // this.selectedRowKeys = [];
            this.keyTab = '2';
            this.callback(this.keyTab);
            this.triggerPositive();
          }
        })
        .catch((error) => {
          console.log('error ::: ', error);
        })
        .finally(() => {});
    },

    //=========
    mutationRemove() {
      let payloadArray = [];
      this.selectedRowKeys.map((item) => {
        payloadArray.push(item.id);
      });
      this.mutationRemoveJobs(payloadArray);
    },
    mutationRemoveJobs(value) {
      this.$apollo
        .mutate({
          mutation: changeB2bDeliveryJobToBackToBack,
          variables: {
            job_ids: value,
            type: true
          },
          fetchPolicy: 'no-cache'
        })
        .then((res) => {
          if (res && res.data && res.data.changeB2bDeliveryJobToBackToBack) {
            this.isShowModalRegular = false;
            this.selectedRowKeys = [];
            this.reload();
          }
        })
        .catch((error) => {
          console.log('error ::: ', error);
        })
        .finally(() => this.triggerPositive());
    },
    triggerPositive() {
      this.$q.notify({
        type: 'positive',
        position: 'top',
        message: `Succesfully`
      });
    },
    //===============

    // ====== back to back
    showModalBackToBack() {
      this.isBackToBack = true;
      this.isShowModalRegular = true;
    },
    renderNameDriver(id) {
      return this.listDriver.find((item) => item.value === id).label || '';
    },
    //reset
    resetData() {
      this.removeSelection();
      this.td_tenant_id = { value: '', label: 'All Supplier' };
      this.driverId = { value: '', label: 'All Driver' };
      this.defaultStatus = { value: '', label: 'All Status' };
      this.td_invoice_id = null;
      this.delivery_window = { value: '', label: 'All Window' };
      this.listVehicleType = [{ value: '', label: 'All Vehicle' }];
      this.vehicle_type = { value: '', label: 'All Vehicle' };
      this.startTime = null;
      this.endTime = null;
      // this.deliverType = ''
      this.startDate = null;
      this.endDate = null;
      this.selectedSingleItem = null;
      this.pagination = {
        totalItems: 0,
        page: 1,
        limit: 10
      };
    },
    handleCancelModalSingleSelect() {
      this.selectedSingleItem = null;
      this.isShowModalRegular = false;
    },
    //  ====== map====
    showModalMap(id) {
      this.defaultMarket = [];
      if (id) {
        this.driverUserId = id;
      } else {
        this.driverUserId = { value: '', label: 'All Driver' };
      }
      this.selectedRowKeys.map((item) => {
        if (item.latlngInvoices)
          this.defaultMarket.push({
            ...item,
            driverUserId: this.driverUserId
          });
      });
      this.isSHowModalGMap = true;
    },

    showModalAssign() {
      this.mutationDriver({ value: '', label: 'All Driver' });
    },
    async mutationDriver(driver) {
      let payloadArray = [];
      this.selectedRowKeys.map((item) => {
        payloadArray.push({
          tl_job_id: item.id,
          tl_user_id: driver.value
        });
      });
      try {
        await this.showModalMap(driver);
        // await this.reload()
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    //
    showModalChangeDiver() {
      this.isShowModalAssign = true;
      this.defaultDriver = { value: '', label: 'All Driver' };
    },
    closeMapModal() {
      this.closeAll();
    },
    closeAll() {
      this.isShowModalRegular = false;
      this.isSHowModalGMap = false;
      this.removeSelection();
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
