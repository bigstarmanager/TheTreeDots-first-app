<template>
  <div>
    <q-table
      class="table-ctrl"
      style="padding: 10px; height: 68vh"
      virtual-scroll
      :data="dataRender"
      :columns="columns"
      row-key="id"
      ref="table"
      :bordered="false"
      :flat="false"
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
    >
      <template v-slot:top>
        <div class="row justify-between" style="width: 100%">
          <div class="col row">
            <strong class="q-py-sm"> Services added to {{ listData.length }} invoices</strong>
            <div class="q-px-lg" style="width: 150px">
              <selectSearch
                :data-props="listSupplier"
                width="width:150px"
                placeholder="All Supplier"
                :defaultValue="{ value: '', label: 'All Supplier' }"
                @updateData="selectSupplier"
              />
            </div>
          </div>
          <div class="col">
            <inputSearch
              placeholder="Search invoice number"
              style="width: 300px; padding: 0 1rem; float: right"
              v-model="td_invoice_id"
              @outputSearch="onSearch"
            />
          </div>
        </div>
      </template>

      <template v-slot:body="props">
        <slot name="loading">
          <q-tr :props="props">
            <q-td key="supplier" :props="props">
              <span>
                {{ $splitString(props.row.supplier_name, 15) }}
                <q-tooltip v-if="props.row.supplier_name && props.row.supplier_name.length > 15">
                  {{ props.row.supplier_name }}
                </q-tooltip>
              </span>
            </q-td>
            <q-td key="invoices" :props="props">
              <span>{{ props.row.td_invoice_id }}</span>
            </q-td>
            <q-td key="zone" :props="props">
              <span>
                {{ props.row.zones }}
              </span>
            </q-td>
            <q-td key="Qty" :props="props">
              <span>
                {{ props.row.qty }}
              </span>
            </q-td>
            <q-td key="deliveryDate" :props="props">
              <span>
                {{ getTimeStamp(props.row.delivery_date) }}
              </span>
            </q-td>
            <q-td key="deliveryWindow" :props="props">
              <span>
                {{ props.row.delivery_window }}
              </span>
            </q-td>
            <q-td key="vehicleType" :props="props">
              <span>
                {{ props.row.vehicle_requirement }}
              </span>
            </q-td>
            <q-td key="packingAllocation" :props="props">
              <span>
                <template v-if="checkAllocation(props.row, 3)">
                  <span style="color: #04565a">{{ props.row.packingAllocation }}</span>
                </template>
                <template v-else>
                  <span style="color: #66717c">N/A</span>
                </template>
              </span>
            </q-td>
            <q-td key="deliveryAllocation" :props="props">
              <span>
                <template v-if="checkAllocation(props.row, 4)">
                  <span style="color: #04565a">{{ props.row.deliveryAllocation }}</span>
                </template>
                <template v-else>
                  <span style="color: #66717c">N/A</span>
                </template>
              </span>
            </q-td>
            <q-td key="collectionAllocation" :props="props">
              <span>
                <template v-if="checkAllocation(props.row, 1)">
                  <span style="color: #04565a"> {{ props.row.collectionAllocation }}</span>
                </template>
                <template v-else>
                  <span style="color: #66717c">N/A</span>
                </template>
              </span>
            </q-td>
            <q-td key="action" :props="props">
              <div class="btn-pointer" @click="emitAssign(props.row)" style="color: red">Remove</div>
            </q-td>
          </q-tr>
        </slot>
      </template>
    </q-table>
  </div>
</template>

<script>
import { SITE_CONFIG } from '../../../config/site.config';
import singleSelect from './singleSelect.vue';
import { selectedTableColumns, fieldAssign } from '../../../constants/masterFranchise/index';
import { changeTimeStamp } from '../../../utils/function';

export default {
  name: 'selectedTable',
  props: {
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
    }
  },
  computed: {
    dataRender() {
      let arr = [];
      if (this.listData) {
        this.listData.map((item) => {
          arr.push({ ...item });
        });
        if (this.zoneId) {
          arr = arr.filter((item) => {
            return item.zones === this.zoneId;
          });
        }
        if (this.supplierId) {
          arr = arr.filter((item) => {
            console.log(item);
            return item.td_tenant_id === this.supplierId;
          });
        }
        if (this.td_invoice_id) {
          arr = arr.filter((item) => {
            if (item.td_invoice_id.toString().toLowerCase().includes(this.td_invoice_id)) {
              return item;
            }
          });
        }
      }
      return arr || [];
    }
  },
  watch: {
    td_invoice_id(value) {
      this.onSearch(value);
    }
  },
  data() {
    return {
      SITE_CONFIG,
      // data,
      loading: false,
      columns: [...selectedTableColumns, fieldAssign],
      pagination: {
        rowsPerPage: 0
      },
      zoneId: '',
      supplierId: '',
      td_invoice_id: ''
    };
  },
  components: {
    singleSelect: () => import('./singleSelect'),
    selectSearch: () => import('./selectSearch'),
    inputSearch: () => import('src/components/share/Search.vue')
  },
  created() {},
  methods: {
    checkAllocation(item, type) {
      let check = false;
      item.TlServices.map((item2) => {
        if (item2.tl_service_type_id === type) {
          check = true;
          return;
        }
      });
      return check;
    },
    checkAllocationPacking(item) {
      let check = false;
      item.TlServices.map((item2) => {
        if (item2.tl_service_type_id === 3) {
          check = true;
          return;
        }
      });
      return check;
    },
    checkAllocationDelivery(item) {
      let check = false;
      item.TlServices.map((item2) => {
        if (item2.tl_service_type_id === 4) {
          check = true;
          return;
        }
      });
      return check;
    },
    getTimeStamp(time) {
      return changeTimeStamp(time);
    },
    selectZone(value) {
      if (value) {
        this.zoneId = value;
      } else {
        this.zoneId = '';
      }
    },
    selectSupplier(value) {
      this.supplierId = value.value;
    },
    onSearch(val) {
      if (val) {
        this.td_invoice_id = val;
      } else {
        this.td_invoice_id = '';
      }
    },
    emitAssign(item) {
      this.$emit('emitAssign', item);
    }
  }
};
</script>

<style lang="scss" scoped>
.mainContent {
  padding: 16px 36px;
  overflow: auto;
  .selectContent {
    display: flex;
    justify-content: space-between;

    p {
      font-style: normal;
      font-weight: bold;
      font-size: 14px;
      line-height: 20px;
      color: black;
      letter-spacing: 0.32px;
    }
  }
}
.table-ctrl {
  ::v-deep {
    .q-table {
      thead tr {
        background: #f8f8f8;
      }
      &__bottom,
      thead,
      tr,
      th,
      td {
        border-color: #f5f5f5;
      }
      th,
      tbody td {
        font-size: 14px;
        color: #000;
        //font-weight: 500;
      }
      tbody td:before {
        background: rgba(4, 86, 90, 0.1);
      }
    }
  }
}
</style>
