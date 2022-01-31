<template>
  <div>
    <div class="row">
      <div class="col">
        <div v-if="keyTab === '1'" style="display: flex; width: 100%">
          <p class="assign-text-total">Picking Orders</p>
          <div class="tagTotalOrder">
            <span>{{ pagination.totalItems }}</span>
          </div>
        </div>

        <div v-else>
          <div class="btn-pointer" style="margin-bottom: 16px" @click="callback('1')">
            <q-icon size="24px" name="arrow_back" style="margin-right: 10px" />
            Back
          </div>
          <div style="margin-bottom: 24px">
            <span style="font-weight: 700; font-size: 18px; color: black"
              >Invoice {{ selectedSingleItem ? selectedSingleItem.invoice_id : '' }} | Emery</span
            >
            <q-icon size="24px" name="vertical_align_bottom" style="margin: 0 5px 0 29px" />
            Download Invoice
          </div>
        </div>
      </div>

      <div class="col">
        <div class="btn-create" style="display: flex; justify-content: flex-end">
          <div v-if="selectedRowKeys.length > 0" class="text-remove-selection" @click="removeSelection">
            <span>Remove Selection ({{ selectedRowKeys.length }})</span>
          </div>

          <template v-if="keyTab === '1'">
            <q-btn
              :disabled="selectedRowKeys.length === 0"
              dense
              no-caps
              no-wrap
              padding="0.5rem 1rem"
              outline
              :color="selectedRowKeys.length === 0 ? 'button-border-disable' : 'button-border-active'"
              style="margin-left: 14px"
              @click="downloadPdfFile()"
            >
              <span>Download Picking List</span>
            </q-btn>

            <q-btn
              style="margin-left: 14px"
              :disabled="selectedRowKeys.length === 0"
              no-wrap
              dense
              no-caps
              padding="0.5rem 1rem"
              @click="showModalConfirm"
              :color="selectedRowKeys.length === 0 ? 'button-fill-disable' : 'button-fill-active'"
            >
              <span>Mark As Complete</span>
            </q-btn>

            <q-btn
              style="margin-left: 14px"
              :disabled="selectedRowKeys.length === 0"
              no-wrap
              dense
              no-caps
              padding="0.5rem 1rem"
              @click="showModalBackToBack"
              :color="selectedRowKeys.length === 0 ? 'button-fill-disable' : 'button-fill-active'"
            >
              <span>Change Warehouse</span>
            </q-btn>
          </template>

          <q-btn
            v-if="keyTab === '2'"
            style="margin-left: 14px"
            :disabled="selectedRowKeys.length === 0"
            no-wrap
            dense
            no-caps
            padding="0.5rem 1rem"
            @click="showModalBackToBack"
            :color="selectedRowKeys.length === 0 ? 'button-fill-disable' : 'button-fill-active'"
          >
            <span>Mark As</span>
          </q-btn>
        </div>
      </div>
    </div>
    <!-- ======================table -->
    <template>
      <template v-if="keyTab === '1'">
        <template>
          <div style="margin-bottom: 30px">
            <tablePacking
              :get-data-table="dataRenderTable"
              ref="tableJobs"
              :get-pagination="{
                total: pagination.totalItems,
                current: pagination.page,
                pageSize: pagination.limit
              }"
              @onSelectChange="onSelectChange"
              @onTableOptionsChanged="onTableOptionsChanged"
              @emitAssign="showViewTable"
            >
              <template v-if="tableLoading" v-slot:loading>
                <div class="spinner-loading">
                  <q-spinner color="primary" size="3em" />
                </div>
              </template>
              <template v-slot:top>
                <div class="col-lg-3 col-xs-3">
                  <div
                    class="q-pa-md screen-width-1366-select-search"
                    style="width: 300px; margin-right: 38px"
                  >
                    <inputSearch placeholder="Search invoice id or receipient" @outputSearch="onSearch" />
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
                      />
                    </div>

                    <div class="ml-2 q-pa-md" style="width: 150px">
                      <selectSearch
                        :data-props="listSupplier"
                        width="width:150px"
                        :default-value="td_tenant_id"
                        @updateData="selectSupplier"
                      />
                    </div>

                    <div class="ml-2 q-pa-md" style="width: 150px">
                      <singleSelect
                        :data-props="listStatus"
                        width="width:150px"
                        :default-value="defaultStatus"
                        @updateData="selectStatus"
                      />
                    </div>

                    <div class="btn-create ml-2 q-pa-md" style="display: flex; justify-content: flex-end">
                      <div style="margin-top: 8px"><span>Window</span></div>
                      <div class="ml-2">
                        <datePicker @updateData="onChange"></datePicker>
                      </div>
                    </div>

                    <div
                      class="btn-create ml-2 q-pa-md screen-width-1366-range-time"
                      style="display: flex; justify-content: flex-end"
                    >
                      <div style="margin: 8px 0px"><span style="padding-right: 5px"> Window: </span></div>
                      <timeRange @updateData="onChangeTime"></timeRange>
                    </div>
                  </div>
                </div>
                <br />
              </template>
            </tablePacking>
          </div>
        </template>
      </template>

      <template v-else>
        <template>
          <div style="margin-bottom: 30px">
            <tableViewJobPicking
              :get-data-table="dataRenderViewTable"
              ref="tableViewJobPicking"
              @onSelectChange="onSelectChange"
              @updateReceivedQty="mutationUpdateReceivedQty"
              :get-pagination="{
                total: pagination.totalItems,
                current: pagination.page,
                pageSize: pagination.limit
              }"
            >
              <template v-slot:top>
                <div class="col-xs-12 col-lg-4">
                  <div>
                    <span>Total Items: {{ dataRenderViewTable.length }}</span>
                  </div>
                </div>

                <div class="col-xs-12 col-lg-8">
                  <div style="display: flex; width: 100%; justify-content: flex-end">
                    <div style="width: 300px">
                      <inputSearch placeholder="Search product name" @outputSearch="onSearch" />
                    </div>
                  </div>
                </div>
              </template>

              <template v-if="tableLoading" v-slot:loading>
                <div class="spinner-loading">
                  <q-spinner color="primary" size="3em" />
                </div>
              </template>
            </tableViewJobPicking>
          </div>
        </template>
      </template>
    </template>
    <modal-confirm
      v-show="isShowModalRegular"
      :show.sync="isShowModalRegular"
      :title-props="titleProps"
      :textProps="textModalConfirm"
      :singleAssign="regularButton"
      :titleBtnActiveSingleAssign="textBtnModalConfirm"
      :titleBtnCancelSingleAssign="textBtnModalConfirmCancel"
      :bodyStyle="bodyStyle"
      :modalTitle="titleProps"
      color="green"
      @modalConfirmAssign="mutationConfirm"
    >
      <q-option-group
        v-if="keyTab === '2'"
        v-model="status"
        :options="options"
        color="option-fill-active"
        inline
      />
    </modal-confirm>

    <modal-single-select
      v-show="isShowModalAssign"
      :show.sync="isShowModalAssign"
      title-props="Change Warehouse"
      :array-props="listDriver"
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
  getAllPickingOrdersUnderTeam,
  getAllPickingOrdersUnderInvoice,
  updatePickingOrdersStatus,
  updatePickingOrderStatusByTask,
  allUserDriveForTeam,
  updatePickingReceivedQty,
  downloadPickingListPdf
} from '../../api/jobs/index';

