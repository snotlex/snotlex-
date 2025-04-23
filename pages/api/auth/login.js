import { initDb } from '../../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'snotlex-secret-key';

export default async function handler(req, res) {
  // تهيئة قاعدة البيانات
  const db = await initDb();
  
  if (req.method === 'POST') {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'يرجى توفير البريد الإلكتروني وكلمة المرور' });
    }
    
    try {
      // البحث عن المستخدم في قاعدة البيانات
      const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
      
      if (!user) {
        return res.status(401).json({ success: false, message: 'بيانات الاعتماد غير صحيحة' });
      }
      
      // التحقق من كلمة المرور
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'بيانات الاعتماد غير صحيحة' });
      }
      
      // إنشاء رمز JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '1d' }
      );
      
      // إرجاع رمز JWT
      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error);
      return res.status(500).json({ success: false, message: 'حدث خطأ أثناء تسجيل الدخول' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: `الطريقة ${req.method} غير مسموح بها` });
  }
}
