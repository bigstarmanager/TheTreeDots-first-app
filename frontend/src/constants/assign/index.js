export const columns = [
  {
    title: 'Invoice ID',
    key: 'invoices',
    dataIndex: 'invoices',
    scopedSlots: { customRender: 'invoices' },
    width: 150
  },
  {
    title: 'Supplier',
    key: 'supplier',
    dataIndex: 'supplier',
    scopedSlots: { customRender: 'supplier' },
    width: 150
  },
  {
    title: 'Qty',
    key: 'Qty',
    dataIndex: 'Qty',
    scopedSlots: { customRender: 'Qty' },
    width: 150
  },
  // {
  //   title: 'Zone',
  //   key: 'zone',
  //   dataIndex: 'zone',
  //   scopedSlots: {customRender: 'zone'},
  //   width: 150
  // },
  {
    title: 'Delivery Date',
    key: 'deliveryDate',
    dataIndex: 'deliveryDate',
    scopedSlots: { customRender: 'deliveryDate' },
    width: 150
  },
  {
    title: 'Delivery Window',
    key: 'deliveryWindow',
    dataIndex: 'deliveryWindow',
    scopedSlots: { customRender: 'deliveryWindow' },
    width: 150
  },
  {
    title: 'Vehicle Type',
    key: 'vehicleType',
    dataIndex: 'vehicleType',
    scopedSlots: { customRender: 'vehicleType' },
    width: 150
  },
  {
    title: 'Packing Allocation',
    key: 'packingAllocation',
    dataIndex: 'packingAllocation',
    scopedSlots: { customRender: 'packingAllocation' },
    width: 150
  },
  {
    title: 'Delivery Allocation',
    key: 'deliveryAllocation',
    dataIndex: 'deliveryAllocation',
    scopedSlots: { customRender: 'deliveryAllocation' },
    width: 150
  },
  {
    title: 'Collection Allocation',
    key: 'collectionAllocation',
    dataIndex: 'collectionAllocation',
    scopedSlots: { customRender: 'collectionAllocation' },
    width: 150
  }
];
export const fieldAssign = {
  title: '',
  key: 'action',
  scopedSlots: { customRender: 'action' },
  width: 200
};

export const selectedTableColumns = [
  {
    title: 'Supplier',
    key: 'supplier',
    dataIndex: 'supplier',
    scopedSlots: { customRender: 'supplier' },
    width: 110
  },
  {
    title: 'Invoice Number',
    key: 'invoices',
    dataIndex: 'invoices',
    scopedSlots: { customRender: 'invoices' },
    width: 100
  },
  // {
  //   title: 'Zone',
  //   key: 'zone',
  //   dataIndex: 'zone',
  //   scopedSlots: {customRender: 'zone'},
  //   width: 100
  // },
  {
    title: 'Qty',
    key: 'Qty',
    dataIndex: 'Qty',
    scopedSlots: { customRender: 'Qty' },
    width: 80
  },
  {
    title: 'Delivery Date',
    key: 'deliveryDate',
    dataIndex: 'deliveryDate',
    scopedSlots: { customRender: 'deliveryDate' },
    width: 150
  },
  {
    title: 'Delivery Window',
    key: 'deliveryWindow',
    dataIndex: 'deliveryWindow',
    scopedSlots: { customRender: 'deliveryWindow' },
    width: 150
  },
  {
    title: 'Vehicle Type',
    key: 'vehicleType',
    dataIndex: 'vehicleType',
    scopedSlots: { customRender: 'vehicleType' },
    width: 100
  },
  {
    title: 'Packing Allocation',
    key: 'packingAllocation',
    dataIndex: 'packingAllocation',
    scopedSlots: { customRender: 'packingAllocation' },
    width: 100
  },
  {
    title: 'Delivery Allocation',
    key: 'deliveryAllocation',
    dataIndex: 'deliveryAllocation',
    scopedSlots: { customRender: 'deliveryAllocation' },
    width: 100
  },
  {
    title: 'Collection Allocation',
    key: 'collectionAllocation',
    dataIndex: 'collectionAllocation',
    scopedSlots: { customRender: 'collectionAllocation' },
    width: 150
  }
];

