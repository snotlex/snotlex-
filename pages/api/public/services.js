import { initDb } from '../../../lib/db';

export default async function handler(req, res) {
  // تهيئة قاعدة البيانات
  const db = await initDb();
  
  // الحصول على جميع الخدمات للعرض العام
  if (req.method === 'GET') {
    try {
      const services = await db.all('SELECT * FROM services ORDER BY id ASC');
      return res.status(200).json({ success: true, data: services });
    } catch (error) {
      console.error('خطأ في الحصول على الخدمات:', error);
      return res.status(500).json({ success: false, message: 'حدث خطأ أثناء الحصول على الخدمات' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, message: `الطريقة ${req.method} غير مسموح بها` });
  }
}
