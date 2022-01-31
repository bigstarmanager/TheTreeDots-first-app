<template>
  <div>
    <q-table
      class="table-ctrl"
      style="padding: 10px; height: 80vh"
      virtual-scroll
      :data="dataTable"
      :columns="columnsAssign"
      row-key="id"
      ref="table"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selectedRowKeys"
      :bordered="false"
      :flat="false"
      :pagination-label="pagination.showTotal"
      :rows-per-page-options="pageSizeOptions"
      :pagination.sync="pagination"
      @request="onTableOptionsChanged"
    >
      <template v-slot:top>
        <slot name="top"></slot>
      </template>

      <template v-slot:body="props">
        <slot name="loading">
          <q-tr :props="props">
            <q-td auto-width>
              <q-checkbox v-model="props.selected" />
            </q-td>
            <q-td key="invoice_id" :props="props">
              <span>{{ props.row.td_invoice_id }}</span>
            </q-td>
            <q-td key="supplier" :props="props">
              <span>
                {{ $splitString(props.row.supplier_name, 15) }}
                <q-tooltip v-if="props.row.supplier_name && props.row.supplier_name.length > 15">
                  {{ props.row.supplier_name }}
                </q-tooltip>
              </span>
            </q-td>
            <q-td key="qty" :props="props">
              <span>
                {{ props.row.qty }}
              </span>
            </q-td>
            <q-td key="zones" :props="props">
              <span>
                {{ props.row.zones }}
              </span>
            </q-td>
            <q-td key="deliveryDate" :props="props">
              <span>
                {{ getTimeStamp(props.row.delivery_date) }}
              </span>
            </q-td>
            <q-td key="deliveryWindow" :props="props">
              <span>
                {{ props.row.delivery_time_from + ' - ' + props.row.delivery_time_to }}
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
                  <span style="color: #04565a">Not selected</span>
                </template>
                <template v-else>
                  <span style="color: #66717c">N/A</span>
                </template>
              </span>
            </q-td>
            <q-td key="deliveryAllocation" :props="props">
              <span>
                <template v-if="checkAllocation(props.row, 4)">
                  <span style="color: #04565a">Not selected</span>
                </template>
                <template v-else>
                  <span style="color: #66717c">N/A</span>
                </template>
              </span>
            </q-td>
            <q-td key="collectionAllocation" :props="props">
              <span>
                <template v-if="checkAllocation(props.row, 1)">
                  <span style="color: #04565a">Not selected</span>
                </template>
                <template v-else>
                  <span style="color: #66717c">N/A</span>
                </template>
              </span>
            </q-td>
            <q-td key="action" :props="props">
              <div class="btn-pointer" @click="emitAssign(props.row)">
                <img :src="icon_assign_3pl" style="margin-right: 10px; vertical-align: middle" alt="" />
                Assign 3PL
              </div>
            </q-td>
          </q-tr>
        </slot>
      </template>
    </q-table>
  </div>
</template>

<script>
import { changeTimeStamp, changeHourStamp, changeTimeDateString } from 'src/utils/function';
import { regUnassigned, fieldAssign } from 'src/constants/masterFranchise';
import icon_assign_3pl from 'src/assets/images/icon/icon_assign_3pl.png';

export default {
  name: 'tableUnassigned',
  props: {
    listSelect: {
      type: Array,
      default() {
        return [];
      }
    },
    getDataTable: {
      type: Array,
      default() {
        return [];
      }
    },
    getPagination: {
      type: Object,
      default() {
        return {};
      }
    },
    tableAssigned: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      icon_assign_3pl,
      columnsAssign: [...regUnassigned, fieldAssign],
      lastIndex: null,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      scrollDefault: {
        x: 1500,
        y: 500
      },
      getListSelect: [],
      dataTable: [],
      pagination: {
        page: 1,
        rowsPerPage: 2,
        showTotal: (firstRowIndex, endRowIndex, totalRowsNumber) =>
          `${firstRowIndex}-${endRowIndex} of ${totalRowsNumber} items`
      },
      pageSizeOptions: ['20', '30', '40', '50']
    };
  },
  watch: {
    listSelect: {
      deep: true,
      handler(value) {
        this.getListSelect = value;
      }
    },
    selectedRowKeys: {
      deep: true,
      handler(value) {
        this.$emit('onSelectChange', value);
      }
    },
    getDataTable: {
      deep: true,
      handler(value) {
        this.dataTable = value;
      }
    },

    getPagination: {
      deep: true,
      handler(value) {
        this.pagination = {
          page: value.current,
          rowsPerPage: value.pageSize,
          rowsNumber: value.total,
          showTotal: (firstRowIndex, endRowIndex) => `${firstRowIndex}-${endRowIndex} of ${value.total} items`
        };
        // this.showTotal:(firstRowIndex, endRowIndex, totalRowsNumber) =>
        //   `${firstRowIndex}-${endRowIndex} of ${totalRowsNumber} items`
      }
    }
  },
  created() {
    if (this.listSelect) this.getListSelect = this.listSelect;
    if (this.getDataTable) this.dataTable = this.getDataTable;
    if (this.getPagination)
      this.pagination = {
        page: this.getPagination.current,
        rowsPerPage: this.getPagination.pageSize,
        rowsNumber: this.getPagination.total,
        showTotal: (firstRowIndex, endRowIndex) =>
          `${firstRowIndex}-${endRowIndex} of ${this.getPagination.total} items`
      };
  },
  computed: {},
  methods: {
    getSelectedString() {
      return this.selectedRowKeys.length === 0
        ? ''
        : `${this.selectedRowKeys.length} record${this.selectedRowKeys.length > 1 ? 's' : ''} selected of ${
            this.dataTable.length
          }`;
    },
    changeTimeDateString,
    // onSelectChange(selectedRowKeys) {
    //   this.selectedRowKeys = selectedRowKeys;
    //   let arr = this.dataTable.filter((item) => {
    //     if (selectedRowKeys.includes(item.id)) return item
    //   })
    //   this.$emit('onSelectChange', arr)
    // },
    getTimeStamp(time) {
      return changeTimeStamp(time);
    },
    getHourStamp(date) {
      return changeHourStamp(date);
    },
    handleSetDataTable(data) {
      let arr = [...data];
      this.dataTable = arr;
    },
    handleSetDataSelectedRowKey(data) {
      this.selectedRowKeys = [...data];
    },
    emitAssign(item) {
      this.$emit('emitAssign', item);
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
    },
    onTableOptionsChanged(tableChange) {
      console.log('table chagnessss:::::', tableChange);
      this.$emit('onTableOptionsChanged', {
        current: tableChange.pagination.page,
        pageSize: Number(tableChange.pagination.rowsPerPage)
      });
    }
  }
};
</script>

<style scoped lang="scss">
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
