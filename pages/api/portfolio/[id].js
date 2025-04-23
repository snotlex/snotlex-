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
  
  // الحصول على عمل محدد أو تحديثه أو حذفه
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ success: false, message: 'معرف العمل مطلوب' });
  }
  
  // الحصول على عمل محدد
  if (req.method === 'GET') {
    try {
      const portfolioItem = await db.get('SELECT * FROM portfolio WHERE id = ?', [id]);
      
      if (!portfolioItem) {
        return res.status(404).json({ success: false, message: 'العمل غير موجود' });
      }
      
      return res.status(200).json({ success: true, data: portfolioItem });
    } catch (error) {
      console.error('خطأ في الحصول على العمل:', error);
      return res.status(500).json({ success: false, message: 'حدث خطأ أثناء الحصول على العمل' });
    }
  }
  
  // تحديث عمل
  else if (req.method === 'PUT') {
    const { title, category, image, description } = req.body;
    
    if (!title || !category) {
      return res.status(400).json({ success: false, message: 'العنوان والفئة مطلوبان' });
    }
    
    try {
      // التحقق من وجود العمل
      const existingItem = await db.get('SELECT * FROM portfolio WHERE id = ?', [id]);
      
      if (!existingItem) {
        return res.status(404).json({ success: false, message: 'العمل غير موجود' });
      }
      
      // تحديث العمل
      await db.run(
        'UPDATE portfolio SET title = ?, category = ?, image = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [title, category, image || null, description || null, id]
      );
      
      const updatedItem = await db.get('SELECT * FROM portfolio WHERE id = ?', [id]);
      
      return res.status(200).json({ success: true, data: updatedItem });
    } catch (error) {
      console.error('خطأ في تحديث العمل:', error);
      return res.status(500).json({ success: false, message: 'حدث خطأ أثناء تحديث العمل' });
    }
  }
  
  // حذف عمل
  else if (req.method === 'DELETE') {
    try {
      // التحقق من وجود العمل
      const existingItem = await db.get('SELECT * FROM portfolio WHERE id = ?', [id]);
      
      if (!existingItem) {
        return res.status(404).json({ success: false, message: 'العمل غير موجود' });
      }
      
      // حذف العمل
      await db.run('DELETE FROM portfolio WHERE id = ?', [id]);
      
      return res.status(200).json({ success: true, message: 'تم حذف العمل بنجاح' });
    } catch (error) {
      console.error('خطأ في حذف العمل:', error);
      return res.status(500).json({ success: false, message: 'حدث خطأ أثناء حذف العمل' });
    }
  }
  
  else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).json({ success: false, message: `الطريقة ${req.method} غير مسموح بها` });
  }
}
