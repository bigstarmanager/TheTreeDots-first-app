<template>
  <div>
    <q-table
      class="table-ctrl btb q-pa-md"
      style="height: 82vh"
      virtual-scroll
      :data="getDataTable"
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
            <q-td key="name" :props="props">
              <div class="item">
                <p class="q-mb-none" style="overflow: hidden; padding-bottom: 0">
                  {{ props.row.name }}
                </p>
              </div>
            </q-td>
            <q-td key="email" :props="props">
              <div class="item">
                <p class="q-mb-none" style="overflow: hidden; padding-bottom: 0">
                  {{ props.row.email }}
                </p>
              </div>
            </q-td>
            <q-td key="phone" :props="props">
              <div class="item">
                <p class="q-mb-none" style="overflow: hidden; padding-bottom: 0">
                  {{ props.row.phone }}
                </p>
              </div>
            </q-td>
            <q-td key="gender" :props="props">
              <div class="item">
                <p class="q-mb-none" style="overflow: hidden; padding-bottom: 0">
                  {{ props.row.gender }}
                </p>
              </div>
            </q-td>
            <q-td key="country" :props="props">
              <div class="item">
                <p class="q-mb-none" style="overflow: hidden; padding-bottom: 0">
                  {{ props.row.country }}
                </p>
              </div>
            </q-td>
            <q-td key="userType" :props="props">
              <div class="item">
                <p class="q-mb-none" style="overflow: hidden; padding-bottom: 0">
                  {{ props.row.userType }}
                </p>
              </div>
            </q-td>
            <q-td key="active" :props="props" class="">
              <div class="item row justify-between">
                <div style="margin-left: -15px">
                  <q-toggle size="lg" v-model="props.row.active" color="color-main" />
                </div>
                <span>
                  <q-icon
                    style="font-size: 25px"
                    name="mdi-square-edit-outline"
                    @click="emitAssign(props.row)"
                  />
                </span>
                <span @click="confirmDelete(props.row)">
                  <q-icon color="negative" style="font-size: 25px" name="mdi-trash-can-outline" />
                </span>
              </div>
            </q-td>
          </q-tr>
        </slot>
      </template>
    </q-table>

    <modalCommon
      v-model="confirm"
      :modalTitle="'Delete User'"
      :width="'width: 600px; max-width: 1230px'"
      :bodyStyle="'height: 40px'"
      @cancel="handleCancel"
    >
      <template #content>
        <q-card-section class="q-pa-md">
          Do you want to Delete <b>{{ nameSelect }}</b> ? It will be deleted permanently.
        </q-card-section>
      </template>

      <template #footer>
        <div class="action row justify-end q-pa-lg">
          <div>
            <q-btn no-wrap dense no-caps flat padding="0.5rem" color="dark" @click="handleCancel">
              <span>Cancel</span>
            </q-btn>
          </div>
          <div class="q-ml-md">
            <q-btn
              :disabled="false"
              no-wrap
              dense
              no-caps
              padding="0.5rem 1rem"
              color="red"
              @click="acceptDelete"
            >
              <span>Delete Permanently</span>
            </q-btn>
          </div>
        </div>
      </template>
    </modalCommon>
  </div>
</template>

<script>
import { selectedTableColumns } from 'src/constants/users';
// import { changeTimeStamp, changeHourStamp, changeTimeDateString } from 'src/utils/function';
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
      confirm: false,
      activeValue: false,
      icon_send,
      nameSelect: '',
      columns: [...selectedTableColumns],
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
    handleCancel() {
      this.confirm = false;
    },
    confirmDelete(item) {
      if (item) {
        this.nameSelect = item.name;
      }
      this.confirm = true;
    },
    acceptDelete() {
      this.confirm = false;
      this.$q.notify({
        type: 'positive',
        message: `This is a "positive" type notification.`
      });
    },
    changeRadio() {},
    getSelectedString() {
      return this.selectedRowKeys.length === 0
        ? ''
        : `${this.selectedRowKeys.length} record${this.selectedRowKeys.length > 1 ? 's' : ''} selected of ${
            this.dataTable.length
          }`;
    },
    // changeTimeDateString,
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
      let arr = this.dataTable.filter((item) => {
        if (selectedRowKeys.includes(item.id)) return item;
      });
      this.$emit('onSelectChange', arr);
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
          span {
            cursor: pointer;
          }
        }
      }
    }
  }

  &.btb {
    ::v-deep {
      .q-table__top {
        padding: 0 0 12px 0 !important;
      }
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
              height: 55px;
              padding: 7px 16px;
              //   margin-top: 10px;
              display: flex;
              align-items: center;
              //   border-top: 1px solid #94959b;

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
              // border-left: 1px solid #94959b;
            }
          }
        }
      }
    }
  }
}
</style>
