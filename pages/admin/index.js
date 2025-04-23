import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // التحقق مما إذا كان المستخدم مسجل الدخول بالفعل
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // تخزين رمز JWT في localStorage
        localStorage.setItem('token', data.token);
        // إعادة التوجيه إلى لوحة الإدارة
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'حدث خطأ أثناء تسجيل الدخول');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary-light/10 to-primary-dark/10 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center">
              <div className="h-12 w-12 relative ml-2">
                <Image 
                  src="/images/logo.png" 
                  alt="Snotlex Logo" 
                  layout="fill" 
                  objectFit="contain" 
                />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-light to-primary-dark bg-clip-text text-transparent">
                Snotlex
              </h1>
            </div>
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            تسجيل الدخول إلى لوحة الإدارة
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            أدخل بيانات الاعتماد الخاصة بك للوصول إلى لوحة الإدارة
          </p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-mid focus:border-primary-mid"
              placeholder="أدخل بريدك الإلكتروني"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              كلمة المرور
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-mid focus:border-primary-mid"
              placeholder="أدخل كلمة المرور"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary flex justify-center items-center"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-primary-mid hover:text-primary-dark">
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>للتجربة، استخدم:</p>
          <p>البريد الإلكتروني: admin@snotlex.com</p>
          <p>كلمة المرور: admin123</p>
        </div>
      </div>
    </div>
  );
}
