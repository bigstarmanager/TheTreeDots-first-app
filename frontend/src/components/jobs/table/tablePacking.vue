<template>
  <div>
    <q-table
      class="table-ctrl"
      style="padding: 10px; height: 79vh"
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
              <span>{{ props.row.invoice_id }}</span>
            </q-td>

            <q-td key="supplier" :props="props">
              <span>
                {{ props.row.supplier }}
              </span>
            </q-td>

            <q-td key="receipient" :props="props">
              <span>
                {{ props.row.receipient }}
              </span>
            </q-td>

            <q-td key="total_items" :props="props">
              <span>
                {{ props.row.total_items }}
              </span>
            </q-td>

            <q-td key="date" :props="props">
              <span>
                {{ props.row.date }}
              </span>
            </q-td>

            <q-td key="window" :props="props">
              <span>
                {{ props.row.delivery_time_from + ' - ' + props.row.delivery_time_to }}
              </span>
            </q-td>

            <q-td key="warehouse" :props="props">
              <span>
                {{ props.row.warehouse }}
              </span>
            </q-td>

            <q-td key="status" :props="props">
              <div :class="props.row.status.class">
                <span>{{ props.row.status.text }}</span>
              </div>
            </q-td>

            <q-td key="action" :props="props">
              <div class="btn-pointer" @click="emitAssign(props.row)">
                View <q-icon name="arrow_forward" style="margin-right: 10px" />
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
import { regPackingColumns, fieldAssign } from 'src/constants/jobs';

export default {
  name: 'tablePacking',
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
      columnsAssign: [...regPackingColumns, fieldAssign],
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
    onTableOptionsChanged(tableChange) {
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