import { changeTimeStamp, changeHourStamp, changeTimeDateString, downloadFile } from '../../utils/function';
import { listStatus } from '../../constants/jobs/index';
import { convertTimeTo24h } from 'src/utils/function';

export default {
  data() {
    return {
      icon_assign_3pl_white,
      icon_remove_small,
      bodyStyle: 'height: 100px',
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
      listDriver: [{ value: '', label: 'All Driver' }],
      startDate: '',
      endDate: '',
      startTime: null,
      endTime: null,
      isUsingTimeFilter: false,
      td_tenant_id: { value: '', label: 'All Supplier' },
      zoneId: '',
      listStatus: [...listStatus],
      delivery_window: '',
      defaultStatus: {
        value: '',
        label: 'All Status'
      },
      driverId: { value: '', label: 'All Driver' },
      dateFormat: 'DD/MM/YYYY',
      selectedRowKeys: [], // Check here to configure the default column,
      //   driver
      isShowModalTableDriver: false,
      isShowModalAssign: false,
      //   table
      isShowModalTable: false,
      cacheSelected: null,
      selectedSingleItem: null,
      textBtnModalConfirmCancel: 'No, Cancel',
      // tab
      keyTab: '1',
      //
      isSHowModalGMap: false,

      isShowModalRegular: false,
      regularButton: true,
      titleProps: 'Are you sure?',
      textModalConfirm: 'You will be updating the warehouse for this item. Proceed?',
      textBtnModalConfirm: 'Save',
      status: 4,
      dataViewTable: [],
      options: [
        {
          label: 'Not Started',
          value: 2
        },
        {
          label: 'In Progress',
          value: 3
        },
        {
          label: 'Completed',
          value: 4
        }
      ]
    };
  },
  components: {
    singleSelect,
    datePicker: () => import('src/components/jobs/main/datePicker.vue'),
    inputSearch: () => import('src/components/share/Search.vue'),
    tablePacking: () => import('src/components/jobs/table/tablePacking.vue'),
    selectSearch: () => import('src/components/jobs/main/selectSearch'),
    tableViewJobPicking: () => import('src/components/jobs/table/tableViewJobPicking.vue'),
    modalConfirm: () => import('src/components/jobs/main/modalConfirm.vue'),
    ModalSingleSelect: () => import('src/components/jobs/modal/modalSingleSelect.vue'),
    timeRange: () => import('src/components/jobs/main/timeRange.vue')
  },
  computed: {
    userInfo() {
      return this.$store.state.user.user;
    },
    dataRenderViewTable() {
      let arr = [];
      if (this.dataViewTable) {
        this.dataViewTable.map((item) => {
          if (item.tl_service_task_type_id === 3) {
            arr.push({ ...item });
          }
        });
      }
      if (this.td_invoice_id) {
        arr = arr.filter((item) => {
          if (item.product_name?.toString().toLowerCase().includes(this.td_invoice_id)) {
            return item;
          }
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
          if (item.td_invoice_id?.toString().toLowerCase().includes(this.td_invoice_id)) {
            return item;
          }
          if (item.receipient?.toString()?.toLowerCase()?.includes(this.td_invoice_id.toLowerCase())) {
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
      } else {
        await this.initDataTask();
      }
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
          query: getAllPickingOrdersUnderTeam,
          variables: {
            td_tenant_id: Number(this.td_tenant_id.value) || null,
            status_task_id: Number(this.defaultStatus.value) || null,
            start_delivery_date: this.startDate || null,
            end_delivery_date: this.endDate || null,
            delivery_time_from: this.startTime || null,
            delivery_time_to: this.endTime || null,
            td_invoice_id: null,
            tl_user_id: this.driverId.value || null,
            zones: this.zoneId || null,
            page: this.pagination.page,
            limit: this.pagination.limit
          },
          fetchPolicy: 'no-cache'
        })
        .then((res) => {
          // this.$store.dispatch('setAllJobsManagement', _.get(res, 'data.allJobs', []));
          if (res && res.data && res.data.getAllPickingOrdersUnderTeam) {
            this.dataTable = [];
            res.data.getAllPickingOrdersUnderTeam.items.map((item) => {
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
              console.log('deliveryWindow', deliveryWindow);
              let obj = {
                ...item,
                delivery_time_from: DeliveryTimeFrom,
                delivery_time_to: DeliveryTimeTo,
                key: item.id,
                invoice_id: item.invoices.id,
                supplier: item.tenants.tenant.name,
                receipient: this.getRecipient(item) || '',
                total_items: this.calculatorQty(item.TlServices) || '',
                date: changeTimeStamp(item.delivery_date),
                window: deliveryWindow,
                isUsingTimeFilter: this.isUsingTimeFilter,
                // warehouse: item.delivery_address,
                status: this.checkStatus(item.TlTasks)
              };
              this.dataTable.push(obj);
            });
            this.pagination.totalItems = res.data.getAllPickingOrdersUnderTeam.totalItem;
            this.geofenceZones = res.data.getAllPickingOrdersUnderTeam?.geofenceZones;
            this.initSupplierSearch(res.data.getAllPickingOrdersUnderTeam.tenants);
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
    initDataTask() {
      this.tableLoading = true;
      this.$apollo
        .query({
          query: getAllPickingOrdersUnderInvoice,
          variables: {
            job_id: this.selectedSingleItem.id
          },
          fetchPolicy: 'no-cache'
        })
        .then((res) => {
          if (res && res.data && res.data.getAllPickingOrdersUnderInvoice) {
            let data = res.data.getAllPickingOrdersUnderInvoice;
            this.dataViewTable = [];
            data.TlTasks.map((item) => {
              let obj = {
                ...item,
                product_name:
                  (item.OrderItem && item.OrderItem.product_name) || item.OrderItem.sku.product?.name || '',
                status: this.checkStatusViewJobs(item.TlTaskStatuses)
              };
              this.dataViewTable.push(obj);
            });
          }
        })
        .catch((error) => {
          console.log('error ::: ', error);
        })
        .finally(() => (this.tableLoading = false));
    },

    initListDriver() {
      this.$apollo
        .query({
          query: allUserDriveForTeam,
          fetchPolicy: 'no-cache'
        })
        .then((res) => {
          if (res.data.allUserDriveForTeam && res.data.allUserDriveForTeam.length > 0) {
            this.listDriver = [{ value: '', label: 'All Driver' }];
            res.data.allUserDriveForTeam.map((item) => {
              let obj = {
                ...item,
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

    async callback(key) {
      await this.resetData();
      if (this.keyTab === '2') {
        await this.initData();
      } else {
        await this.initDataTask();
      }
      this.keyTab = key;
    },
    onSearch(val) {
      if (val) {
        this.td_invoice_id = val;
      } else {
        this.td_invoice_id = '';
      }
      //   this.initData()
    },
    selectSupplier(value) {
      if (value) {
        this.td_tenant_id = value;
      } else {
        this.td_tenant_id = '';
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
    selectStatus(value) {
      this.defaultStatus = value;
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

    //=================
    onSelectChange(val) {
      this.selectedRowKeys = [...val];
    },
    removeSelection() {
      this.selectedRowKeys = [];
      if (this.keyTab === '1') {
        this.$refs.tableJobs.handleSetDataSelectedRowKey([]);
      } else {
        this.$refs.tableViewJobPicking
          ? this.$refs.tableViewJobPicking.handleSetDataSelectedRowKey([])
          : () => {};
      }
    },
    //===========table modal driver=============
    handleTableDriverCancel() {
      this.isShowModalConfirm = false;
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
        arrSelected.push(item.id);
      });
      this.$refs.regCollectionTable.handleSetDataSelectedRowKey(arrSelected);
    },
    //  ======= modal table====
    handleTableCancel() {
      this.isShowModalTable = false;
    },
    //=========
    mutationConfirm() {
      let payloadArray = [];
      this.selectedRowKeys.map((item) => {
        payloadArray.push(item.id);
      });
      if (this.keyTab === '1') {
        this.mutationUpdateStatusJobs(payloadArray);
      } else {
        this.mutationUpdateStatusTask(payloadArray);
      }
    },
    mutationUpdateStatusJobs(value) {
      this.$apollo
        .mutate({
          mutation: updatePickingOrdersStatus,
          variables: {
            job_ids: value,
            status_id: 4
          },
          fetchPolicy: 'no-cache'
        })
        .then((res) => {
          if (res && res.data && res.data.updatePickingOrdersStatus) {
            this.isShowModalRegular = false;
            this.removeSelection();
            this.reload();
            this.triggerPositive();
          }
        })
        .catch((error) => {
          console.log('error ::: ', error);
        })
        .finally(() => {});
    },
    triggerPositive() {
      this.$q.notify({
        type: 'positive',
        position: 'top',
        message: `Changed Successful!`
      });
    },
    mutationUpdateStatusTask(value) {
      this.$apollo
        .mutate({
          mutation: updatePickingOrderStatusByTask,
          variables: {
            task_ids: value,
            status_id: this.status
          },
          fetchPolicy: 'no-cache'
        })
        .then((res) => {
          if (res && res.data && res.data.updatePickingOrderStatusByTask) {
            this.isShowModalRegular = false;
            this.removeSelection();
            this.reload();
            this.triggerPositive();
          }
        })
        .catch((error) => {
          console.log('error ::: ', error);
        })
        .finally(() => {});
    },
    mutationUpdateReceivedQty(data) {
      this.$apollo
        .mutate({
          mutation: updatePickingReceivedQty,
          variables: data,
          fetchPolicy: 'no-cache'
        })
        .then((res) => {
          if (res && res.data && res.data.updatePickingReceivedQty) {
            this.removeSelection();
            this.reload();
            this.triggerPositive();
          }
        })
        .catch((error) => {
          console.log('error ::: ', error);
        })
        .finally(() => {});
    },
    onChangeTime(startTime, endTime) {
      if (startTime && endTime) {
        this.isUsingTimeFilter = true;
        this.startTime = convertTimeTo24h(startTime);
        this.endTime = convertTimeTo24h(endTime);
      } else {
        this.startTime = null;
        this.endTime = null;
      }

      this.reload();
    },

    // ====== back to back
    showModalBackToBack() {
      this.isShowModalRegular = true;
      if (this.keyTab === '1') {
        this.bodyStyle = 'height:50px';
        this.textModalConfirm = 'You will be updating the warehouse for this item. Proceed?';
        this.textBtnModalConfirm = 'Save';
      } else {
        this.titleProps = 'Mark as';
        this.textModalConfirm = 'Mark as status for this item as';
        this.textBtnModalConfirm = 'Save';
      }
    },
    showModalConfirm() {
      this.isShowModalRegular = true;
      this.textModalConfirm = 'You will be update the status for selected item to completed. Proceed?';
      this.textBtnModalConfirm = 'Yes, Proceed';
      this.titleProps = 'Mark as';
      this.textBtnModalConfirmCancel = 'Cancel';
    },
    renderNameDriver(id) {
      return this.listDriver.find((item) => item.value === id).label || '';
    },
    //reset
    resetData() {
      this.removeSelection();
      this.td_tenant_id = { value: '', label: 'All Supplier' };
      this.driverId = { value: '', label: 'Un Assigned' };
      this.defaultStatus = {
        value: '',
        label: 'All Status'
      };
      this.td_invoice_id = null;
      this.delivery_window = '';
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
    },
    //  ====== map====
    showModalMap(id) {
      this.defaultMarket = [];
      this.driverUserId = id;
      this.selectedRowKeys.map((item) => {
        if (item.latlngInvoices)
          this.defaultMarket.push({
            ...item,
            driverUserId: id
          });
      });
      this.isSHowModalGMap = true;
    },

    showModalAssign() {
      this.mutationDriver('');
    },
    async mutationDriver(driver) {
      let payloadArray = [];
      this.selectedRowKeys.map((item) => {
        payloadArray.push({
          tl_job_id: item.id,
          tl_user_id: driver
        });
      });
      await this.$refs.modalSingleSelect.setLoading(true);
      try {
        await this.showModalMap(driver);
        // await this.reload()
      } catch (e) {
        console.log(e);
      } finally {
        await this.$refs.modalSingleSelect.setLoading(false);
      }
    },
    //
    showModalChangeWarehouse() {
      this.isShowModalAssign = true;
    },
    getRecipient(value) {
      return value?.invoices?.OrderItem[0]?.customer?.name;
    },
    //  view table
    showViewTable(value) {
      this.resetData();
      this.selectedSingleItem = { ...value };
      this.initDataTask();
      this.keyTab = '2';
    },
    checkStatus(array) {
      if (
        array.find((item) => item.tl_task_status_id === 3) ||
        (array.find((item) => item.tl_task_status_id === 2) &&
          array.find((item) => item.tl_task_status_id === 4))
      ) {
        return {
          text: 'In Progress',
          class: 'inProgress'
        };
      } else if (array.filter((item) => item.tl_task_status_id === 4).length === array.length) {
        return {
          text: 'Completed',
          class: 'completed'
        };
      } else {
        return {
          text: 'Not started',
          class: 'notStarted'
        };
      }
    },
    checkStatusViewJobs(TlTaskStatuses) {
      let obj = {
        text: TlTaskStatuses.name,
        class: ''
      };
      if (TlTaskStatuses.name === 'In Progress') {
        obj.class = 'inProgress';
      }
      if (TlTaskStatuses.name === 'Completed') {
        obj.class = 'completed';
      }
      if (TlTaskStatuses.name === 'Not started' || TlTaskStatuses.name === 'Assigned') {
        obj.class = 'notStarted';
      }
      return obj;
    },
    async downloadPdfFile() {
      this.$q.loading.show();
      this.selectedRowKeys[0].windowFilter = this.isUsingTimeFilter
        ? this.startTime.concat(' to ', this.endTime)
        : '';
      this.selectedRowKeys.isUsingTimeFilter = this.isUsingTimeFilter;
      console.log('this.selectedRowKeys[0].windowFilter', this.selectedRowKeys[0].windowFilter);
      await this.$apollo
        .mutate({
          mutation: downloadPickingListPdf,
          variables: {
            jsonData: JSON.stringify(this.selectedRowKeys)
          },
          fetchPolicy: 'no-cache'
        })
        .then(async (res) => {
          await downloadFile(JSON.parse(res.data.downloadPickingListPdf));
        })
        .catch((error) => {
          console.log('error ::: ', error);
          console.log('listData', this.selectedRowKeys);
        })
        .finally(() => {
          this.$q.loading.hide();
        });
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
