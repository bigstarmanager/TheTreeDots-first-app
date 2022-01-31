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
      hide-bottom
      pagination.sync="pagination"
      :rows-per-page-options="[0]"
    >
      <template v-slot:top>
        <div class="row justify-between" style="width: 100%">
          <div class="col">
            <div class="row">
              <strong class="q-py-sm"> {{ listData.length }} invoices selected</strong>
              <div class="q-px-lg" style="width: 150px">
                <selectSearch
                  :data-props="listSupplier"
                  :defaultValue="{ value: '', label: 'All Supplier' }"
                  width="width:150px"
                  placeholder="All Supplier"
                  @updateData="selectSupplier"
                />
              </div>
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
            <q-td key="invoice_id" :props="props">
              <span>{{ props.row.invoice_id }}</span>
            </q-td>
            <q-td key="supplier" :props="props">
              <span>
                {{ $splitString(props.row.supplier, 15) }}
                <q-tooltip v-if="props.row.supplier && props.row.supplier.length > 15">
                  {{ props.row.supplier }}
                </q-tooltip>
              </span>
            </q-td>
            <q-td key="total_items" :props="props">
              <span>
                {{ props.row.total_items }}
              </span>
            </q-td>
            <q-td key="date" :props="props">
              <span>
                {{ props.row.collection_date }}
              </span>
            </q-td>
            <q-td key="window" :props="props">
              <span>
                {{ props.row.window }}
              </span>
            </q-td>
            <q-td key="location" :props="props">
              <span>
                {{ props.row.location }}
              </span>
            </q-td>
            <q-td key="vehicle" :props="props">
              <span>
                {{ props.row.vehicle }}
              </span>
            </q-td>
            <q-td key="zone" :props="props">
              <span>
                {{ props.row.zone }}
              </span>
            </q-td>
            <q-td key="driver" :props="props">
              <span>
                {{ props.row.driverUserName }}
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
import { regCollectionModalTableColumns, fieldAssign } from '../../../constants/jobs/index';
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
      columns: [...regCollectionModalTableColumns, fieldAssign],
      pagination: {
        rowsPerPage: 0
      },
      zoneId: '',
      supplierId: '',
      td_invoice_id: ''
    };
  },
  components: {
    singleSelect: () => import('src/components/jobs/main/singleSelect'),
    selectSearch: () => import('src/components/jobs/main//selectSearch'),
    inputSearch: () => import('src/components/share/Search.vue')
  },
  created() {
    console.log('listdataatatatat:::', this.listData);
  },
  methods: {
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
      console.log(this.supplierId);
    },
    onSearch(val) {
      console.log(val);
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
