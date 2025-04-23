import { initDb } from '../../../lib/db';

export default async function handler(req, res) {
  // تهيئة قاعدة البيانات
  const db = await initDb();
  
  // إضافة رسالة جديدة من نموذج الاتصال
  if (req.method === 'POST') {
    const { name, email, phone, subject, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'الاسم والبريد الإلكتروني والرسالة مطلوبة' });
    }
    
    try {
      const result = await db.run(
        'INSERT INTO messages (name, email, phone, subject, message, status) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email, phone || null, subject || null, message, 'new']
      );
      
      return res.status(201).json({ success: true, message: 'تم إرسال رسالتك بنجاح' });
    } catch (error) {
      console.error('خطأ في إضافة رسالة جديدة:', error);
      return res.status(500).json({ success: false, message: 'حدث خطأ أثناء إرسال الرسالة' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: `الطريقة ${req.method} غير مسموح بها` });
  }
}
