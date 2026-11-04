const d=(n)=>{const x=new Date();x.setHours(0,0,0,0);x.setDate(x.getDate()+n);return x.getTime()}
export const STAGES=['lead','talk','proposal','negotiation','won']
export const people=[
['p1','Layla Haddad','ليلى حداد','Nile Logistics','النيل للوجستيات','COO','مديرة العمليات','Cairo','القاهرة','Referral'],
['p2','Omar Farouk','عمر فاروق','Delta Foods','دلتا للأغذية','Head of Procurement','رئيس المشتريات','Alexandria','الإسكندرية','Website'],
['p3','Sarah Klein','سارة كلاين','Brightline GmbH','برايتلاين','VP Sales','نائبة رئيس المبيعات','Berlin','برلين','Event'],
['p4','Yusuf Al-Amin','يوسف الأمين','Gulf Horizon','أفق الخليج','CEO','الرئيس التنفيذي','Dubai','دبي','Referral'],
['p5','Nour Saad','نور سعد','Saad Clinics','عيادات سعد','Founder','المؤسسة','Amman','عمّان','Outbound'],
['p6','Marco Bellini','ماركو بيليني','Bellini Studio','استوديو بيليني','Creative Director','المدير الإبداعي','Milan','ميلانو','Website'],
['p7','Hala Mansour','هالة منصور','Mansour Retail','منصور للتجزئة','CFO','المديرة المالية','Riyadh','الرياض','Event'],
['p8','Ahmed Zaki','أحمد زكي','Zaki Builders','زكي للمقاولات','Owner','المالك','Giza','الجيزة','Outbound'],
['p9','Ines Moreau','إينيس مورو','Atelier Moreau','أتيليه مورو','Managing Partner','الشريكة المديرة','Paris','باريس','Referral'],
['p10','Karim Nasser','كريم ناصر','Nasser Telecom','ناصر للاتصالات','CTO','المدير التقني','Cairo','القاهرة','Website'],
['p11','Dina Rahal','دينا رحال','Rahal Education','رحال للتعليم','Director','المديرة','Beirut','بيروت','Outbound'],
['p12','Tariq Aziz','طارق عزيز','Aziz Energy','عزيز للطاقة','Procurement Lead','مسؤول المشتريات','Doha','الدوحة','Event'],
].map(([id,en,ar,ce,ca,re,ra,cie,cia,src],i)=>({id,name:{en,ar},company:{en:ce,ar:ca},role:{en:re,ar:ra},city:{en:cie,ar:cia},source:src,hue:[160,35,12,200,280,330,95,50,180,250,20,120][i],email:en.split(' ')[0].toLowerCase()+'@'+ce.split(' ')[0].toLowerCase()+'.com',phone:'+20 10'+(1000000+i*83719).toString().slice(0,8),last:d(-(i%6)-0)}))
export const deals=[
['d1','p1','Fleet tracking rollout','تطبيق تتبع الأسطول',84000,'negotiation',80,3],
['d2','p2','Annual supply agreement','اتفاقية توريد سنوية',126000,'proposal',55,9],
['d3','p3','Sales enablement suite','منصة تمكين المبيعات',48000,'talk',35,14],
['d4','p4','Regional expansion advisory','استشارات التوسع الإقليمي',210000,'negotiation',70,5],
['d5','p5','Clinic booking system','نظام حجز العيادات',32000,'proposal',50,11],
['d6','p6','Brand identity retainer','عقد هوية بصرية',18500,'won',100,-2],
['d7','p7','ERP finance module','وحدة مالية ERP',95000,'talk',30,21],
['d8','p8','Site safety dashboards','لوحات سلامة المواقع',27000,'lead',15,30],
['d9','p9','Boutique e-commerce','متجر إلكتروني',41000,'proposal',45,12],
['d10','p10','Network monitoring','مراقبة الشبكات',73000,'talk',40,18],
['d11','p11','LMS pilot','تجربة نظام تعلم',22000,'lead',20,26],
['d12','p12','Energy analytics','تحليلات الطاقة',150000,'lead',25,40],
['d13','p1','Warehouse automation','أتمتة المستودعات',64000,'won',100,-9],
['d14','p4','Training programme','برنامج تدريبي',36000,'won',100,-15],
].map(([id,pid,en,ar,value,stage,prob,close])=>({id,pid,title:{en,ar},value,stage,prob,close:d(close)}))
export const messages=[
['t1','p1',[['in','Hi! We reviewed the contract. Can we move the go-live to the 15th?','مرحبًا! راجعنا العقد. هل يمكن تأجيل الإطلاق إلى يوم 15؟',-0.2]],true],
['t2','p4',[['out','Sharing the revised scope as discussed.','أرسل لكم النطاق المعدّل كما اتفقنا.',-1.1],['in','Perfect, the board meets Thursday. Please add a pricing summary.','ممتاز، المجلس يجتمع الخميس. أضيفوا ملخص الأسعار.',-0.6]],true],
['t3','p2',[['in','Do you support quarterly invoicing instead of annual?','هل تدعمون الفوترة الربع سنوية بدل السنوية؟',-1.4]],true],
['t4','p5',[['out','Demo link for the booking flow is ready.','رابط العرض التجريبي لتدفق الحجز جاهز.',-2.2],['in','Looks great — sending to my partners.','رائع — سأرسله لشركائي.',-2.0]],false],
['t5','p9',[['in','Could you send a few references from retail clients?','ممكن ترسلوا مراجع من عملاء التجزئة؟',-3.1]],false],
['t6','p3',[['out','Thanks for visiting our booth! Here is the brochure.','شكرًا لزيارتكم جناحنا! هذا الكتيب.',-5],['in','Let us schedule a call next week.','لنحدد مكالمة الأسبوع القادم.',-4.5]],false],
].map(([id,pid,ms,unread])=>({id,pid,unread,msgs:ms.map(([dir,en,ar,t],i)=>({id:id+'m'+i,dir,text:{en,ar},at:Date.now()+t*864e5}))}))
export const tasks=[
['k1','Reply to Layla about go-live date','الرد على ليلى بخصوص موعد الإطلاق','d1',0,false],
['k2','Send pricing summary to Yusuf','إرسال ملخص الأسعار ليوسف','d4',0,false],
['k3','Prepare quarterly invoicing option for Delta','تجهيز خيار الفوترة الربع سنوية لدلتا','d2',1,false],
['k4','Collect retail references for Atelier Moreau','جمع مراجع تجزئة لأتيليه مورو','d9',1,false],
['k5','Follow up with Saad Clinics partners','متابعة شركاء عيادات سعد','d5',2,false],
['k6','Invoice Bellini retainer — month 1','فاتورة عقد بيليني — الشهر الأول','d6',-1,true],
].map(([id,en,ar,deal,due,done])=>({id,title:{en,ar},deal,due:d(due),done}))
export const events=[
['e1','Go-live call — Nile Logistics','مكالمة الإطلاق — النيل للوجستيات','p1',0,10,11,'call'],
['e2','Board prep — Gulf Horizon','تحضير المجلس — أفق الخليج','p4',0,13,14.5,'meet'],
['e3','Demo — Saad Clinics','عرض — عيادات سعد','p5',0,16,17,'demo'],
['e4','Contract review — Delta Foods','مراجعة العقد — دلتا','p2',1,11,12,'meet'],
['e5','Intro call — Brightline','مكالمة تعارف — برايتلاين','p3',2,9.5,10.5,'call'],
['e6','Proposal walkthrough — Atelier Moreau','شرح العرض — أتيليه مورو','p9',3,14,15,'demo'],
['e7','Discovery — Mansour Retail','استكشاف — منصور للتجزئة','p7',4,10,11.5,'meet'],
].map(([id,en,ar,pid,day,s,e,kind])=>({id,title:{en,ar},pid,day,s,e,kind}))
export const revenue=[38,52,47,66,59,81,74,96,88,112,104,131]
