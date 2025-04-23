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
  
  // الحصول على جميع الأعمال
  if (req.method === 'GET') {
    try {
      const portfolio = await db.all('SELECT * FROM portfolio ORDER BY id DESC');
      return res.status(200).json({ success: true, data: portfolio });
    } catch (error) {
      console.error('خطأ في الحصول على الأعمال:', error);
      return res.status(500).json({ success: false, message: 'حدث خطأ أثناء الحصول على الأعمال' });
    }
  }
  
  // إضافة عمل جديد
  else if (req.method === 'POST') {
    const { title, category, image, description } = req.body;
    
    if (!title || !category) {
      return res.status(400).json({ success: false, message: 'العنوان والفئة مطلوبان' });
    }
    
    try {
      const result = await db.run(
        'INSERT INTO portfolio (title, category, image, description) VALUES (?, ?, ?, ?)',
        [title, category, image || null, description || null]
      );
      
      const newPortfolioItem = await db.get('SELECT * FROM portfolio WHERE id = ?', [result.lastID]);
      
      return res.status(201).json({ success: true, data: newPortfolioItem });
    } catch (error) {
      console.error('خطأ في إضافة عمل جديد:', error);
      return res.status(500).json({ success: false, message: 'حدث خطأ أثناء إضافة عمل جديد' });
    }
  }
  
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ success: false, message: `الطريقة ${req.method} غير مسموح بها` });
  }
}
