// জ্ঞানবিজ্ঞান backend starter — Node.js 18+
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json({limit:'100kb'}));
app.use(express.static(path.join(__dirname,'public')));
const DATA = path.join(__dirname,'submissions.json');
function readItems(){try{return JSON.parse(fs.readFileSync(DATA,'utf8'))}catch{return []}}
function saveItems(items){fs.writeFileSync(DATA,JSON.stringify(items,null,2))}
app.post('/api/ask', async (req,res)=>{
  const {question,level='মাধ্যমিক'}=req.body||{};
  if(typeof question!=='string'||!question.trim()||question.length>5000)return res.status(400).json({error:'প্রশ্নটি সঠিকভাবে লিখো (সর্বোচ্চ ৫০০০ অক্ষর)।'});
  if(!process.env.OPENAI_API_KEY)return res.status(503).json({error:'AI এখনো সেটআপ করা হয়নি।'});
  try{
    const response=await fetch('https://api.openai.com/v1/responses',{
      method:'POST',headers:{'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4.1-mini',instructions:`তুমি জ্ঞানবিজ্ঞান নামের বাংলা শিক্ষামূলক সাইটের সহকারী। শিক্ষার স্তর: ${level}। সহজ বাংলায় ধাপে ধাপে উত্তর দাও, সূত্রের প্রতীক ব্যাখ্যা করো, প্রয়োজন হলে উদাহরণ দাও। নিশ্চিত না হলে তা স্পষ্ট বলো; বানানো তথ্য বা সূত্র দেবে না। বিপজ্জনক/ক্ষতিকর অনুরোধে নিরাপদ বিকল্প দাও।`,input:question})
    });
    const data=await response.json(); if(!response.ok)return res.status(502).json({error:'AI সেবা থেকে উত্তর পাওয়া যায়নি।'});
    const answer=(data.output||[]).flatMap(x=>x.content||[]).filter(x=>x.type==='output_text').map(x=>x.text).join('\n').trim();
    if(!answer)return res.status(502).json({error:'উত্তর তৈরি হয়নি। আবার চেষ্টা করো।'});
    res.json({answer});
  }catch(e){res.status(500).json({error:'সার্ভারে সমস্যা হয়েছে। পরে চেষ্টা করো।'});}
});
app.post('/api/submissions',(req,res)=>{
  const {author='',title,category='অন্যান্য',content}=req.body||{};
  if(typeof title!=='string'||!title.trim()||typeof content!=='string'||!content.trim())return res.status(400).json({error:'শিরোনাম ও লেখা দিতে হবে।'});
  if(title.length>180||content.length>12000||author.length>100)return res.status(400).json({error:'লেখা নির্ধারিত সীমার চেয়ে বড়।'});
  const items=readItems();const item={id:Date.now().toString(36),author:author.trim(),title:title.trim(),category,content:content.trim(),status:'pending',createdAt:new Date().toISOString()};
  items.unshift(item);saveItems(items);res.status(201).json({ok:true,id:item.id});
});
// Admin review API: protect this endpoint with a strong ADMIN_TOKEN environment variable.
app.get('/api/admin/submissions',(req,res)=>{
  if(!process.env.ADMIN_TOKEN||req.get('x-admin-token')!==process.env.ADMIN_TOKEN)return res.status(401).json({error:'অনুমতি নেই'});
  res.json(readItems());
});
app.post('/api/admin/submissions/:id',(req,res)=>{
  if(!process.env.ADMIN_TOKEN||req.get('x-admin-token')!==process.env.ADMIN_TOKEN)return res.status(401).json({error:'অনুমতি নেই'});
  const status=req.body?.status;if(!['approved','rejected','pending'].includes(status))return res.status(400).json({error:'অবৈধ স্ট্যাটাস'});
  const items=readItems(),i=items.findIndex(x=>x.id===req.params.id);if(i<0)return res.status(404).json({error:'লেখা পাওয়া যায়নি'});
  items[i].status=status;saveItems(items);res.json({ok:true});
});
const port=process.env.PORT||3000;app.listen(port,()=>console.log(`জ্ঞানবিজ্ঞান চলছে: http://localhost:${port}`));
