const express=require('express');const path=require('path');const ExcelJS=require('exceljs');
const bodyParser=require('body-parser');const cors=require('cors');const dayjs=require('dayjs');
const app=express();app.use(cors());app.use(bodyParser.json());app.use(express.static(path.join(__dirname,'public')));
let invoices=[];
app.post('/log-invoice',(req,res)=>{const d=req.body||{};d.inv_no=invoices.length+1;d.created_at=dayjs().format('YYYY-MM-DD HH:mm');invoices.push(d);res.json({ok:true,inv_no:d.inv_no})});
app.get('/export-today.xlsx',async(req,res)=>{try{const wb=new ExcelJS.Workbook();const ws=wb.addWorksheet('الفواتير');
ws.columns=[
{header:'نوع الفاتورة',key:'inv_type',width:12},
{header:'رقم',key:'inv_no',width:10},
{header:'التاريخ',key:'created_at',width:18},
{header:'اسم',key:'customer',width:18},
{header:'الجوال',key:'mobile',width:14},
{header:'نوع',key:'order_type',width:16},
{header:'حالة الدفع',key:'pay_status',width:12},
{header:'وقت الاستلام',key:'pickup_time',width:16},
{header:'الإجمالي قبل الضريبة',key:'total',width:18},
{header:'الضريبة 15%',key:'vat',width:12},
{header:'الإجمالي مع الضريبة',key:'grand_total',width:18}
];
(invoices||[]).forEach(r=>ws.addRow(r));const buf=await wb.xlsx.writeBuffer();
res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
res.setHeader('Content-Disposition','attachment; filename="سجل_اليوم.xlsx"');
res.setHeader('Content-Length',buf.byteLength);return res.send(Buffer.from(buf));
}catch(e){console.error(e);return res.status(500).json({ok:false,error:'EXPORT_FAILED'})}});
process.on('unhandledRejection',r=>console.error(r));process.on('uncaughtException',e=>console.error(e));
app.listen(process.env.PORT||3000,()=>console.log('✅ يعمل'));