<template>
  <div class="q-pa-md q-gutter-sm">
    <!-- width -->
    <q-dialog v-model="isOpenModal">
      <q-card :style="width">
        <!-- Title Modal -->
        <div v-if="header">
          <q-toolbar style="border-bottom: 1px solid #d4d4d4">
            <q-toolbar-title v-if="modalTitle" class="modal-common-title">
              <div class="text-h6">{{ modalTitle }}</div>
            </q-toolbar-title>
            <q-btn
              v-if="iconCloseModal"
              flat
              round
              dense
              :icon="iconCloseModal"
              v-close-popup
              @click="handleCancel"
              class="q-mx-md"
            />
          </q-toolbar>
        </div>

        <div v-else class="modal-header">
          <slot name="header"></slot>
        </div>

        <!-- Body -->
        <div :style="bodyStyle" :class="modalContent">
          <slot name="content"></slot>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'modalCommon',
  data() {
    return {};
  },
  props: {
    modalTitle: {
      type: String,
      required: false,
      default: 'Title'
    },
    iconCloseModal: {
      type: String,
      required: false,
      default: 'close'
    },
    bodyStyle: {
      type: String,
      required: false,
      default: 'height:210px'
    },
    modalContent: {
      type: String,
      required: false,
      default: 'modal-content'
    },
    width: {
      type: String,
      required: false,
      default: 'width:600px'
    },
    header: {
      type: Boolean,
      default: true
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isOpenModal: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('update:input', val);
      }
    }
  },
  methods: {
    handleCancel() {
      this.$emit('cancel', false);
    }
  }
};
</script>

<style lang="scss">
.modal-content {
  margin: 2vh 2vw 2vh 2vw;
}
.modal-common-title {
  padding: 20px 0;
  padding-left: 30px !important;
}
.modal-common-close {
  padding: 20px 0;
  padding-left: 30px !important;
}
</style>
