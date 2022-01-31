<template>
  <div>
    <div class="row">
      <div class="col-xs-6 col-lg-6">
        <div style="display: flex; width: 100%">
          <p class="assign-text-total">{{ titleTab }}</p>
          <div class="tagTotalOrder">
            <span>{{ pagination.totalItems }} Jobs</span>
          </div>
        </div>
      </div>
      <div class="col-xs-6 col-lg-6">
        <div v-if="keyTab === '1'" class="btn-create" style="display: flex; justify-content: flex-end">
          <q-btn
            :disabled="selectedRowKeys.length === 0"
            dense
            no-caps
            no-wrap
            padding="0.5rem 1rem"
            outline
            :color="selectedRowKeys.length === 0 ? 'button-border-disable' : 'button-border-active'"
            @click="showModalRegular"
          >
            <span>Regular Order</span>
          </q-btn>

          <q-btn
            style="margin-left: 14px"
            :disabled="selectedRowKeys.length === 0"
            no-wrap
            dense
            no-caps
            padding="0.5rem 1rem"
            @click="showModalAssign"
            :color="selectedRowKeys.length === 0 ? 'button-fill-disable' : 'button-fill-active'"
          >
            <span>Assign</span>
          </q-btn>

          <q-btn
            style="margin-left: 14px"
            :disabled="selectedRowKeys.length === 0"
            no-wrap
            dense
            no-caps
            padding="0.5rem 1rem"
            :color="selectedRowKeys.length === 0 ? 'button-fill-disable' : 'button-fill-active'"
          >
            <span>Broadcast</span>
          </q-btn>
        </div>

        <div v-if="keyTab === '2'" class="btn-create" style="display: flex; justify-content: flex-end">
          <q-btn
            style="margin-left: 14px"
            :disabled="selectedRowKeys.length === 0"
            no-wrap
            dense
            no-caps
            padding="0.5rem 1rem"
            @click="showModalAssignDiver"
            :color="selectedRowKeys.length === 0 ? 'button-fill-disable' : 'button-fill-active'"
          >
            <span>Change Driver</span>
          </q-btn>
        </div>
      </div>
    </div>

    <template>
      <!--          <div v-if="dataTable.length === 0" style="padding: 2rem 0">-->
      <!--            <a-alert message="No Data" type="info" show-icon/>-->
      <!--          </div>-->
      <div>
        <tableJobsUnAssigned
          :get-data-table="dataRenderTable"
          :listSelect="listDeliverType"
          ref="UnAssignedTable"
          @onSelectChange="onSelectChange"
          @onTableOptionsChanged="onTableOptionsChanged"
          @emitAssign="emitAssign"
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
                  >
                    <q-tab name="1" label="Unassigned" />
                    <q-tab name="2" label="Assigned" />
                    <q-tab name="3" label="Completed" />
                    <q-tab name="4" label="Failed" />
                  </q-tabs>
                </div>
              </div>
            </div>

            <div class="col-lg-4 col-xs-4">
              <div class="q-pa-md screen-width-1366-select-search" style="width: 300px; margin-right: 38px">
                <inputSearch placeholder="Search invoice id or recipient..." @outputSearch="onSearch" />
              </div>
            </div>

            <div class="col-lg-8 col-xs-8">
              <div class="box-filter-search">
                <div class="ml-2 q-pa-md" style="width: 150px">
                  <selectSearch
                    placeholder="All Supplier"
                    :data-props="listSupplier"
                    width="width:120px"
                    :default-value="td_tenant_id"
                    @updateData="selectSupplier"
                  />
                </div>

                <div class="ml-2 q-pa-md" style="width: 150px">
                  <selectSearch
                    :data-props="listDriver"
                    width="width:120px"
                    :default-value="driverId"
                    @updateData="selectDriver"
                    placeholder="All Driver"
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
            </div>
          </template>
        </tableJobsUnAssigned>
      </div>
    </template>

    <modalGMap
      v-show="isSHowModalGMap"
      :show.sync="isSHowModalGMap"
      :default-market="defaultMarket"
      :default-paths="geofenceZones"
      :drivers="listDriver"
      :driver-user-id="driverUserId"
      @mutationAllDriver="mutationAllDriver"
      @tableCancel="tableCancel"
      ref="modalGMap"
    ></modalGMap>

    <modal-confirm
      v-show="isShowModalRegular"
      :show.sync="isShowModalRegular"
      title-props="Are you sure?"
      :textProps="contentModalConfirm"
      :singleAssign="regularButton"
      titleBtnActiveSingleAssign="Yes, Proceed"
      :bodyStyle="'height: 8vh'"
      @modalConfirmAssign="mutationRemove"
    />

    <modal-single-select
      v-show="isShowModalAssign"
      :show.sync="isShowModalAssign"
      :title-props="keyTab === '2' ? 'Change Driver' : 'Are you sure?'"
      :titleButtonOk="keyTab === '2' ? 'Update Driver' : 'Send'"
      :array-props="listDriver"
      :defaultModalUpdate="
        keyTab === '2' && selectedSingleItem ? selectedSingleItem.driverUserId : driverUserId
      "
      @updateData="(e) => handleChangeDriver(e, '')"
      @handleCancel="handleCancelModalSingleSelect"
      ref="modalSingleSelect"
    />
  </div>
