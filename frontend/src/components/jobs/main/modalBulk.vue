<template>
  <modalCommon
    v-model="isOpenModal"
    :modalTitle="modalTitle"
    :bodyStyle="bodyStyle"
    :width="width"
    @cancel="handleCancel"
  >
    <template #content>
      <div class="content" v-if="visible">
        <template v-if="isOpenModal">
          <div class="row">
            <div
              v-if="selectedSingleItem ? checkAllocation(selectedSingleItem, 3) : true"
              style="padding: 10px"
              class="col-6"
            >
              <p>Packing Allocation</p>
              <select-modal
                :dataProps="modalArray"
                :defaultValue="modalUpdate.packingAllocation"
                @updateData="handleEmit"
                placeholder="Packing Allocation"
                width="width:220px"
                no-caps
                :size="'medium'"
                outlined
              />
            </div>
            <div
              v-if="selectedSingleItem ? checkAllocation(selectedSingleItem, 4) : true"
              style="padding: 10px"
              class="col-6"
            >
              <p>Delivery Allocation</p>
              <select-modal
                :dataProps="modalArray"
                @updateData="handleEmit2"
                placeholder="Delivery Allocation"
                width="width:220px"
                :defaultValue="modalUpdate.deliveryAllocation"
                size="medium"
                outlined
              />
            </div>
            <div
              v-if="selectedSingleItem ? checkAllocation(selectedSingleItem, 1) : true"
              style="padding: 10px"
              class="col-6"
            >
              <p>Collection Allocation</p>
              <select-modal
                :dataProps="modalArray"
                @updateData="handleEmitCollection"
                placeholder="Collection Allocation"
                width="width:220px"
                :defaultValue="modalUpdate.collectionAllocation"
                size="medium"
                outlined
              />
            </div>
          </div>
          <!--          <div class="content-select">-->
          <!--          </div>-->
        </template>
      </div>
    </template>
    <template #footer>
      <div class="action row justify-end q-pa-lg">
        <div>
          <q-btn
            :disabled="false"
            no-wrap
            dense
            no-caps
            flat
            padding="0.5rem"
            color="color-main"
            @click="handleCancel()"
          >
            <span>Cancel</span>
          </q-btn>
        </div>
        <div class="q-ml-md">
          <q-btn
            :disabled="!isValue"
            no-wrap
            dense
            no-caps
            padding="0.5rem 1rem"
            :color="isValue ? 'button-fill-active' : 'button-fill-disable'"
            @click="handleOk()"
          >
            <span>{{ titleButtonOk }}</span>
          </q-btn>
        </div>
      </div>
    </template>
    <!-- <modal-confrim
     :show.sync="isSHowModal"
       title-props="Are you sure?"
       textProps="You will send assignements to Primary 3PL. Are you sure you want to send it?"
       @updateData="handleConfirm"
     /> -->
  </modalCommon>
</template>

<script>
export default {
  components: { selectModal: () => import('src/components/jobs/main/singleSelect.vue') },
  name: 'modalBulkAssign',
  data() {
    return {
      modalArray: [],
      modalData: {},
      modalUpdate: {
        packingAllocation: null,
        deliveryAllocation: null,
        collectionAllocation: null
      },
      isValue: false,
      isSHowModal: false
    };
  },
  props: {
    isOpenModal: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: 'width: 600px'
    },
    bodyStyle: {
      type: String,
      default: 'height: 400px'
    },
    modalTitle: {
      type: String,
      default: ''
    },
    dataProps: {
      type: Object,
      default() {
        return {};
      }
    },
    selectedSingleItem: {
      type: Object,
      default() {
        return null;
      }
    },
    // defaultModalUpdate: {
    //   type: Object,
    //   default() {
    //     return {
    //       packingAllocation: '',
    //       deliveryAllocation: ''
    //     };
    //   }
    // },
    arrayProps: {
      type: Array,
      default() {
        return [];
      }
    },
    titleProps: {
      type: String,
      default: ''
    },
    titleButtonOk: {
      type: String,
      default: 'Send assignment'
    },
    isCheckValue: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    visible: {
      get: function () {
        return this.isOpenModal;
      },
      set: function (val) {
        this.$emit('update:isOpenModal', val);
      }
    }
  },
  watch: {
    dataProps(val) {
      this.modalData = val;
    },
    titleProps(val) {
      this.modalTitle = val;
    },
    arrayProps(val) {
      this.modalArray = val;
    }
    // show(val) {
    //   console.log(val)
    // }
  },

  created() {
    if (this.dataProps) this.modalData = this.dataProps;
    if (this.titleProps) this.modalTitle = this.titleProps;
    if (this.arrayProps) this.modalArray = this.arrayProps;
  },
  methods: {
    handleOk() {
      this.$emit('updateData', this.modalUpdate);
      //this.isSHowModal = true;
    },
    handleCancel() {
      this.visible = false;
      this.isValue = false;
      this.modalUpdate = { packingAllocation: null, deliveryAllocation: null, collectionAllocation: null };
      this.$emit('handleCancel');
      // this.$emit('update:show', false);
    },

    handleEmit(value) {
      this.modalUpdate.packingAllocation = value;
      this.checkValue();
    },
    handleEmit2(value) {
      this.modalUpdate.deliveryAllocation = value;
      this.checkValue();
    },
    handleEmitCollection(value) {
      this.modalUpdate.collectionAllocation = value;
      this.checkValue();
    },
    checkValue() {
      if (this.selectedSingleItem) {
        if (this.checkAllocation(this.selectedSingleItem, 3)) {
          this.isValue = this.modalUpdate?.packingAllocation?.value !== '';
        }
        if (this.checkAllocation(this.selectedSingleItem, 4)) {
          this.isValue = this.modalUpdate?.deliveryAllocation?.value !== '';
        }
        if (this.checkAllocation(this.selectedSingleItem, 1)) {
          this.isValue = this.modalUpdate?.collectionAllocation?.value !== '';
        }
      } else {
        this.isValue =
          this.modalUpdate?.packingAllocation?.value !== '' &&
          this.modalUpdate?.deliveryAllocation?.value !== '' &&
          this.modalUpdate?.collectionAllocation?.value !== '';
      }
    },
    setDefaultValueModal(val) {
      this.modalUpdate = { ...val };
    },
    handleConfirm(value) {
      this.isSHowModal = value;
      this.$emit('updateData', this.modalUpdate);
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
    }
  }
};
</script>

<style lang="scss">
.content {
  .action {
    text-align: right;
  }

  &-select {
  }
}

.custom-button {
  margin-top: 60px;
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
  margin-top: 60px;
  color: rgba(4, 86, 90, 1);
  border: none;
  box-shadow: none;
  padding: 0 30px;

  &:hover {
    color: rgba(4, 86, 90, 1);
    background: transparent;
    border: none;
  }
  ::before {
    box-shadow: none;
  }
}
</style>
