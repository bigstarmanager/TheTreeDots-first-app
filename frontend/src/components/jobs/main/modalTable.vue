<template>
  <div class="q-pa-xl">
    <modalCommon
      v-model="visible"
      :modalTitle="'Primary 3PL Allocation'"
      :bodyStyle="'height : 675px'"
      :width="'width : 1550px; max-width: 1600px'"
      @cancel="handleCancel"
    >
      <template #content>
        <div class="content" v-if="visible">
          <div v-if="visible" class="content-select">
            <selected-table :list-data="listData" :listSupplier="listSupplier" @emitAssign="emitAssign">
            </selected-table>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="content" style="margin: 2vh 2vw 2vh 2vw">
          <div class="action">
            <div>
              <q-btn
                :disabled="false"
                no-wrap
                dense
                no-caps
                flat
                padding="0.5rem 1rem"
                color="color-main"
                @click="handleBack()"
              >
                <span>Back</span>
              </q-btn>
            </div>

            <div>
              <q-btn
                :disabled="false"
                no-wrap
                dense
                no-caps
                flat
                padding="0.5rem 1rem"
                color="color-main"
                @click="handleCancel()"
                style="margin-right: 1vw"
              >
                <span>Cancel</span>
              </q-btn>

              <q-btn
                :disabled="false"
                no-wrap
                dense
                no-caps
                padding="0.5rem 1rem"
                color="button-fill-active"
                @click="handleOK()"
              >
                <span> {{ titleButtonOk }}</span>
              </q-btn>
            </div>
          </div>
        </div>
      </template>
    </modalCommon>
  </div>
</template>

<script>
// import { SITE_CONFIG } from '../../../config/site.config';
export default {
  name: 'index',
  data() {
    return {
      modalArray: [],
      modalData: {},
      modalUpdate: {},
      isValue: false
    };
  },
  components: {
    selectedTable: () => import('src/components/jobs/main/selectedTable.vue'),
    singleSelect: () => import('components/jobs/main/singleSelect.vue'),
    inputSearch: () => import('src/components/share/Search.vue'),
    selectSearch: () => import('src/components/jobs/main/selectSearch.vue')
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    listData: {
      type: Array,
      default() {
        return [];
      }
    },
    listSelectZone: {
      type: Array,
      default() {
        return [];
      }
    },
    listSupplier: {
      type: Array,
      default() {
        return [];
      }
    },
    arrayProps: {
      type: Array,
      default() {
        return [];
      }
    },
    titleButtonOk: {
      type: String,
      default: 'Confirm and Send'
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
  created() {
    if (this.arrayProps) this.modalArray = this.arrayProps;
  },
  methods: {
    handleOK() {
      this.$emit('tableOK', true);
      //this.isSHowModal = true;
    },
    handleCancel() {
      // this.visible = false;
      this.$emit('tableCancel', true);
      // this.$emit('update:show', false);
    },
    handleBack() {
      this.visible = false;
    },
    emitAssign(item) {
      this.$emit('emitAssign', item);
    }
  }
};
</script>

<style lang="scss">
.content {
  .action {
    display: flex;
    justify-content: space-between;
  }

  &-select {
    display: flex;
    justify-content: space-around;
    width: 100%;
  }
}
</style>
>
