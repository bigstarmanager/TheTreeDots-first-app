<template>
  <div>
    <modalCommon
      v-model="visible"
      :width="'width: 1230px; max-width: 1230px'"
      :bodyStyle="'height: 675px: padding: 0'"
      :iconCloseModal="''"
      :header="false"
      modal-content="modal-content-map"
    >
      <template #header>
        <div class="row header-modal-map">
          <q-toolbar-title>
            <div class="text-h6" style="margin-top: 10px">Assign Driver - Back To Back</div>
          </q-toolbar-title>

          <div class="action">
            <q-btn
              v-if="!tabActive"
              :disabled="false"
              style="margin-right: 15px; z-index: 4"
              no-wrap
              dense
              no-caps
              flat
              padding="0.5rem 1rem"
              color="color-main"
              @click="showModalConfirm()"
            >
              <span>Cancel</span>
            </q-btn>

            <q-btn
              :disabled="false"
              no-wrap
              dense
              no-caps
              padding="0.5rem 1rem"
              outline
              color="button-border-active"
              @click="handleCancel()"
              style="margin-right: 15px; z-index: 4"
            >
              <span>{{ tabActive ? 'Cancel' : 'Back' }}</span>
            </q-btn>

            <q-btn
              v-if="tabActive"
              :disabled="tabActive && !dataRenderListPaths"
              size="medium"
              no-wrap
              dense
              no-caps
              padding="0.5rem 1rem"
              :color="tabActive && !dataRenderListPaths ? 'button-fill-disable' : 'button-fill-active'"
              style="z-index: 4"
              @click="handleOK()"
            >
              <span>Review</span>
            </q-btn>

            <q-btn
              v-else
              :loading="loading"
              size="medium"
              padding="0.5rem 1rem"
              @click="handleOK()"
              color="button-fill-active"
              style="z-index: 4"
            >
              <span>Confirm and Assign</span>
            </q-btn>
          </div>
        </div>
      </template>

      <template #content>
        <div class="content" v-if="visible">
          <mapList
            v-if="tabActive"
            class="content-list"
            :array-props="drivers"
            :get-list-zone="listPaths"
            @updateListPath="updateListPath"
          ></mapList>

          <listDriveGMap
            v-if="!tabActive && dataRenderListPaths"
            class="content-list"
            :array-props="drivers"
            :get-list-zone="listPaths"
          ></listDriveGMap>

          <div class="content-select">
            <gMapVue
              styleCustom="width: 1230px;min-height:670px"
              :default-market="listMarket"
              :default-paths="listPaths"
              :editable="true"
              @handleClickMap="handleClickMarket"
            ></gMapVue>
          </div>

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
                  <q-btn
                    no-wrap
                    dense
                    no-caps
                    flat
                    padding="0.5rem"
                    color="dark"
                    @click="handleConfirmContinue()"
                  >
                    <span>No, continue editing</span>
                  </q-btn>
                </div>
                <div class="q-ml-md">
                  <q-btn
                    no-wrap
                    dense
                    no-caps
                    padding="0.5rem 1rem"
                    color="negative"
                    @click="handleConfirmCancel()"
                  >
                    <span>Yes, cancel</span>
                  </q-btn>
                </div>
              </div>
            </template>
          </modalCommon>
        </div>
      </template>
    </modalCommon>

    <modal-single-select
      :key="isShowModalAssign"
      :show.sync="isShowModalAssign"
      :title-props="''"
      :array-props="drivers"
      :bodyStyle="getPath === '/jobs/deliveries' ? 'height: 150px' : 'height: 200px'"
      :defaultModalUpdate="isSelectedMarket && isSelectedMarket.driverUserId"
      @updateData="mutationDriver"
      ref="ModalSingleSelect"
    >
      <template #top>
        <div style="margin-bottom: 20px">
          <template v-if="getPath === '/jobs/deliveries'">
            <div>
              <strong>{{ isSelectedMarket.receipient }} : {{ isSelectedMarket.td_invoice_id }}</strong>
            </div>
            <div>
              {{ isSelectedMarket.location }}
            </div>
          </template>
          <template v-else>
            <div>
              <span>Collection:</span>
            </div>
            <div>
              <strong>{{ isSelectedMarket.supplier_name }} : {{ isSelectedMarket.td_invoice_id }}</strong>
            </div>
            <div>
              {{ isSelectedMarket.collection_location }}
            </div>
            <hr />
            <div>
              <span>Delivery:</span>
            </div>
          </template>
        </div>
      </template>
    </modal-single-select>
  </div>
</template>

<script lang="js">
import {SITE_CONFIG} from '../../../config/site.config';

const pointInPolygon = require('point-in-polygon');

