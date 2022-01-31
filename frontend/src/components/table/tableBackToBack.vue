<template>
  <div>
    <q-table
      class="table-ctrl btb"
      style="padding: 10px; height: 72vh"
      virtual-scroll
      title="Treats"
      :data="dataTable"
      :columns="columnsAssign"
      row-key="invoice_id"
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
        <q-tr :props="props">
          <q-td auto-width>
            <div class="item">
              <q-checkbox v-model="props.selected" />
            </div>
          </q-td>
          <q-td key="invoice_id" :props="props">
            <div class="item">
              <p class="q-mb-none">{{ props.row.invoice_id }}</p>
              <p class="q-mb-none">
                <span>Title: <strong>Lorem ipsum dolor</strong></span>
              </p>
            </div>
          </q-td>
          <q-td key="supplier" :props="props">
            <div class="item" style="border-right: 1px solid #94959b">
              <p class="q-mb-none">
                {{ props.row.supplier }}
              </p>
              <p class="q-mb-none">
                <span>Title: <strong>Lorem ipsum dolor</strong></span>
              </p>
              <p class="q-mb-none">
                <span>Title: <strong>Lorem ipsum dolor</strong></span>
              </p>
            </div>
          </q-td>
          <q-td key="receipient" :props="props">
            <div class="item border">
              <p class="q-mb-none">row1</p>
              <p class="q-mb-none">
                {{ props.row.receipient }}
              </p>
            </div>
          </q-td>
          <q-td key="total_items" :props="props">
            <div class="item border">
              <p class="q-mb-none">row1</p>
              <p class="q-mb-none">
                {{ props.row.total_items }}
              </p>
            </div>
          </q-td>
          <q-td key="date" :props="props">
            <div class="item border">
              <p class="q-mb-none">row1</p>
              <p class="q-mb-none">
                {{ props.row.date }}
              </p>
            </div>
          </q-td>
          <q-td key="window" :props="props">
            <div class="item border">
              <p class="q-mb-none">row1</p>
              <p class="q-mb-none">
                {{ props.row.window }}
              </p>
            </div>
          </q-td>
          <q-td key="warehouse" :props="props">
            <div class="item border">
              <p class="q-mb-none">
                {{ props.row.warehouse }}
              </p>
            </div>
          </q-td>
          <q-td key="status" :props="props">
            <div class="item" style="padding: 30px 16px">
              <div :class="props.row.status.class">
                <p class="q-mb-none">{{ props.row.status.text }}</p>
              </div>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { changeTimeStamp, changeHourStamp, changeTimeDateString } from 'src/utils/function';
import { tableBackToBack } from 'src/constants/jobs';

export default {
  name: 'tableBackToBack',
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
      columnsAssign: [...tableBackToBack],
      // columnsAssign: [...regPackingColumns, fieldAssign],
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
        total: 100,
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
    pagination: {
      deep: true,
      handler(value) {
        // this.onTableOptionsChanged(value)
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
        total: this.getPagination.total,
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
      console.log(item);
      this.$emit('emitAssign', item);
    },
    onTableOptionsChanged(tableChange) {
      console.log(tableChange.pagination);
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
  &.btb {
    ::v-deep {
      .q-table {
        td,
        &__bottom {
          border-color: #94959b;
        }

        thead {
          tr {
            background: #f8f8f8;
          }
        }
        .q-virtual-scroll__content {
          tr td {
            padding: 0;
            .item {
              height: 80px;
              padding: 7px 16px;
              margin-top: 10px;
              border-top: 1px solid #94959b;
              &.border {
                padding: 0;
                border-right: 1px solid #94959b;
                p {
                  padding: 7px 16px;
                  &:first-child {
                    border-bottom: 1px solid #94959b;
                  }
                }
              }
            }
          }
          tr td:nth-child(1) {
            .item {
              border-left: 1px solid #94959b;
            }
          }
        }
      }
    }
  }
}
</style>
