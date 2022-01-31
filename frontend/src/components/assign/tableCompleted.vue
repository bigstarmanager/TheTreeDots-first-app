<template>
  <q-table
    class="table-ctrl"
    style="padding: 10px; height: 80vh"
    virtual-scroll
    :data="dataTable"
    :columns="columns"
    row-key="id"
    ref="table"
    :selected-rows-label="getSelectedString"
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
          <q-td key="supplier" :props="props">
            <span>
              {{ $splitString(props.row.supplier_name, 15) }}
              <q-tooltip v-if="props.row.supplier_name && props.row.supplier_name.length > 15">
                {{ props.row.supplier_name }}
              </q-tooltip>
            </span>
          </q-td>

          <q-td key="invoice_number" :props="props">
            <span>{{ props.row.td_invoice_id }}</span>
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
                <span>{{ props.row.packingAllocation }}</span>
              </template>
              <template v-else>
                <span style="color: #66717c">N/A</span>
              </template>
            </span>
          </q-td>
          <q-td key="deliveryAllocation" :props="props">
            <span>
              <template v-if="checkAllocation(props.row, 4)">
                <span>{{ props.row.deliveryAllocation }}</span>
              </template>
              <template v-else>
                <span style="color: #66717c">N/A</span>
              </template>
            </span>
          </q-td>
        </q-tr>
      </slot>
    </template>
  </q-table>
</template>

<script>
import { completedTableColumns } from 'src/constants/masterFranchise';
import { changeTimeStamp, changeHourStamp } from '../../utils/function';
import moment from 'moment';
import singleSelect from '../jobs/main/singleSelect';
import icon_cube from '../../../src/assets/images/icon/icon_cube.png';
import icon_assign_3pl from '../../../src/assets/images/icon/icon_update_3pl.png';
import icon_arrow_up from '../../../src/assets/images/icon/icons_arrow-up-right.png';

export default {
  name: 'Assigned',
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
      icon_cube,
      icon_assign_3pl,
      icon_arrow_up,
      columns: completedTableColumns,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      scrollDefault: {
        x: 1100,
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
    getDataTable: {
      deep: true,
      handler(value) {
        this.dataTable = value;
      }
    },
    selectedRowKeys: {
      deep: true,
      handler(value) {
        this.$emit('onSelectChange', value);
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
    getTimeStamp(time) {
      return changeTimeStamp(time);
    },
    getHourStamp(date) {
      return changeHourStamp(date);
    },
    handleSetDataTable(data) {
      let arr = [...data];
      this.dataTable = arr;
      console.log('this.dataTable', this.dataTable);
    },
    handleSetDataSelectedRowKey(data) {
      let arr = [...data];
      this.selectedRowKeys = arr;
      console.log('this.selectedRowKeys', this.selectedRowKeys);
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
    emitAssign(item) {
      this.$emit('emitAssign', item);
    },
    renderAllocation(record, type) {
      // console.log(record, type)
      // console.log('list select',this.getListSelect)
      let text = '';
      record.TlServices.map((item) => {
        if (item.TlServiceType.name === type) {
          // console.log('service type: ',item.TlServiceType.name)
          let target = this.getListSelect.filter((item2) => item2.value === item.TlTeam.id)[0];
          // console.log(target)
          if (target) text = target.label;
          return;
        }
      });
      // console.log('text',text)
      return text;
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
