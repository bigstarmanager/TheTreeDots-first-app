<template>
  <div>
    <q-table
      class="table-ctrl btb"
      style="height: 82vh"
      virtual-scroll
      :data="dataTable"
      :columns="columns"
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
              <div class="item">
                <q-checkbox v-model="props.selected" />
              </div>
            </q-td>

            <q-td key="details" :props="props">
              <div class="item" style="border-right: 1px solid #94959b">
                <div style="display: flex">
                  <div>
                    <p class="q-mb-none">
                      <span
                        >Invoice ID: <strong>{{ props.row.td_invoice_id }}</strong></span
                      >
                    </p>
                    <p class="q-mb-none">
                      <strong>{{ props.row.supplier_name || '' }}</strong>
                    </p>
                  </div>
                  <div style="margin-left: 30px">
                    <p class="q-mb-none">
                      <span
                        >Recipient: <strong>{{ props.row.recipient || '' }}</strong></span
                      >
                    </p>
                    <p class="q-mb-none">
                      <span
                        >No. of items: <strong>{{ props.row.qty || 0 }}</strong></span
                      >
                    </p>
                    <p class="q-mb-none">
                      <span
                        >Vehicle Type: <strong>{{ props.row.vehicle_requirement || '' }}</strong></span
                      >
                    </p>
                  </div>
                </div>
              </div>
            </q-td>
            <q-td key="task" :props="props">
              <div class="item border">
                <p v-if="checkAllocation(props.row)" class="q-mb-none" style="padding: 18px 16px">
                  Collection
                </p>
                <p v-else class="q-mb-none" style="padding: 18px 16px">Drop Off</p>

                <div class="">
                  <p class="q-mb-none" style="padding: 18px 16px; border-bottom: 0">Delivery</p>
                </div>
              </div>
            </q-td>
            <q-td key="zone" :props="props">
              <div class="item border">
                <p class="q-mb-none" style="padding: 18px 16px">zone 1</p>
                <div>
                  <p class="q-mb-none" style="padding: 18px 16px; border-bottom: 0">zone 2</p>
                </div>
              </div>
            </q-td>
            <q-td key="address" :props="props">
              <div class="item border">
                <p class="q-mb-none" style="height: 58px; overflow: hidden; padding-bottom: 0">
                  <span v-if="checkAllocation(props.row)">{{ props.row.collection_location }}</span>
                </p>
                <p class="q-mb-none" style="height: 54px; overflow: hidden; padding-bottom: 0">
                  {{ props.row.delivery_address }}
                </p>
              </div>
            </q-td>
            <q-td key="date" :props="props">
              <div class="item border">
                <p class="q-mb-none">
                  <span>{{ changeTimeDateString(props.row.collection_date) }}</span>
                  <br />
                  <span>{{ props.row.collection_window }}</span>
                </p>
                <p class="q-mb-none">
                  <span>{{ getTimeStamp(props.row.delivery_date) }}</span>
                  <br />
                  <span>{{ props.row.delivery_window }}</span>
                </p>
              </div>
            </q-td>
            <q-td key="allocation" :props="props">
              <div class="item" style="padding: 48px 16px" @click="emitAssign(props.row)">
                <p class="q-mb-none">
                  <strong>{{ props.row.driverUserName ? props.row.driverUserName : 'Unassigned' }} </strong>
                </p>
              </div>
            </q-td>
          </q-tr>
        </slot>
      </template>
    </q-table>
  </div>
</template>

<script>
import { columns } from 'src/constants/jobs';
import { changeTimeStamp, changeHourStamp, changeTimeDateString } from 'src/utils/function';
import singleSelect from '../main/singleSelect';

import icon_send from 'src/assets/images/icon/icon_send.png';

export default {
  name: 'tableJobsUnAssigned',
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
    }
  },
  components: {
    singleSelect
  },
  data() {
    return {
      icon_send,
      columns: [...columns],
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      scrollDefault: {
        x: 1500,
        y: 500
      },
      getListSelect: [],
      dataTable: [],
      // data : []
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
    console.log(210, this.getDataTable);
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
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
      let arr = this.dataTable.filter((item) => {
        if (selectedRowKeys.includes(item.id)) return item;
      });
      this.$emit('onSelectChange', arr);
    },
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
      let arr = [...data];
      this.selectedRowKeys = arr;
    },
    checkAllocation(item) {
      let check = false;
      item.TlServices.map((item2) => {
        if (item2.tl_service_type_id === 1) {
          check = true;
          return;
        }
      });
      return check;
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

<style lang="scss" scoped>
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

      tbody {
        td:before {
          background: transparent;
        }

        tr:hover .item {
          background: rgba(4, 86, 90, 0.1);
        }
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
              height: 115px;
              padding: 7px 16px;
              margin-top: 10px;
              border-top: 1px solid #94959b;

              &.border {
                padding: 0;
                border-right: 1px solid #94959b;

                p {
                  padding: 7.4px 16px;

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
