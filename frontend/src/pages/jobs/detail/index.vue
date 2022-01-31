<template>
  <div>
    <div>
      <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        title="Job"
        sub-title="Supplier 1"
        @back="() => $router.back()"
      >
        <a-descriptions size="large" :column="2">
          <a-descriptions-item label="Job ID">
            <a href="">#123</a>
          </a-descriptions-item>
          <a-descriptions-item label="Suppiler">
            <a>Tiong lian</a>
          </a-descriptions-item>
          <a-descriptions-item label="Customer"> Mannapot </a-descriptions-item>
          <a-descriptions-item label="Order bo">
            <a href="">#123</a>
          </a-descriptions-item>
          <a-descriptions-item label="Invoice No">
            <a href="">#123</a>
          </a-descriptions-item>
          <a-descriptions-item label="Delivery date"> 29 Jul 2021 </a-descriptions-item>
        </a-descriptions>
      </a-page-header>
    </div>
    <br />
    <br />
    <a-table bordered :columns="columns" :data-source="data">
      <span slot="status" slot-scope="status">
        <a-tag :color="getInfoSystemConstant(JOB_DETAIL_STATUS_LIST, status).color">
          {{ getInfoSystemConstant(JOB_DETAIL_STATUS_LIST, status).value }}
        </a-tag>
      </span>
    </a-table>
    <br />
    <br />
    <a-list size="large" bordered :data-source="dataHistory">
      <a-list-item slot="renderItem" slot-scope="item">
        {{ item }}
      </a-list-item>
      <div slot="header">
        <h2 style="margin-bottom: 0">History</h2>
      </div>
    </a-list>
  </div>
</template>

<script>
import { getInfoSystemConstant } from '../../../utils/convert';
import { JOB_DETAIL_STATUS_LIST } from '../../../constants/system.constants';

const columns = [
  {
    title: 'SKU ID',
    dataIndex: 'skuId'
  },
  {
    title: 'Item Name',
    dataIndex: 'itemName'
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity'
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
    width: 100
  }
];
const data = [
  {
    key: 0,
    skuId: 1001,
    itemName: 'Batang steak',
    quantity: 'income',
    status: 0
  },
  {
    key: 1,
    skuId: 1002,
    itemName: 'Batang steak',
    quantity: 'income',
    status: 0
  },
  {
    key: 2,
    skuId: 1003,
    itemName: 'Batang steak',
    quantity: 'income',
    status: 1
  }
];
const dataHistory = [
  'Order is delivered to customer by Idris',
  'Item is picker by JW',
  'Item received by QD',
  'Item is collected from Supplier by Idris',
  'Order is allocated to batch #1001'
];
export default {
  name: 'index',
  data() {
    return {
      data,
      columns,
      JOB_DETAIL_STATUS_LIST,
      dataHistory
    };
  },
  methods: {
    getInfoSystemConstant
  }
};
</script>

<style scoped></style>
