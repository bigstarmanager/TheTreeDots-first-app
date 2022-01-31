<template>
  <div>
    <div>
      <tableSetting
        ref="tableSetting"
        :get-data-table="dataRenderTable"
        @emitEdit="handleEditZone"
        @emitLocation="handleLocationZone"
      >
        <template v-if="tableLoading" v-slot:loading>
          <div class="spinner-loading">
            <q-spinner color="primary" size="3em" />
          </div>
        </template>
        <template v-slot:top>
          <div style="width: 100%">
            <div class="box-tabs-setting">
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
                <q-tab name="1" label="Geo-Fence" />
                <!--                <q-tab name="2" label="Window" />-->
              </q-tabs>
              <div v-if="!showCardZone">
                <q-btn
                  no-wrap
                  dense
                  no-caps
                  padding="0.5rem"
                  @click="handleAddZone"
                  color="button-fill-active"
                >
                  <span>+ Add New Zone</span>
                </q-btn>
              </div>
            </div>
            <div style="margin-bottom: 30px">
              <gMapVue
                ref="gMapVue"
                :key="editZone"
                style-custom="width: 100%; min-height:670px;"
                :default-paths="geofenceZones"
                :editable="editZone"
                :addable="addZone"
                :addClear="addZone"
                :addDelete="editZone"
                :default-center="centerZone"
                @changePaths="changePaths"
                @deleteZone="showModalDeleteZone"
              ></gMapVue>
            </div>
            <div class="box-search-setting">
              <q-card v-if="showCardZone" style="background: #f4f6f8; margin-bottom: 30px">
                <q-card-section>
                  <p class="text-edit-zone">
                    {{ editZone ? 'Edit Zone ' : '+ Add New Zone' }}
                  </p>
                  <div class="body-card-zone">
                    <div class="row q-gutter-x-md">
                      <div class="col-4">
                        <p>Zone Name</p>
                        <div>
                          <q-input
                            bg-color="white"
                            outlined
                            v-model="formZone.name"
                            placeholder="Name"
                            dense
                            :rules="[(val) => !!val || 'Name is required']"
                          />
                        </div>
                      </div>
                      <div class="col-7">
                        <p>Description</p>
                        <div style="margin-bottom: 30px">
                          <q-input
                            bg-color="white"
                            outlined
                            v-model="formZone.description"
                            placeholder="Description"
                            dense
                            :rules="[(val) => !!val || 'Description is required']"
                          />
                        </div>
                        <div style="display: flex; justify-content: flex-end">
                          <q-btn
                            no-wrap
                            dense
                            no-caps
                            padding="0.5rem 1rem"
                            outline
                            color="button-border-active"
                            style="margin-left: 14px"
                            @click="showModalSave"
                          >
                            <span>Cancel</span>
                          </q-btn>
                          <q-btn
                            no-wrap
                            dense
                            no-caps
                            padding="0.5rem 1rem"
                            color="button-fill-active"
                            style="margin-left: 14px"
                            @click="handleConfirmZone"
                            :disable="
                              !formZone.name ||
                              !formZone.description ||
                              !(formZone.paths && formZone.paths.length > 0)
                            "
                          >
                            <span>{{ editZone ? 'Save ' : 'Add Zone' }}</span>
                          </q-btn>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
              <q-separator />
              <div class="row">
                <div class="col-xs-12 col-lg-8">
                  <div style="width: 300px">
                    <inputSearch placeholder="Search Zone..." style="width: 300px" @outputSearch="onSearch" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </tableSetting>
    </div>
    <modal-confirm
      v-if="isShowModalRegular"
      :show.sync="isShowModalRegular"
      :titleBtnCancelSingleAssign="formModal.btnCancel"
      title-props="Are you sure?"
      :textProps="formModal.content"
      :singleAssign="regularButton"
      colorBtn="negative"
      body-style="height:50px"
      :titleBtnActiveSingleAssign="formModal.btnActive"
      @modalConfirmAssign="handleActive"
      @handleCancel="handleCancel"
    />
  </div>
</template>

<script>
import { SITE_CONFIG } from 'src/config/site.config';
//API call
import { getAllocatedJobsUnderTeam } from '../../api/jobs/index';
import { addNewZone, getAllZonesByTeamId, updateZone, deleteZone } from '../../api/setting';
import { queryMe } from 'src/api/user';
import { _ } from 'src/utils/function';