export default {
  name: 'modalGMap',
  data() {
    return {
      SITE_CONFIG,
      modalTitle: '',
      isValue: false,
      isShowModalAssign: false,
      isSelectedMarket: null,
      tabActive: true,
      titleSingleSelect: '',
      dataRenderListPaths: null,
      dataRenderListMarket: null,
      loading : false,
      isShowModalConfirm: false
    };
  },
  components: {
    gMap: () => import('../../share/googleMap'),
    gMapVue: () => import('../../share/gMapVue'),
    mapList: () => import('../../share/mapList.vue'),
    listDriveGMap: () => import('../../share/listDriveGMap.vue'),
    ModalSingleSelect: () => import('../../../components/jobs/modal/modalSingleSelect.vue')
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    defaultPaths: {
      type: Array,
      default() {
        return [];
      }
    },
    driverUserId: {
      type: Object,
      default() {
        return { value: '', label: 'All Driver' }
      }
    },
    drivers: {
      type: Array,
      default() {
        return [];
      }
    },
    titleButtonOk: {
      type: String,
      default: 'Confirm and Send'
    },
    defaultMarket: {
      type: Array,
      default() {
        return []
      }
    },

  },
  computed: {
    visible: {
      get: function () {
        return this.show;
      },
      set: function (val) {
        this.$emit('update:show', val);
      }
    },
    listPaths: {
      get() {
        let arrayPaths = []
        if (this.defaultPaths) {
          arrayPaths = []
          this.defaultPaths.map((item) => {
            if (this.checkPaths(item.paths).check) {
              arrayPaths.push({
                ...item,
                totalItem: this.checkPaths(item.paths).totalItem,
                driverUserId: this.driverUserId
              })
            }
          })
        }
        if (this.dataRenderListPaths) {
          arrayPaths = [...this.dataRenderListPaths]
        }
        return arrayPaths
      },
      set(val) {
        this.dataRenderListPaths = val
        return val
      }
    },
    listMarket: {
      get() {
        let arrayPaths = []
        if (this.defaultMarket) {
          arrayPaths = [...this.defaultMarket]
        }
        if (this.listPaths) {
          arrayPaths = []
          this.listPaths.map((item) => {
            let arr = [...item.totalItem]
            arrayPaths = arrayPaths.concat(arr)
          })
        }
        if (this.dataRenderListMarket) {
          arrayPaths = [...this.dataRenderListMarket]
        }
        return arrayPaths
      },
      set(val) {
        this.dataRenderListMarket = val
        return val
      }
    },
    getPath() {
      return this.$route.path
    }
  },
  created() {
  },
  methods: {
    handleOK() {
      if (this.tabActive) {
        this.tabActive = false
      } else {
        this.$emit('mutationAllDriver', this.listMarket);
      }
      //this.isSHowModal = true;
    },
    handleCancel() {
      if (!this.tabActive) {
        this.tabActive = true
      } else {
        this.handleBack()
      }
    },
    showModalConfirm(){
      this.isShowModalConfirm = true
    },
    handleConfirmCancel(){
      this.isShowModalConfirm = false;
      this.dataRenderListPaths = null
      this.dataRenderListMarket = null
      this.visible = false
      this.tabActive = true

      this.$emit('update:show', false);
      this.$emit('tableCancel', true);
    },
    handleConfirmContinue(){
      this.isShowModalConfirm = false
    },
    handleBack() {
      // this.visible = false
      if(this.tabActive){
        this.$emit('tableCancel', true);
      }
      this.tabActive = true
      this.dataRenderListPaths = null
      this.dataRenderListMarket = null
      // this.$emit('update:show', false);
    },
    emitAssign(item) {
      this.$emit('emitAssign', item)
    },
    //
    objectToArray(object) {
      let arr = []
      if (object.lat) arr.push(object.lat)
      if (object.lng) arr.push(object.lng)
      return arr
    },
    convertPath(array) {
      let newArrayPaths = []
      array.map((item) => {
        newArrayPaths.push(this.objectToArray(item))
      })
      return newArrayPaths
    },
    convertMarket(array) {
      let newArrayPaths = []
      array.map((item) => {
        newArrayPaths.push({
          ...item,
          convertMarkets: this.objectToArray(item.latlngInvoices),
        })
      })
      return newArrayPaths
    },
    checkPaths(paths) {
      let newPaths = this.convertPath(paths)
      let newMarket = this.convertMarket(this.defaultMarket)
      let check = false
      let totalItem = []
      newMarket.map((item) => {
        if (!check) {
          check = pointInPolygon(item.convertMarkets, newPaths)
        }
        if (pointInPolygon(item.convertMarkets, newPaths)) {
          // totalItem += 1
          totalItem.push(item)
        }
      })
      return {
        check: check,
        totalItem: totalItem,
      }
    },
    mutationDriver(id) {
      this.listMarket.forEach((item) => {
        if (item.id === this.isSelectedMarket.id) {
          return item.driverUserId = id
        }
      })
      this.isShowModalAssign = false
    },
    handleClickMarket(value) {
      if (!this.tabActive) {
        this.titleSingleSelect = `Assign Driver ${value.recipient} ?`
        this.isSelectedMarket = value
        this.isShowModalAssign = true
      }
    },
    closeSelectMarket() {
      this.isShowModalAssign = false
      this.isSelectedMarket = null
      this.$refs.ModalSingleSelect.handleCancel()
    },
    updateListPath(value) {
      this.listPaths = value
    },
    setLoading(boolean) {
      this.loading = boolean
    }
  }
}
</script>

<style lang="scss" scoped>
.title-gmap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action {
  //position: absolute;
  //right: 0;
  //padding: 16px 35px;
  .custom-button {
    background: rgba(4, 86, 90, 1);
    color: white;

    &:hover {
      background: rgba(4, 86, 90, 1);
      color: white;
    }

    &:focus {
      background: rgba(4, 86, 90, 1);
      color: white;
    }
  }

  .custom-button2 {
    color: rgba(4, 86, 90, 1);
    border: none;
    box-shadow: none;
    padding: 0 30px;

    &:hover {
      color: rgba(4, 86, 90, 1);
      border: none;
    }
  }
  .buttonDisable {
    border-color: #a2acb5 !important;
    background: #a2acb5 !important;
    //height: 36px;
    //padding: 6px 12px;

    span {
      color: white;
      //margin-left: 10px;
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
}
.q-dialog__inner--minimized > div {
  max-width: 1230px !important;
}

.content {
  position: relative;

  &-select {
    display: flex;
    justify-content: space-around;
    width: 100%;
  }

  &-list {
    position: absolute;
    z-index: 3;
  }
}

.header-modal-map {
  padding: 10px 30px;
}
.modal-content-map {
  margin: 0vh 2vw 2vh 2vw;
}
</style>
