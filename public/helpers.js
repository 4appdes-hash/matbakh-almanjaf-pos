/* global db, QRCode */
function tlv(tag,val){const te=new TextEncoder();const v=te.encode(String(val));return new Uint8Array([tag,v.length,...v]);}
function genZatcaTLVBase64({seller,vat,dt,total,tax}){
  const parts=[tlv(1,seller),tlv(2,vat),tlv(3,dt),tlv(4,String(total)),tlv(5,String(tax))];
  let len=parts.reduce((a,b)=>a+b.length,0);
  let out=new Uint8Array(len),o=0;parts.forEach(x=>{out.set(x,o);o+=x.length});
  return btoa(String.fromCharCode(...out));
}
async function writeInvoiceToFirestore(payload){
  try{
    const r = await db.collection('invoices').add(payload);
    return {ok:true, id:r.id};
  }catch(e){
    console.error('Firestore error', e);
    return {ok:false, error:String(e)};
  }
}
async function saveServerLog(payload){
  try{
    const r = await fetch('/log-invoice',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const out = await r.json();
    return out;
  }catch(e){ return {ok:false, error:String(e)}; }
}
