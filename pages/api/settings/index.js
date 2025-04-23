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
  
  // الحصول على جميع الإعدادات
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
  }
  
  // تحديث الإعدادات
  else if (req.method === 'PUT') {
    const settings = req.body;
    
    if (!settings || Object.keys(settings).length === 0) {
      return res.status(400).json({ success: false, message: 'لم يتم توفير إعدادات للتحديث' });
    }
    
    try {
      // تحديث كل إعداد
      for (const [key, value] of Object.entries(settings)) {
        await db.run(
          'UPDATE settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?',
          [value, key]
        );
      }
      
      // الحصول على الإعدادات المحدثة
      const updatedSettings = await db.all('SELECT * FROM settings');
      
      // تحويل الإعدادات إلى كائن
      const settingsObj = {};
      updatedSettings.forEach(setting => {
        settingsObj[setting.key] = setting.value;
      });
      
      return res.status(200).json({ success: true, data: settingsObj });
    } catch (error) {
      console.error('خطأ في تحديث الإعدادات:', error);
      return res.status(500).json({ success: false, message: 'حدث خطأ أثناء تحديث الإعدادات' });
    }
  }
  
  else {
    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).json({ success: false, message: `الطريقة ${req.method} غير مسموح بها` });
  }
}