</template>

<script>
import { SITE_CONFIG } from 'src/config/site.config';
import ModalSingleSelect from '../../components/jobs/modal/modalSingleSelect.vue';
import ModalConfirm from '../../components/jobs/main/modalConfirm.vue';
import singleSelect from '../../components/jobs/main/singleSelect.vue';

//API call
import { updateB2cDeliveryJob } from '../../api/assign/index';
import {
  getUnallocatedJobsUnderTeam,
  bulkAllocateTasksUnderTeam,
  getAllocatedJobsUnderTeam,
  allUserDriveForTeamPreview,
  getAllCompletedJobsUnderTeam,
  getAllFailedJobsUnderTeam
} from '../../api/jobs/index';
import icon_assign_3pl_white from '../../../src/assets/images/icon/icon_assign_3pl_white.png';
import icon_remove_small from '../../../src/assets/images/icon/icon-remove-small.png';
import { listWindow } from 'src/constants/assign';
import { convertTimeTo24h } from 'src/utils/function';

export default {
  name: 'index',
  components: {
    singleSelect,
    ModalSingleSelect,
    ModalConfirm,
    datePicker: () => import('src/components/jobs/main/datePicker.vue'),
    timeRange: () => import('src/components/jobs/main/timeRange.vue'),
    inputSearch: () => import('src/components/share/Search.vue'),
    selectSearch: () => import('../../components/jobs/main/selectSearch.vue'),
    tableJobsUnAssigned: () => import('../../components/jobs/table/tableJobsUnAssigned'),
    modalGMap: () => import('../../components/jobs/modal/modalGMap.vue')
  },
  data() {
    return {
      icon_assign_3pl_white,
      icon_remove_small,
      SITE_CONFIG: SITE_CONFIG,
      selectedRowKeys: [], // Check here to configure the default column
      tableLoading: false,

      // tab
      keyTab: '1',
      //
      isSHowModalGMap: false,
      isSignleAssign: false,
      isShowModalAssign: false,

      isShowModalRegular: false,
      regularButton: true,
      // ====
      listSupplier: [{ value: '', label: 'All Supplier' }],
      listDeliverType: [{ value: '', label: 'All Deliver Type' }],
      listWindow: [...listWindow],
      listDriver: [{ value: '', label: 'All Driver' }],
      modalArray: [{ value: '', label: 'Select Primary 3PL' }],
      driverId: { value: '', label: 'All Driver' },
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
      //new
      deliverType: { value: '', label: 'All Deliver Type' },
      //
      zoneId: '',
      td_invoice_id: null,
      geofenceZones: null,
      pagination: {
        totalItems: 0,
        page: 1,
        limit: 10
      },

      //   cache selected
      cacheSelected: null,
      selectedSingleItem: null,
      //  map
      defaultMarket: [],
      driverUserId: { value: '', label: 'All Driver' },
      contentModalConfirm: 'Change selected invoices from back-to-back to regular orders?',
      titleTab: 'Unassigned Back To Back'
    };
  },
  async created() {
    this.$q.loading.show();
    await this.reload();
    await this.initListDriver();
  },
  computed: {
    userInfo() {
      return this.$store.state.user.user;
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
          if (item.supplier_name.toString().toLowerCase().includes(this.td_invoice_id.toLowerCase())) {
            return item;
          }
          if (item.recipient.toString().toLowerCase().includes(this.td_invoice_id.toLowerCase())) {
            return item;
          }
        });
      }
      return arr || [];
    }
  },
  watch: {
    td_invoice_id(value) {
      this.onSearch(value);
    },
    keyTab(val) {
      this.callback();
      this.removeSelection();
    }
  },

  methods: {
    async reload() {
      if (this.keyTab === '1') {
        await this.initData();
      }
      if (this.keyTab === '2') {
        this.titleTab = 'Assigned Back To Back';
        await this.initDataAssigned();
      }
      if (this.keyTab === '3') {
        this.titleTab = 'Completed Back To Back';
        await this.initDataCompleted();
      }
      if (this.keyTab === '4') {
        this.titleTab = 'Failed Back To Back';
        await this.initDataFailed();
      }
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
    initData() {
      this.tableLoading = true;
      this.$apollo
        .query({
          query: getUnallocatedJobsUnderTeam,
          variables: {
            td_tenant_id: Number(this.td_tenant_id.value) || null,
            start_delivery_date: this.startDate || null,
            end_delivery_date: this.endDate || null,
            delivery_time_from: this.startTime || null,
            delivery_time_to: this.endTime || null,
            td_invoice_id: null,
            zones: this.zoneId || null,
            tl_user_id: this.driverId.value || null,
            b2b_delivery: true,
            page: this.pagination.page,
            limit: this.pagination.limit
          },
          fetchPolicy: 'no-cache'
        })
        .then((res) => {
          // this.$store.dispatch('setAllJobsManagement', _.get(res, 'data.allJobs', []));
          if (res && res.data && res.data.getUnallocatedJobsUnderTeam) {
            this.dataTable = [];
            res.data.getUnallocatedJobsUnderTeam.items.map((item) => {
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
                qty: this.calculatorQty(item.TlServices) || '',
                supplier_name: item.tenants.tenant.name || '',
                recipient: this.getRecipient(item) || '',
                latlngInvoices: item.invoices.latlng,
                driverUserId: { value: '', label: 'All Driver' }
              };
              this.dataTable.push(obj);
            });
            this.pagination.totalItems = res.data.getUnallocatedJobsUnderTeam.totalItem;
            this.geofenceZones = res.data.getUnallocatedJobsUnderTeam?.geofenceZones;
            this.initSupplierSearch(res.data.getUnallocatedJobsUnderTeam.tenants);
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
    triggerPositive() {
      this.$q.notify({
        type: 'positive',
        position: 'top',
        message: `Successful`
      });
    },
    initDataAssigned() {
      this.tableLoading = true;
      this.$apollo
        .query({
          query: getAllocatedJobsUnderTeam,
          variables: {
            td_tenant_id: Number(this.td_tenant_id.value) || null,
            start_delivery_date: this.startDate || null,
            end_delivery_date: this.endDate || null,
            td_invoice_id: null,
            b2b_delivery: true,
            delivery_time_from: this.startTime || null,
            delivery_time_to: this.endTime || null,
            zones: this.zoneId || null,
            tl_user_id: this.driverId.value || null,
            page: this.pagination.page,
            limit: this.pagination.limit
          },
          fetchPolicy: 'no-cache'
        })
        .then((res) => {
          // this.$store.dispatch('setAllJobsManagement', _.get(res, 'data.allJobs', []));
          if (res && res.data && res.data.getAllocatedJobsUnderTeam) {
            this.dataTable = [];
            res.data.getAllocatedJobsUnderTeam.items.map((item) => {
              let obj = {
                ...item,
                qty: this.calculatorQty(item.TlServices) || '',
                // delivery_window: item.collection_window || '',
                supplier_name: item.tenants.tenant.name || '',
                recipient: this.getRecipient(item) || '',
                latlngInvoices: item.invoices.latlng,
                driverUserName:
                  item?.TlTasks[0]?.TlUsers.first_name + ' ' + item?.TlTasks[0]?.TlUsers.last_name,
                driverUserId: {
                  value: item?.TlTasks[0]?.TlUsers.id,
                  label: item?.TlTasks[0]?.TlUsers.first_name + ' ' + item?.TlTasks[0]?.TlUsers.last_name
                }
              };
              this.dataTable.push(obj);
            });
            this.pagination.totalItems = res.data.getAllocatedJobsUnderTeam.totalItem;
            this.geofenceZones = res.data.getAllocatedJobsUnderTeam?.geofenceZones;
            this.initSupplierSearch(res.data.getAllocatedJobsUnderTeam.tenants);
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
          query: getAllCompletedJobsUnderTeam,
          variables: {
            td_tenant_id: Number(this.td_tenant_id.value) || null,
            delivery_time_from: this.startTime || null,
            delivery_time_to: this.endTime || null,
            start_delivery_date: this.startDate || null,
            end_delivery_date: this.endDate || null,
            tl_user_id: this.driverId.value || null,
            td_invoice_id: null,
            b2b_delivery: true,
            zones: this.zoneId || null,
            page: this.pagination.page,
            limit: this.pagination.limit
          },
          fetchPolicy: 'no-cache'
        })
        .then((res) => {
          // this.$store.dispatch('setAllJobsManagement', _.get(res, 'data.allJobs', []));
          if (res && res.data && res.data.getAllCompletedJobsUnderTeam) {
            this.dataTable = [];
            res.data.getAllCompletedJobsUnderTeam.items.map((item) => {
              let obj = {
                ...item,
                qty: this.calculatorQty(item.TlServices) || '',
                // delivery_window: item.collection_window || '',
                supplier_name: item.tenants.tenant.name || '',
                recipient: this.getRecipient(item) || '',
                latlngInvoices: item.invoices.latlng,
                driverUserName:
                  item?.TlTasks[0]?.TlUsers.first_name + ' ' + item?.TlTasks[0]?.TlUsers.last_name,
                driverUserId: {
                  value: item?.TlTasks[0]?.TlUsers.id,
                  label: item?.TlTasks[0]?.TlUsers.first_name + ' ' + item?.TlTasks[0]?.TlUsers.last_name
                }
              };
              this.dataTable.push(obj);
            });
            this.pagination.totalItems = res.data.getAllCompletedJobsUnderTeam.totalItem;
            this.geofenceZones = res.data.getAllCompletedJobsUnderTeam?.geofenceZones;
            this.initSupplierSearch(res.data.getAllCompletedJobsUnderTeam.tenants);
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
          query: getAllFailedJobsUnderTeam,
          variables: {
            td_tenant_id: Number(this.td_tenant_id.value) || null,
            delivery_time_from: this.startTime || null,
            delivery_time_to: this.endTime || null,
            start_delivery_date: this.startDate || null,
            end_delivery_date: this.endDate || null,
            tl_user_id: this.driverId.value || null,
            td_invoice_id: null,
            b2b_delivery: true,
            zones: this.zoneId || null,
            page: this.pagination.page,
            limit: this.pagination.limit
          },
          fetchPolicy: 'no-cache'
        })
        .then((res) => {
          // this.$store.dispatch('setAllJobsManagement', _.get(res, 'data.allJobs', []));
          if (res && res.data && res.data.getAllFailedJobsUnderTeam) {
            this.dataTable = [];
            res.data.getAllFailedJobsUnderTeam.items.map((item) => {
              let obj = {
                ...item,
                qty: this.calculatorQty(item.TlServices) || '',
                // delivery_window: item.collection_window || '',
                supplier_name: item.tenants.tenant.name || '',
                recipient: this.getRecipient(item) || '',
                latlngInvoices: item.invoices.latlng,
                driverUserName:
                  item?.TlTasks[0]?.TlUsers.first_name + ' ' + item?.TlTasks[0]?.TlUsers.last_name,
                // driverUserId: item?.TlTasks[0]?.TlUsers.id
                driverUserId: {
                  value: item?.TlTasks[0]?.TlUsers.id,
                  label: item?.TlTasks[0]?.TlUsers.first_name + ' ' + item?.TlTasks[0]?.TlUsers.last_name
                }
              };
              this.dataTable.push(obj);
            });
            this.pagination.totalItems = res.data.getAllFailedJobsUnderTeam.totalItem;
            this.geofenceZones = res.data.getAllFailedJobsUnderTeam?.geofenceZones;
            this.initSupplierSearch(res.data.getAllFailedJobsUnderTeam.tenants);
          }
        })
        .catch((error) => {
          console.log('error ::: ', error);
        })
        .finally(() => (this.tableLoading = false));
    },

    getRecipient(value) {
      return value?.invoices?.OrderItem[0]?.customer?.name;
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
                label: item.first_name + ' ' + item.last_name || '',
                value: item.id || ''
              };
              this.listDriver.push(obj);
            });
          } else this.listDriver = [{ value: '', label: 'All Driver' }];
        })
        .catch((err) => {
          console.log('err queryMe ::: ', err);
        });
    },
    // ====================================================================================
    onSearch(val) {
      if (val) {
        this.td_invoice_id = val.trim();
      } else {
        this.td_invoice_id = '';
      }
      // this.initData()
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    selectDriver(value) {
      if (value) {
        this.driverId = value;
      } else {
        this.driverId = '';
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
        this.startTime = convertTimeTo24h(startTime);
        this.endTime = convertTimeTo24h(endTime);
      } else {
        this.startTime = null;
        this.endTime = null;
      }

      this.reload();
    },

    //  selectSupplier
    selectSupplier(value) {
      if (value) {
        this.td_tenant_id = value;
      } else {
        this.td_tenant_id = '';
      }
      this.reload();
    },
    selectDeliverType(value) {
      if (value) {
        this.deliverType = value;
      } else {
        this.deliverType = '';
      }
      this.reload();
    },

    //reset
    resetData() {
      this.removeSelection();
      this.isShowModalRegular = false;
      this.isShowModalAssign = false;
      this.isSHowModalGMap = false;
      this.td_tenant_id = { value: '', label: 'All Supplier' };
      this.driverId = { value: '', label: 'Un Assigned' };
      this.defaultStatus = { value: '', label: 'All Status' };
      this.td_invoice_id = null;
      this.startTime = null;
      this.endTime = null;
      this.deliverType = { value: '', label: 'All Deliver Type' };
      this.startDate = null;
      this.endDate = null;
      this.driverUserId = { value: '', label: 'All Driver' };
      this.isSignleAssign = false;
      this.selectedSingleItem = null;
      this.pagination = {
        totalItems: 0,
        page: 1,
        limit: 10
      };
    },
    handleCancelModalSingleSelect() {
      this.selectedSingleItem = null;
      this.driverUserId = { value: '', label: 'All Driver' };
    },
    //   new

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
    //   show map
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
    showModalRegular() {
      if (this.keyTab === '1') {
        this.contentModalConfirm = 'Change selected invoices from back-to-back to regular orders?';
      } else {
        this.contentModalConfirm = 'Do you want to change driver for the selected invoices?';
      }
      this.isShowModalRegular = true;
    },
    emitAssign(value) {
      this.selectedSingleItem = value;
      this.isShowModalAssign = true;
      this.isSignleAssign = true;
    },

    showModalAssign() {
      this.mutationDriver('');
    },

    //=================mutation driver market===============================u
    async mutationAllDriver(value) {
      let payloadArray = [];
      value.map((item) => {
        payloadArray.push({
          tl_job_id: item.id,
          tl_user_id: item.driverUserId.value
        });
      });
      try {
        await this.mutationDriverCollection(payloadArray);
        await this.$refs.modalGMap.handleBack();
        this.isShowModalAssign = false;
        await this.handleCancelModalSingleSelect();
        this.keyTab = '2';
      } catch (e) {
        console.log(e);
      } finally {
        this.isSHowModalGMap = false;
        this.removeSelection();
        this.triggerPositive();
      }
    },
    //=================mutation driver===============================
    async mutationDriver(driver) {
      let payloadArray = [];
      this.selectedRowKeys.map((item) => {
        payloadArray.push({
          tl_job_id: item.id,
          tl_user_id: driver
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
    handleChangeDriver(driver) {
      if (this.keyTab === '1') {
        this.mutationAssignDriver(driver);
      } else {
        this.driverUserId = driver;
        this.showModalRegular();
      }
    },

    async mutationAssignDriver(driver) {
      let payloadArray = [];
      if (this.isSignleAssign) {
        payloadArray = [
          {
            tl_job_id: this.selectedSingleItem.id,
            tl_user_id: driver.value
          }
        ];
      } else {
        this.selectedRowKeys.map((item) => {
          payloadArray.push({
            tl_job_id: item.id,
            tl_user_id: driver.value
          });
        });
      }

      try {
        await this.mutationDriverCollection(payloadArray);
        this.selectedSingleItem = null;
        this.isSignleAssign = false;
        this.isShowModalAssign = false;
        this.isShowModalRegular = false;
        this.driverUserId = { value: '', label: 'All Driver' };
        await this.handleCancelModalSingleSelect();
        await this.callback();
      } catch (e) {
        console.log(e);
      } finally {
        this.triggerPositive();
      }
    },

    async mutationDriverCollection(payload) {
      await this.$apollo
        .mutate({
          mutation: bulkAllocateTasksUnderTeam,
          variables: {
            items: payload
          },
          fetchPolicy: 'no-cache'
        })
        .then((res) => {
          console.log('Collection', res);
        })
        .catch((error) => {
          console.log('error ::: ', error);
        });
    },
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
      this.$refs.UnAssignedTable.handleSetDataSelectedRowKey([]);
    },
    handleSetDataSelectedRowKey(data) {
      let arr = [...data];
      this.selectedRowKeys = arr;
      console.log('this.selectedRowKeys', this.selectedRowKeys);
    },
    mutationRemoveJobs(value) {
      this.$apollo
        .mutate({
          mutation: updateB2cDeliveryJob,
          variables: {
            job_ids: value,
            type: false
          },
          fetchPolicy: 'no-cache'
        })
        .then((res) => {
          if (res && res.data && res.data.updateB2cDeliveryJob) {
            this.isShowModalRegular = false;
            this.selectedRowKeys = [];
            this.reload();
            this.removeSelection();
          }
        })
        .catch((error) => {
          console.log('error ::: ', error);
        })
        .finally(() => {
          this.triggerPositive();
        });
    },
    //  ==== change Tab======
    async callback() {
      await this.resetData();
      await this.reload();
    },

    //   assign
    showModalAssignDiver() {
      this.driverUserId = { value: '', label: 'All Driver' };
      this.isShowModalAssign = true;
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
</style>