export default {
  name: 'geoFence',
  components: {
    inputSearch: () => import('src/components/share/Search.vue'),
    ModalConfirm: () => import('../../components/jobs/main/modalConfirm.vue'),
    gMapVue: () => import('../../components/share/gMapVue.vue'),
    tableSetting: () => import('../../components/setting/table/tableSetting.vue')
  },
  data() {
    return {
      SITE_CONFIG: SITE_CONFIG,
      selectedRowKeys: [], // Check here to configure the default column
      tableLoading: false,

      // tab
      keyTab: '1',
      //

      isShowModalRegular: false,
      regularButton: true,

      dataTable: [],
      zoneName: '',
      zoneId: '',
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
      // defaultMarket: [],
      //card
      showCardZone: false,
      editZone: false,
      addZone: false,
      removeZone: false,
      formZone: {
        name: '',
        description: '',
        paths: []
      },
      centerZone: { lat: 1.355257, lng: 103.86788 },
      formModal: {
        btnCancel: '',
        btnActive: '',
        content: ''
      }
    };
  },
  async created() {
    this.$q.loading.show();
    if (!this.userInfo.id) {
      await this.initUserData();
      // await this.initData();
    } else {
      await this.reload();
    }
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
      if (this.zoneName) {
        arr = arr.filter((item) => {
          if (item.name.toString().toLowerCase().includes(this.zoneName.toLowerCase())) {
            return item;
          }
        });
      }
      console.log(arr);
      return arr || [];
    }
  },
  watch: {
    keyTab(val) {
      this.callback(val);
    }
  },

  methods: {
    initUserData() {
      this.$apollo
        .query({
          query: queryMe
        })
        .then((res) => {
          this.$store.dispatch('setUser', _.get(res, 'data.getOneUser', {}));
          this.reload();
        })
        .catch((err) => {
          console.log('err queryMe ::: ', err);
        })
        .finally(() => {
          this.tableLoading = false;
          this.$q.loading.hide();
        });
    },
    async reload() {
      // if (this.keyTab === '1') {
      await this.initData();
      // } else {
      //   await this.initDataAssigned();
      // }
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
      let teamId = this.userInfo?.TlTeamUsers?.[0]?.tl_team_id;
      this.$apollo
        .query({
          query: getAllZonesByTeamId,
          variables: {
            team_id: teamId || null
          },
          fetchPolicy: 'no-cache'
        })
        .then((res) => {
          // this.$store.dispatch('setAllJobsManagement', _.get(res, 'data.allJobs', []));
          if (res && res.data && res.data.getAllZonesByTeamId) {
            this.dataTable = [];
            res.data.getAllZonesByTeamId.map((item) => {
              this.dataTable.push(item);
            });
            // this.pagination.totalItems = res.data.getAllZonesByTeamId.totalItem;
            this.geofenceZones = this.calculatorZone(this.dataTable);
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
    initDataAssigned() {
      this.tableLoading = true;
      this.$apollo
        .query({
          query: getAllocatedJobsUnderTeam,
          variables: {
            td_tenant_id: Number(this.td_tenant_id) || null,
            delivery_window: this.delivery_window || null,
            start_delivery_date: this.startDate || null,
            end_delivery_date: this.endDate || null,
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
                driverUserId: item?.TlTasks[0]?.TlUsers.id
              };
              this.dataTable.push(obj);
            });
            this.pagination.totalItems = res.data.getAllocatedJobsUnderTeam.totalItem;
            this.geofenceZones = res.data.getAllocatedJobsUnderTeam?.geofenceZones;
          }
        })
        .catch((error) => {
          console.log('error ::: ', error);
        })
        .finally(() => (this.tableLoading = false));
    },

    // ====================================================================================
    onSearch(val) {
      console.log(val);
      if (val) {
        this.zoneName = val.trim();
      } else {
        this.zoneName = '';
      }
      // this.initData()
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },

    //=================
    //   show map
    showModalDeleteZone() {
      this.isShowModalRegular = true;
      this.formModal = {
        btnCancel: 'No, cancel',
        btnActive: 'Yes, delete',
        content: `Do you want to delete ${this.formZone.name}? `
      };
      this.removeZone = true;
    },
    handleActive() {
      if (this.removeZone) {
        this.handleDelete();
      }
      if (this.editZone) {
        this.handleCancelCardZone();
      }
    },
    showModalSave() {
      if (this.editZone) {
        this.isShowModalRegular = true;
        this.formModal = {
          btnCancel: 'No, continue editing',
          btnActive: 'Yes, cancel',
          content: `Do you want to quit the process? Zone will not be saved.`
        };
      } else {
        this.handleCancelCardZone();
      }
    },
    //  ==== change Tab======
    async callback(key) {
      if (this.keyTab === '1') {
        await this.initDataAssigned();
      } else {
        await this.initData();
      }
      this.keyTab = key;
    },
    //  === map ===
    calculatorZone(array) {
      let arrayPaths = [];
      array.map((item) => {
        arrayPaths.push(item);
      });
      return arrayPaths;
    },

    //  === add zone ===
    handleAddZone() {
      this.showCardZone = true;
      this.addZone = true;
      this.geofenceZones = this.calculatorZone(this.dataTable);
      this.formZone = {
        name: '',
        description: '',
        paths: []
      };
      this.$refs.tableSetting.handleSetDataSelectedRowKey([]);
    },
    handleEditZone(zone) {
      this.formZone = {
        ...zone
      };
      this.centerZone =
        zone.paths && zone.paths.length > 2 ? zone.paths[0] : { lat: 1.355257, lng: 103.86788 };
      this.geofenceZones = [zone];
      this.showCardZone = true;
      this.editZone = true;
      // this.addZone = false
    },
    handleLocationZone(zone) {
      this.showCardZone = false;
      this.editZone = false;
      this.addZone = false;
      this.formZone = {
        ...zone
      };
      this.centerZone =
        zone.paths && zone.paths.length > 2 ? zone.paths[0] : { lat: 1.355257, lng: 103.86788 };
      this.geofenceZones = [zone];
    },
    handleCancelCardZone() {
      this.isShowModalRegular = false;
      this.showCardZone = false;
      this.formZone = {
        name: '',
        description: '',
        paths: []
      };
      this.removeZone = false;
      this.editZone = false;
      this.addZone = false;
      this.geofenceZones = this.calculatorZone(this.dataTable);
      this.$refs.gMapVue.removePath();
      this.centerZone = { lat: 1.355257, lng: 103.86788 };
    },
    handleConfirmZone() {
      let teamId = this.userInfo?.TlTeamUsers?.[0]?.tl_team_id;
      let form = {
        name: this.formZone.name,
        description: this.formZone.description,
        paths: this.formZone.paths,
        team_id: teamId
      };
      if (this.editZone) {
        this.mutationEditZone(form);
      } else {
        this.mutationAddZone(form);
      }
    },
    handleDelete() {
      let zone_id = (this.formZone && this.formZone.id) || null;
      this.mutationDeleteZone(zone_id);
    },
    mutationEditZone(form) {
      this.$apollo
        .mutate({
          mutation: updateZone,
          variables: {
            zone_id: this.formZone.id,
            data: form
          }
        })
        .then((res) => {
          if (res && res.data && res.data.updateZone) {
            this.handleCancelCardZone();
            this.reload();
            this.$q.notify({
              type: 'positive',
              position: 'top',
              message: `Edit zone successfully.`
            });
          }
        })
        .catch((error) => {
          console.log('error ::: ', error);
        });
    },
    mutationAddZone(form) {
      this.$apollo
        .mutate({
          mutation: addNewZone,
          variables: {
            name: form.name,
            description: form.description,
            paths: form.paths,
            team_id: form.team_id
          }
        })
        .then((res) => {
          if (res && res.data && res.data.addNewZone) {
            this.handleCancelCardZone();
            this.reload();
            this.$q.notify({
              type: 'positive',
              position: 'top',
              message: `Add zone successfully.`
            });
          }
        })
        .catch((error) => {
          console.log('error ::: ', error);
        });
    },
    mutationDeleteZone(zone_id) {
      this.$apollo
        .mutate({
          mutation: deleteZone,
          variables: {
            zone_id: zone_id
          }
        })
        .then((res) => {
          if (res && res.data && res.data.deleteZone) {
            this.handleCancelCardZone();
            this.reload();
            this.isShowModalRegular = false;
            this.$q.notify({
              type: 'positive',
              position: 'top',
              message: `Delete zone successfully.`
            });
          }
        })
        .catch((error) => {
          console.log('error ::: ', error);
        });
    },
    changePaths(arrayPaths) {
      this.formZone.paths = arrayPaths && arrayPaths[0] ? [...arrayPaths[0]] : [];
    },
    handleCancel() {
      this.removeZone = false;
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

//
.text-edit-zone {
  font-weight: 500;
  font-size: 16px;
  color: #66717c;
}

.body-card-zone {
  p {
    font-size: 14px;
    color: #000000;
  }
}

.box-tabs-setting {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 30px;
}

.box-search-setting {
  width: 100%;
}
</style>
