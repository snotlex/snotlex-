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
  
  // الحصول على خدمة محددة أو تحديثها أو حذفها
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ success: false, message: 'معرف الخدمة مطلوب' });
  }
  
  // الحصول على خدمة محددة
  if (req.method === 'GET') {
    try {
      const service = await db.get('SELECT * FROM services WHERE id = ?', [id]);
      
      if (!service) {
        return res.status(404).json({ success: false, message: 'الخدمة غير موجودة' });
      }
      
      return res.status(200).json({ success: true, data: service });
    } catch (error) {
      console.error('خطأ في الحصول على الخدمة:', error);
      return res.status(500).json({ success: false, message: 'حدث خطأ أثناء الحصول على الخدمة' });
    }
  }
  
  // تحديث خدمة
  else if (req.method === 'PUT') {
    const { title, icon, description } = req.body;
    
    if (!title || !icon || !description) {
      return res.status(400).json({ success: false, message: 'جميع الحقول مطلوبة' });
    }
    
    try {
      // التحقق من وجود الخدمة
      const existingService = await db.get('SELECT * FROM services WHERE id = ?', [id]);
      
      if (!existingService) {
        return res.status(404).json({ success: false, message: 'الخدمة غير موجودة' });
      }
      
      // تحديث الخدمة
      await db.run(
        'UPDATE services SET title = ?, icon = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [title, icon, description, id]
      );
      
      const updatedService = await db.get('SELECT * FROM services WHERE id = ?', [id]);
      
      return res.status(200).json({ success: true, data: updatedService });
    } catch (error) {
      console.error('خطأ في تحديث الخدمة:', error);
      return res.status(500).json({ success: false, message: 'حدث خطأ أثناء تحديث الخدمة' });
    }
  }
  
  // حذف خدمة
  else if (req.method === 'DELETE') {
    try {
      // التحقق من وجود الخدمة
      const existingService = await db.get('SELECT * FROM services WHERE id = ?', [id]);
      
      if (!existingService) {
        return res.status(404).json({ success: false, message: 'الخدمة غير موجودة' });
      }
      
      // حذف الخدمة
      await db.run('DELETE FROM services WHERE id = ?', [id]);
      
      return res.status(200).json({ success: true, message: 'تم حذف الخدمة بنجاح' });
    } catch (error) {
      console.error('خطأ في حذف الخدمة:', error);
      return res.status(500).json({ success: false, message: 'حدث خطأ أثناء حذف الخدمة' });
    }
  }
  
  else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).json({ success: false, message: `الطريقة ${req.method} غير مسموح بها` });
  }
}
