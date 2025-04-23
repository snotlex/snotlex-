import { initDb } from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';

export default async function handler(req, res) {
  // تهيئة قاعدة البيانات
  const db = await initDb();
  
  // التحقق من المصادقة
  const authResult = await verifyToken(req);
  if (!authResult.success) {
    return res.status(401).json({ success: false, message: 'غير مصرح به' });
  }
  
  // الحصول على جميع الخدمات
  if (req.method === 'GET') {
    try {
      const services = await db.all('SELECT * FROM services ORDER BY id DESC');
      return res.status(200).json({ success: true, data: services });
    } catch (error) {
      console.error('خطأ في الحصول على الخدمات:', error);
      return res.status(500).json({ success: false, message: 'حدث خطأ أثناء الحصول على الخدمات' });
    }
  }
  
  // إضافة خدمة جديدة
  else if (req.method === 'POST') {
    const { title, icon, description } = req.body;
    
    if (!title || !icon || !description) {
      return res.status(400).json({ success: false, message: 'جميع الحقول مطلوبة' });
    }
    
    try {
      const result = await db.run(
        'INSERT INTO services (title, icon, description) VALUES (?, ?, ?)',
        [title, icon, description]
      );
      
      const newService = await db.get('SELECT * FROM services WHERE id = ?', [result.lastID]);
      
      return res.status(201).json({ success: true, data: newService });
    } catch (error) {
      console.error('خطأ في إضافة خدمة جديدة:', error);
      return res.status(500).json({ success: false, message: 'حدث خطأ أثناء إضافة خدمة جديدة' });
    }
  }
  
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ success: false, message: `الطريقة ${req.method} غير مسموح بها` });
  }
}
