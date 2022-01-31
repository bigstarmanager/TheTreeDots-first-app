<template>
  <modalCommon
    v-model="visible"
    :modalTitle="modalTitle"
    :bodyStyle="bodyStyle"
    :width="width"
    @cancel="handleCancel"
  >
    <template #content>
      <div class="content">
        <div class="content-select">
          <p>{{ textProps }}</p>
          <slot></slot>
        </div>
      </div>
    </template>
    <template #footer>
      <div v-if="singleAssign" class="action row justify-end q-pa-lg">
        <div>
          <q-btn no-wrap dense no-caps flat padding="0.5rem" color="color-main" @click="handleCancel()">
            <span>{{ titleBtnCancelSingleAssign }}</span>
          </q-btn>
        </div>
        <div class="q-ml-md">
          <q-btn no-wrap dense no-caps padding="0.5rem 1rem" :color="colorBtn" @click="handleOk1()">
            <span>{{ titleBtnActiveSingleAssign }}</span>
          </q-btn>
        </div>
      </div>

      <div v-else class="action row justify-end q-pa-lg">
        <div>
          <q-btn no-wrap dense no-caps flat padding="0.5rem" color="dark" @click="handleCancel()">
            <span>No, continue editing</span>
          </q-btn>
        </div>
        <div class="q-ml-md">
          <q-btn no-wrap dense no-caps padding="0.5rem 1rem" color="negative" @click="handleOk2()">
            <span>Yes, cancel</span>
          </q-btn>
        </div>
      </div>
    </template>
  </modalCommon>
</template>

<script>
export default {
  name: 'modalConfirm',
  data() {
    return {};
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: 'width:600px'
    },
    modalTitle: {
      type: String,
      default: 'Are you sure?'
    },
    textProps: {
      type: String,
      default:
        'You will cancel this process. You will have to redo the process from the beginning if you cancel it.'
    },
    titleBtnActiveSingleAssign: {
      type: String,
      default: 'Yes, Send Assignment'
    },
    titleBtnCancelSingleAssign: {
      type: String,
      default: 'No, Cancel'
    },
    singleAssign: {
      type: Boolean,
      default: false
    },
    bodyStyle: {
      type: String,
      default: 'height : 160px'
    },
    colorBtn: {
      type: String,
      default: 'button-fill-active'
    }
  },
  computed: {
    visible: {
      get() {
        return this.show;
      },
      set(val) {
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
    show(val) {
      this.selectModal = {};
      this.isValue = false;
    }
  },

  created() {
    if (this.dataProps) this.modalData = this.dataProps;
    if (this.arrayProps) this.modalArray = this.arrayProps;
  },
  methods: {
    handleOk1() {
      this.$emit('modalConfirmAssign', false);
      // this.$emit('update:show', false);
    },
    handleOk2() {
      this.$emit('modalConfirmCancel', false);
      // this.$emit('update:show', false);
    },
    handleCancel() {
      // this.$emit('updateData', false);
      this.$emit('handleCancel', false);
      this.visible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  .action {
    text-align: right;
  }

  p {
    font-size: 15px;
  }

  &-select {
    padding: 16px 25px;
  }
}

.custom-button {
  margin-top: 30px;
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
  margin-top: 30px;
  margin-right: 15px;
  color: black;
  border: none;
  box-shadow: none !important;
  padding: 0 30px;

  &:hover {
    color: black;
    border: none;
  }

  ::before {
    box-shadow: none;
  }
}

.custom-button3 {
  margin-top: 30px;
  background: rgba(188, 0, 0, 1);
  color: white;
  border: none;
  box-shadow: none;
  padding: 0 30px;

  &:hover {
    background: rgba(188, 0, 0, 1);
    color: white;
    border: none;
  }
}
</style>
