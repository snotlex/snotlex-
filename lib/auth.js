import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'snotlex-secret-key';

// التحقق من رمز JWT
export async function verifyToken(req) {
  try {
    // الحصول على رمز المصادقة من رأس الطلب
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { success: false, message: 'رمز المصادقة غير موجود' };
    }
    
    // استخراج الرمز
    const token = authHeader.split(' ')[1];
    
    // التحقق من الرمز
    const decoded = jwt.verify(token, JWT_SECRET);
    
    return { success: true, user: decoded };
  } catch (error) {
    console.error('خطأ في التحقق من الرمز:', error);
    return { success: false, message: 'رمز المصادقة غير صالح' };
  }
}

// إنشاء middleware للتحقق من المصادقة
export function withAuth(handler) {
  return async (req, res) => {
    const authResult = await verifyToken(req);
    
    if (!authResult.success) {
      return res.status(401).json({ success: false, message: 'غير مصرح به' });
    }
    
    // إضافة معلومات المستخدم إلى الطلب
    req.user = authResult.user;
    
    // استدعاء معالج الطلب الأصلي
    return handler(req, res);
  };
}
