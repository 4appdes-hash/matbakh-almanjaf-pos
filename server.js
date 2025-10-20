
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const ExcelJS = require('exceljs');
const dayjs = require('dayjs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json({limit:'1mb'}));
app.use(express.static(path.join(__dirname,'public')));

let invoices = [];
app.post('/log-invoice', (req,res)=>{
  const d = req.body || {};
  d.inv_no = invoices.length + 1;
  d.created_at = dayjs().format('YYYY-MM-DD HH:mm');
  invoices.push(d);
  res.json({ok:true, inv_no:d.inv_no});
});

app.get('/export-today.xlsx', async (req,res)=>{
  const workbook = new ExcelJS.Workbook();
  const ws = workbook.addWorksheet('الفواتير');
  ws.columns = [
    { header:'نوع الفاتورة', key:'inv_type', width:12 },
    { header:'رقم الفاتورة', key:'inv_no', width:12 },
    { header:'التاريخ', key:'created_at', width:18 },
    { header:'اسم العميل', key:'customer', width:18 },
    { header:'الجوال', key:'mobile', width:14 },
    { header:'نوع الطلب/الطبخ', key:'cook_type', width:18 },
    { header:'حالة الدفع', key:'pay_status', width:12 },
    { header:'وقت الاستلام', key:'pickup_time', width:16 },
    { header:'عدد الذبايح', key:'animals', width:12 },
    { header:'نوع الوجبة', key:'meal_type', width:14 },
    { header:'عدد الصحون', key:'plates', width:12 },
    { header:'التفصيل', key:'details', width:24 },
    { header:'مقبلات ح', key:'starter_h', width:10 },
    { header:'مقبلات ل', key:'starter_l', width:10 },
    { header:'مقبلات خ', key:'starter_kh', width:10 },
    { header:'مقبلات ط', key:'starter_t', width:10 },
    { header:'التأمين', key:'deposit', width:10 },
    { header:'سعر الطبخ', key:'unit_price', width:12 },
    { header:'الإجمالي', key:'total', width:12 },
    { header:'الضريبة 15%', key:'vat', width:12 },
    { header:'الإجمالي مع الضريبة', key:'grand_total', width:16 },
  ];
  invoices.forEach(row=>ws.addRow(row));
  res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition','attachment; filename="سجل_اليوم.xlsx"');
  await workbook.xlsx.write(res);
  res.end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('✅ يعمل على Render — المسار /'));
