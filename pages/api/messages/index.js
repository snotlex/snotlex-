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
  
  // الحصول على جميع الرسائل
  if (req.method === 'GET') {
    try {
      const messages = await db.all('SELECT * FROM messages ORDER BY created_at DESC');
      return res.status(200).json({ success: true, data: messages });
    } catch (error) {
      console.error('خطأ في الحصول على الرسائل:', error);
      return res.status(500).json({ success: false, message: 'حدث خطأ أثناء الحصول على الرسائل' });
    }
  }
  
  else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, message: `الطريقة ${req.method} غير مسموح بها` });
  }
}
