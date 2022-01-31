import { mutationField, nonNull, stringArg } from 'nexus';
import PDF from '../../utils/pdf';
import { getNewDate } from '../../utils/dateTime';
import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';

export const downloadPackingListPdf = mutationField('downloadPackingListPdf', {
  type: 'Json',
  args: {
    jsonData: nonNull(stringArg())
  },
  resolve: async (_, args, ctx) => {
    const listData = JSON.parse(args.jsonData);
    let res = [];
    const templateName = 'packing_list';
    const file = new AdmZip();
    fs.mkdir(path.join(__dirname, 'temp'), (err) => {
      if (err) {
        console.log(err);
      }
    });
    const reportPath = path.join(__dirname, 'temp');

    for await (const data of listData) {
      for (const item of data.invoices.OrderItem) {
        item.sku_code = item.sku_code || 'N/A';
        item.stock_location = item.stock_location || 'N/A';
        item.supplier = item.sku?.SkuActualSkus?.[0]?.actual_sku?.supplier?.name || 'N/A';
      }
      const pdf = await new PDF(templateName).startPuppeteer();
      const generatePdf = await pdf.generatePDF(
        data,
        {
          format: 'A4',
          margin: {
            top: '20px',
            left: '20px',
            right: '20px',
            bottom: '20px'
          }
        },
        'buffer'
      );
      await pdf.closePuppeteer();

      const addFile = file.addFile(`${templateName}_INV-${data.td_invoice_id}.pdf`, generatePdf);

      // build base64 url string to upload to s3
      // const base64Pdf = `data:application/pdf;base64,${generatePdf}`;
      // res.push({
      //   file_name: `${templateName}_INV-${data.td_invoice_id}`,
      //   pdf_base64: base64Pdf
      // });
    }
    const getDateForRandomName = getNewDate()
      .toJSON()
      .replace('-', '')
      .replace('-', '')
      .replace(':', '')
      .replace(':', '')
      .split('.')[0];
    const fileName = `packingList_${getDateForRandomName}.zip`;
    const locationPath = `${reportPath}/${fileName}`;
    fs.writeFileSync(locationPath, file.toBuffer());

    const contents = fs.readFileSync(locationPath, { encoding: 'base64' });
    const base64Pdf = `data:@file/zip;base64,${contents}`;
    res.push({
      file_name: fileName,
      pdf_base64: base64Pdf
    });
    fs.unlink(locationPath, (err) => {
      if (err) throw err;
    });
    fs.rmdir(path.join(__dirname, 'temp'), (err) => console.log(err));
    return JSON.stringify(res);
  }
});

export const downloadPickingListPdf = mutationField('downloadPickingListPdf', {
  type: 'Json',
  args: {
    jsonData: nonNull(stringArg())
  },
  resolve: async (_, args, ctx) => {
    const listData = JSON.parse(args.jsonData);
    let res = [];
    const templateName = 'picking_list';
    const file = new AdmZip();
    const getAllSuppliers = [...new Set(listData.map((x) => x.supplier))];
    fs.mkdir(path.join(__dirname, 'temp'), (err) => {
      if (err) {
        console.log(err);
      }
    });
    const reportPath = path.join(__dirname, 'temp');
    for await (const supplier of getAllSuppliers) {
      let newData: any = {};
      let newItems: any = [];
      const getDataBySupplier = listData.filter((x) => x.supplier === supplier);
      for await (const data of getDataBySupplier) {
        let newSku, oldSku;
        newData = {
          // pickSlip: '000000',
          supplier: data.supplier,
          date: data.date,
          windowTime: data.isUsingTimeFilter ? `Delivery Window: ${listData[0].windowFilter}` : '',
          items: []
        };
        const sortingSkus = data.invoices.OrderItem.sort((a, b) => a.sku_id - b.sku_id);
        for await (const item of sortingSkus) {
          newSku = item.sku_id;
          if (newSku === oldSku) {
          } else {
            newItems.push({
              skuCode: (item.sku_code = item.sku_code || 'N/A'),
              stockLocation: (item.stock_location = item.stock_location || 'N/A'),
              skuName: item.sku.name,
              skuUomName: item.sku.uom.name,
              supplier: (item.supplier = item.sku?.SkuActualSkus?.[0]?.actual_sku?.supplier?.name || 'N/A'),
              totalQty: sortingSkus
                .filter((x) => x.sku_id === item.sku_id)
                .reduce((a, b) => {
                  return a + b.total_qty;
                }, 0)
            });
            newData.items = newItems;
          }
          oldSku = item.sku_id;
        }
      }
      const pdf = await new PDF(templateName).startPuppeteer();
      const generatePdf = await pdf.generatePDF(
        newData,
        {
          format: 'A4',
          margin: {
            top: '20px',
            left: '20px',
            right: '20px',
            bottom: '20px'
          }
        },
        'buffer'
      );
      await pdf.closePuppeteer();

      const addLocalFile = await file.addFile(`Supplier_${supplier}_PickLists.pdf`, generatePdf);
      // build base64 url string to upload to s3
      // const base64Pdf = `data:application/pdf;base64,${generatePdf}`;
      // res.push({
      //   file_name: `${templateName}_window`,
      //   pdf_base64: base64Pdf
      // });
    }
    const getDateForRandomName = getNewDate()
      .toJSON()
      .replace('-', '')
      .replace('-', '')
      .replace(':', '')
      .replace(':', '')
      .split('.')[0];
    const fileName = `pickingList_${getDateForRandomName}.zip`;
    const locationPath = `${reportPath}/${fileName}`;
    fs.writeFileSync(locationPath, file.toBuffer());

    const contents = fs.readFileSync(locationPath, { encoding: 'base64' });
    const base64Pdf = `data:@file/zip;base64,${contents}`;
    res.push({
      file_name: fileName,
      pdf_base64: base64Pdf
    });
    fs.unlink(locationPath, (err) => {
      if (err) throw err;
    });
    fs.rmdir(path.join(__dirname, 'temp'), (err) => console.log(err));
    return JSON.stringify(res);
  }
});
