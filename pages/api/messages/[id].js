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
  
  // الحصول على رسالة محددة أو تحديث حالتها أو حذفها
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ success: false, message: 'معرف الرسالة مطلوب' });
  }
  
  // الحصول على رسالة محددة
  if (req.method === 'GET') {
    try {
      const message = await db.get('SELECT * FROM messages WHERE id = ?', [id]);
      
      if (!message) {
        return res.status(404).json({ success: false, message: 'الرسالة غير موجودة' });
      }
      
      return res.status(200).json({ success: true, data: message });
    } catch (error) {
      console.error('خطأ في الحصول على الرسالة:', error);
      return res.status(500).json({ success: false, message: 'حدث خطأ أثناء الحصول على الرسالة' });
    }
  }
  
  // تحديث حالة الرسالة
  else if (req.method === 'PUT') {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ success: false, message: 'حالة الرسالة مطلوبة' });
    }
    
    try {
      // التحقق من وجود الرسالة
      const existingMessage = await db.get('SELECT * FROM messages WHERE id = ?', [id]);
      
      if (!existingMessage) {
        return res.status(404).json({ success: false, message: 'الرسالة غير موجودة' });
      }
      
      // تحديث حالة الرسالة
      await db.run(
        'UPDATE messages SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, id]
      );
      
      const updatedMessage = await db.get('SELECT * FROM messages WHERE id = ?', [id]);
      
      return res.status(200).json({ success: true, data: updatedMessage });
    } catch (error) {
      console.error('خطأ في تحديث حالة الرسالة:', error);
      return res.status(500).json({ success: false, message: 'حدث خطأ أثناء تحديث حالة الرسالة' });
    }
  }
  
  // حذف رسالة
  else if (req.method === 'DELETE') {
    try {
      // التحقق من وجود الرسالة
      const existingMessage = await db.get('SELECT * FROM messages WHERE id = ?', [id]);
      
      if (!existingMessage) {
        return res.status(404).json({ success: false, message: 'الرسالة غير موجودة' });
      }
      
      // حذف الرسالة
      await db.run('DELETE FROM messages WHERE id = ?', [id]);
      
      return res.status(200).json({ success: true, message: 'تم حذف الرسالة بنجاح' });
    } catch (error) {
      console.error('خطأ في حذف الرسالة:', error);
      return res.status(500).json({ success: false, message: 'حدث خطأ أثناء حذف الرسالة' });
    }
  }
  
  else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).json({ success: false, message: `الطريقة ${req.method} غير مسموح بها` });
  }
}
