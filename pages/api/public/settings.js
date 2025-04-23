import { initDb } from '../../../lib/db';

export default async function handler(req, res) {
  // تهيئة قاعدة البيانات
  const db = await initDb();
  
  // الحصول على الإعدادات للعرض العام
  if (req.method === 'GET') {
    try {
      const settings = await db.all('SELECT * FROM settings');
      
      // تحويل الإعدادات إلى كائن
      const settingsObj = {};
      settings.forEach(setting => {
        settingsObj[setting.key] = setting.value;
      });
      
      return res.status(200).json({ success: true, data: settingsObj });
    } catch (error) {
      console.error('خطأ في الحصول على الإعدادات:', error);
      return res.status(500).json({ success: false, message: 'حدث خطأ أثناء الحصول على الإعدادات' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, message: `الطريقة ${req.method} غير مسموح بها` });
  }
}
