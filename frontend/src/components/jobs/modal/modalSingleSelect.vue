<template>
  <modalCommon
    :value.sync="visible"
    :modalTitle="titleProps"
    :width="'width: 500px'"
    :bodyStyle="bodyStyle"
    :header="titleProps !== ''"
    @cancel="handleCancel"
  >
    <template #content>
      <div class="content" v-if="visible">
        <slot name="top"></slot>
        <div v-if="show" class="content-select">
          <select-modal
            :dataProps="modalArray"
            :defaultValue="modalUpdate"
            @updateData="handleEmit"
            width="width:430px"
            size="medium"
            outlined
          />
        </div>
        <slot name="bottom"></slot>
      </div>
    </template>

    <template #footer>
      <div class="footer" style="float: right; margin-right: 15px; margin-bottom: 15px">
        <q-btn
          :disabled="false"
          no-wrap
          dense
          no-caps
          flat
          padding="0.5rem 1rem"
          size="medium"
          color="color-main"
          @click="handleCancel()"
        >
          <span>Cancel</span>
        </q-btn>

        <q-btn
          :disabled="!modalUpdate || (modalUpdate && !modalUpdate.value)"
          no-wrap
          dense
          no-caps
          size="medium"
          padding="0.5rem 1rem"
          style="margin-left: 10px"
          color="button-fill-active"
          @click="handleOk()"
        >
          <span>{{ titleButtonOk }}</span>
        </q-btn>
      </div>
    </template>
  </modalCommon>
  <!-- <modal-confrim
     :show.sync="isSHowModal"
       title-props="Are you sure?"
       textProps="You will send assignements to Primary 3PL. Are you sure you want to send it?"
       @updateData="handleConfirm"
     /> -->
</template>

<script>
var visible;

import { SITE_CONFIG } from '../../../config/site.config';
import selectModal from '../main/singleSelect.vue';

export default {
  components: { selectModal },
  name: 'modalSingleSelect',
  data() {
    return {
      SITE_CONFIG,
      modalTitle: 'Select Table',
      modalArray: [],
      modalData: {},
      modalUpdate: '',
      isValue: false,
      isSHowModal: false,
      loading: false
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false
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
    defaultModalUpdate: {
      type: Object,
      default() {
        return {};
      }
    },
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
      default: 'Send'
    },
    bodyStyle: {
      type: String,
      default: 'height: 100px'
    },
    isCheckValue: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    visible: {
      get: function () {
        return this.show;
      },
      set: function (val) {
        this.$emit('update:show', val);
      }
    }
  },
  watch: {
    dataProps(val) {
      this.modalData = val;
    },

    arrayProps(val) {
      this.modalArray = val;
    },
    defaultModalUpdate: {
      deep: true,
      handler(val) {
        this.modalUpdate = val;
      }
    }
    // defaultModalUpdate(val) {
    //   this.modalUpdate = val
    // }
  },

  created() {
    if (this.dataProps) this.modalData = this.dataProps;
    if (this.arrayProps) this.modalArray = this.arrayProps;
    if (this.defaultModalUpdate) this.modalUpdate = this.defaultModalUpdate;
    // this.modalUpdate = 'All Driver';
  },
  methods: {
    handleOk() {
      this.$emit('updateData', this.modalUpdate);
      //this.isSHowModal = true;
    },
    handleCancel() {
      this.visible = false;
      this.isValue = false;
      this.modalUpdate = null;
      this.$emit('handleCancel');
      this.$emit('update:show', false);
    },
    handleEmit(value) {
      // console.log(typeof value ,value)
      this.modalUpdate = value;
    },
    setLoading(boolean) {
      this.loading = boolean;
    }
  }
};
</script>

<style lang="scss" scoped></style>