//Assigned table column
export const assignedTableColumns = [
  {
    title: 'Invoice ID',
    key: 'invoices',
    dataIndex: 'invoices',
    scopedSlots: { customRender: 'invoices' },
    width: 150
  },
  {
    title: 'Supplier',
    key: 'supplier',
    dataIndex: 'supplier',
    scopedSlots: { customRender: 'supplier' },
    width: 150
  },
  {
    title: 'Qty',
    key: 'Qty',
    dataIndex: 'Qty',
    scopedSlots: { customRender: 'Qty' },
    width: 150
  },
  // {
  //   title: 'Zone',
  //   key: 'zone',
  //   dataIndex: 'zone',
  //   scopedSlots: {customRender: 'zone'},
  //   width: 150
  // },
  {
    title: 'Delivery Date',
    key: 'deliveryDate',
    dataIndex: 'deliveryDate',
    scopedSlots: { customRender: 'deliveryDate' },
    width: 150
  },
  {
    title: 'Delivery Window',
    key: 'deliveryWindow',
    dataIndex: 'deliveryWindow',
    scopedSlots: { customRender: 'deliveryWindow' },
    width: 150
  },
  {
    title: 'Vehicle Type',
    key: 'vehicleType',
    dataIndex: 'vehicleType',
    scopedSlots: { customRender: 'vehicleType' },
    width: 150
  },
  {
    title: 'Packing Allocation',
    key: 'packingAllocation',
    dataIndex: 'packingAllocation',
    scopedSlots: { customRender: 'packingAllocation' },
    width: 150
  },
  {
    title: 'Delivery Allocation',
    key: 'deliveryAllocation',
    dataIndex: 'deliveryAllocation',
    scopedSlots: { customRender: 'deliveryAllocation' },
    width: 150
  },
  {
    title: 'Collection Allocation',
    key: 'collectionAllocation',
    dataIndex: 'collectionAllocation',
    scopedSlots: { customRender: 'collectionAllocation' },
    width: 150
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
    width: 100
  }
];

//completed table
export const completedTableColumns = [
  {
    title: 'Invoice ID',
    key: 'invoices',
    dataIndex: 'invoices',
    scopedSlots: { customRender: 'invoices' },
    width: 150
  },
  {
    title: 'Supplier',
    key: 'supplier',
    dataIndex: 'supplier',
    scopedSlots: { customRender: 'supplier' },
    width: 150
  },
  {
    title: 'Qty',
    key: 'Qty',
    dataIndex: 'Qty',
    scopedSlots: { customRender: 'Qty' },
    width: 150
  },
  // {
  //   title: 'Zone',
  //   key: 'zone',
  //   dataIndex: 'zone',
  //   scopedSlots: {customRender: 'zone'},
  //   width: 150
  // },
  {
    title: 'Delivery Date',
    key: 'deliveryDate',
    dataIndex: 'deliveryDate',
    scopedSlots: { customRender: 'deliveryDate' },
    width: 150
  },
  {
    title: 'Delivery Window',
    key: 'deliveryWindow',
    dataIndex: 'deliveryWindow',
    scopedSlots: { customRender: 'deliveryWindow' },
    width: 150
  },
  {
    title: 'Vehicle Type',
    key: 'vehicleType',
    dataIndex: 'vehicleType',
    scopedSlots: { customRender: 'vehicleType' },
    width: 150
  },
  {
    title: 'Packing Allocation',
    key: 'packingAllocation',
    dataIndex: 'packingAllocation',
    scopedSlots: { customRender: 'packingAllocation' },
    width: 150
  },
  {
    title: 'Delivery Allocation',
    key: 'deliveryAllocation',
    dataIndex: 'deliveryAllocation',
    scopedSlots: { customRender: 'deliveryAllocation' },
    width: 150
  },
  {
    title: 'Collection Allocation',
    key: 'collectionAllocation',
    dataIndex: 'collectionAllocation',
    scopedSlots: { customRender: 'collectionAllocation' },
    width: 150
  }
];

export const listWindow = [
  { value: '', label: 'All Window' },
  { value: '12am to 6am', label: '12am to 6am' },
  { value: '12pm to 6pm', label: '12pm to 6pm' },
  { value: '6pm to 12am', label: '6pm to 12am' },
  { value: '6am to 12pm', label: '6am to 12pm' }
];
