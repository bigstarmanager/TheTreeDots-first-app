<template>
  <div>
    <q-table
      class="table-ctrl"
      style="padding: 10px; height: 1500px"
      virtual-scroll
      :data="dataTable"
      :columns="columnsSetting"
      row-key="id"
      ref="table"
      :bordered="false"
      :flat="false"
      hide-bottom
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
    >
      <template v-slot:top>
        <slot name="top"></slot>
      </template>
      <template v-slot:body="props">
        <slot name="loading">
          <q-tr :props="props" :class="selectedRowKeys.includes(props.row.id) ? 'bg-selected-modal' : ''">
            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>
            <q-td key="description" :props="props">
              {{ props.row.description }}
            </q-td>
            <q-td key="locate" :props="props">
              <div class="btn-pointer" @click="emitLocation(props.row)">
                <img
                  :src="location"
                  alt="location"
                  style="margin-right: 10px; width: 24px; vertical-align: middle"
                />
                Locate
              </div>
            </q-td>
            <q-td key="action" :props="props">
              <div class="btn-pointer" @click="emitEdit(props.row)">
                <img
                  :src="icon_update_3pl"
                  alt="icon_update_3pl"
                  style="margin-right: 10px; vertical-align: middle"
                />
                Edit
              </div>
            </q-td>
          </q-tr>
        </slot>
      </template>
    </q-table>
  </div>
</template>

<script>
import { columns } from 'src/constants/setting';
import { changeTimeStamp, changeHourStamp, changeTimeDateString } from 'src/utils/function';
import icon_update_3pl from '../../../../src/assets/images/icon/icon_update_3pl.png';
import location from '../../../assets/images/icon/location.png';

export default {
  name: 'tableSetting',
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
  components: {},
  data() {
    return {
      icon_update_3pl,
      location,
      columnsSetting: [...columns],
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
        rowsPerPage: 0
      }
      // pagination: {
      //   page: 1,
      //   rowsPerPage: 10,
      //   showTotal: (firstRowIndex, endRowIndex, totalRowsNumber) =>
      //     `${firstRowIndex}-${endRowIndex} of ${totalRowsNumber} items`,
      // },
      // pageSizeOptions: [20, 30, 40, 50],
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
    }
  },
  created() {
    if (this.listSelect) this.getListSelect = this.listSelect;
    if (this.getDataTable) this.dataTable = this.getDataTable;
  },
  computed: {},
  methods: {
    changeTimeDateString,
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
    emitLocation(item) {
      this.onSelectChange(item);
      this.$emit('emitLocation', item);
    },
    emitEdit(item) {
      this.onSelectChange(item);
      this.$emit('emitEdit', item);
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = [];
      console.log(selectedRowKeys);
      this.selectedRowKeys.push(selectedRowKeys.id);
      // let arr = this.dataTable.filter((item) => {
      //   if (selectedRowKeys.includes(item.id)) return item
      // })
      // this.$emit('onSelectChange', arr)
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
      tbody td:before {
        background: rgba(4, 86, 90, 0.1);
      }
    }
  }
}
</style>
