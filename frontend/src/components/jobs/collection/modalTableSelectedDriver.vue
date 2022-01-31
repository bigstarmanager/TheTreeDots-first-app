<template>
  <modalCommon
    v-model="visible"
    :modalTitle="'Assign Driver - Regular Collection'"
    :width="'width: 1230px; max-width: 1230px'"
    :bodyStyle="'height: 675px'"
    @cancel="handleCancel"
  >
    <template #content v-if="visible">
      <div v-if="visible" class="content-select">
        <q-table
          class="table-ctrl"
          style="padding: 10px; height: 65vh"
          virtual-scroll
          :data="listData"
          :columns="columns"
          row-key="id"
          ref="table"
          :bordered="false"
          :flat="false"
          hide-bottom
        >
          <template v-slot:body="props">
            <q-tr :props="props" :class="props.expand ? 'bg-selected-modal' : ''">
              <q-td>
                <q-btn
                  size="sm"
                  round
                  dense
                  @click="props.expand = !props.expand"
                  :icon="props.expand ? 'arrow_drop_up' : 'arrow_drop_down'"
                ></q-btn>
              </q-td>

              <q-td key="driver" :props="props">
                <span>{{ props.row.label }}</span>
              </q-td>

              <q-td key="totalAssignedZone" :props="props">
                <span>
                  {{ props.row.totalAssignedZone }}
                </span>
              </q-td>

              <q-td key="totalAssignedPoints" :props="props">
                <span>
                  {{ props.row.totalAssignedPoints }}
                </span>
              </q-td>

              <q-td key="totalAssignedInvoice" :props="props">
                <span>
                  {{ props.row.totalAssignedInvoice }}
                </span>
              </q-td>

              <q-td key="action" :props="props">
                <q-radio v-model="selectedDriver" :val="props.row.value" @input="changeRadio">
                  Select Driver
                </q-radio>
              </q-td>
            </q-tr>

            <!-- expand -->
            <q-tr v-show="props.expand" :props="props" :class="props.expand ? 'bg-selected-modal' : ''">
              <q-td colspan="100%">
                <template v-for="(item, index) of props.row.dataZone">
                  <div style="display: flex" :key="index">
                    <div style="width: 200px"></div>
                    <div style="width: 250px">
                      <p>{{ item.zone.name }}</p>
                    </div>
                    <div style="width: 250px">
                      <p>{{ item.countPoint || 0 }} Points</p>
                    </div>
                    <div style="width: 250px">
                      <p>{{ item.countInvoice || 0 }} Invoices</p>
                    </div>
                  </div>
                </template>
              </q-td>
            </q-tr>
            <!-- expand -->
          </template>
        </q-table>
      </div>

      <div class="action" style="margin-top: 10px">
        <div>
          <div style="float: right">
            <q-btn
              style="margin-right: 15px"
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
              :disabled="!selectedDriver"
              no-wrap
              dense
              no-caps
              padding="0.5rem 1rem"
              color="button-fill-active"
              @click="handleOK()"
            >
              <span>{{ titleButtonOk }}</span>
            </q-btn>
          </div>
        </div>
      </div>
    </template>
  </modalCommon>
</template>

<script>
import selectedTable from './selectedTable.vue';
import { SITE_CONFIG } from 'src/config/site.config';
import { regCollectionModalSelectedDriver } from '../../../constants/jobs/index';

export default {
  name: 'modalTableSelectedDriver',
  data() {
    return {
      SITE_CONFIG,
      modalTitle: '',
      modalArray: [],
      modalData: {},
      modalUpdate: {},
      isValue: false,
      columns: [...regCollectionModalSelectedDriver],
      selectedDriver: '',
      scrollDefault: {
        x: 1100,
        y: 500
      }
    };
  },
  components: {
    selectedTable
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
      this.$emit('tableOK', this.selectedDriver);
      //this.isSHowModal = true;
    },
    handleCancel() {
      this.$emit('tableCancel', true);
      // this.$emit('update:show', false);
      this.visible = false;
    },
    handleBack() {
      this.visible = false;
    },
    emitAssign(item) {
      this.$emit('emitAssign', item);
    },
    changeRadio(value, evt) {
      console.log(value);
      // this.selectedDriver = value;
    }
  }
};
</script>

<style lang="scss" scoped>
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
.myclass td:hover:before {
  display: none;
}
</style>
>
