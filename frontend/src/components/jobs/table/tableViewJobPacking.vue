<template>
  <div class="q-pa-md">
    <q-table
      class="table-ctrl"
      style="padding: 10px; height: 71vh"
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
      :pagination="pagination"
    >
      <template v-slot:top>
        <slot name="top"></slot>
      </template>
      <template v-slot:body="props">
        <slot name="loading">
          <q-tr :props="props">
            <q-td>
              <q-checkbox v-model="props.selected" />
            </q-td>
            <q-td key="productName" :props="props">
              <span>{{ props.row.product_name }}</span>
            </q-td>
            <q-td key="quantityToPack" :props="props">
              <span>{{ props.row.quantity }}</span>
            </q-td>
            <q-td key="quantityPacked" :props="props">
              <div class="flex justify-around items-center">
                <template v-if="props.row.editable">
                  <q-input
                    standout
                    :value="props.row.received_quantity"
                    :dense="true"
                    type="number"
                    outlined
                    @input="(value) => handleChange(value, props.row.id, 'quantityPacked')"
                  />
                  <div class="flex">
                    <q-icon
                      class="cursor-pointer"
                      name="save"
                      size="16px"
                      @click="saveDataTable(props.row.id)"
                    />
                    <q-icon
                      style="margin-left: 10px"
                      class="cursor-pointer"
                      name="close"
                      size="16px"
                      @click="cancel(props.row.id)"
                    >
                    </q-icon>
                  </div>
                </template>

                <template v-else>
                  <span>{{ props.row.received_quantity }}</span>
                  <q-icon class="cursor-pointer" name="edit" size="16px" @click="editDataTable(props.row.id)">
                  </q-icon>
                </template>
              </div>
            </q-td>
            <q-td key="status" :props="props">
              <div :class="props.row.status.class">
                <span>{{ props.row.status.text }}</span>
              </div>
            </q-td>
            <q-td key="action" :props="props">
              <span></span>
            </q-td>
          </q-tr>
        </slot>
      </template>
    </q-table>
  </div>
</template>

<script>
import { viewPackingColumns, fieldAssign } from 'src/constants/jobs';
import { changeTimeStamp, changeHourStamp, changeTimeDateString } from 'src/utils/function';

import icon_send from '../../../../src/assets/images/icon/icon_send.png';

export default {
  name: 'tableViewJobPacking',
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
  components: {
    singleSelect: () => import('../main/singleSelect')
  },
  data() {
    return {
      icon_send,
      columnsAssign: [...viewPackingColumns, fieldAssign],
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      scrollDefault: {
        x: 1500,
        y: 500
      },
      getListSelect: [],
      dataTable: [],
      cacheData: [],
      // data : []
      pagination: {
        page: 1,
        rowsPerPage: 10,
        showTotal: (firstRowIndex, endRowIndex, totalRowsNumber) =>
          `${firstRowIndex}-${endRowIndex} of ${totalRowsNumber} items`
      },
      pageSizeOptions: [20, 30, 40, 50]
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
        this.cacheData = [...value];
      }
    }
  },
  created() {
    if (this.listSelect) this.getListSelect = this.listSelect;
    if (this.getDataTable) {
      this.dataTable = this.getDataTable;
      this.cacheData = [...this.getDataTable];
    }
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
    //=====
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
      this.selectedRowKeys = [...data];
    },
    editDataTable(id) {
      const newData = [...this.dataTable];
      const target = newData.filter((item) => id === item.id)[0];
      if (target) {
        target.editable = true;
        this.dataTable = newData;
      }
    },
    saveDataTable(id) {
      const newData = [...this.dataTable];
      const newCacheData = [...this.cacheData];
      const target = newData.filter((item) => id === item.id)[0];
      const targetCache = newCacheData.filter((item) => id === item.id)[0];
      if (target && targetCache) {
        this.updateReceivedQty(target.id, target.quantityPacked);
      }
    },
    cancel(id) {
      const newData = [...this.dataTable];
      const target = newData.filter((item) => id === item.id)[0];
      if (target) {
        Object.assign(target, this.cacheData.filter((item) => id === item.id)[0]);
        delete target.editable;
        this.dataTable = newData;
      }
    },
    handleChange(value, id, column) {
      const newData = [...this.dataTable];
      const target = newData.filter((item) => id === item.id)[0];
      if (target) {
        target[column] = value || '0';
        this.dataTable = newData;
      }
    },
    updateReceivedQty(tlTaskId, newReceivedQty) {
      this.$emit('updateReceivedQty', {
        tlTaskId,
        newReceivedQty: Number(newReceivedQty)
      });
    },

    emitAssign(item) {
      this.$emit('emitAssign', item);
    },

    onTableOptionsChanged(tableChange) {
      this.$emit('onTableOptionsChanged', {
        current: tableChange.pagination.page,
        pageSize: tableChange.pagination.rowsPerPage
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
