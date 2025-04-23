import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب الخدمات
        const servicesResponse = await fetch('/api/public/services');
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          setServices(servicesData.data);
        }

        // جلب الإعدادات
        const settingsResponse = await fetch('/api/public/settings');
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          setSettings(settingsData.data);
        }
      } catch (error) {
        console.error('خطأ في جلب البيانات:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-bg-light">
      {/* Header */}
      <header className="bg-white shadow-md fixed w-full top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="h-12 w-12 relative mr-2">
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
            
            <nav className={`absolute md:relative top-20 md:top-0 right-0 md:right-auto w-64 md:w-auto h-screen md:h-auto bg-white md:bg-transparent shadow-lg md:shadow-none transition-all duration-300 transform ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} z-40`}>
              <ul className="flex flex-col md:flex-row p-4 md:p-0">
                <li className="mb-4 md:mb-0 md:ml-6">
                  <Link href="/" className="font-semibold text-text-dark hover:text-primary-mid relative">
                    الرئيسية
                  </Link>
                </li>
                <li className="mb-4 md:mb-0 md:ml-6">
                  <Link href="#services" className="font-semibold text-text-dark hover:text-primary-mid relative">
                    خدماتنا
                  </Link>
                </li>
                <li className="mb-4 md:mb-0 md:ml-6">
                  <Link href="#portfolio" className="font-semibold text-text-dark hover:text-primary-mid relative">
                    أعمالنا
                  </Link>
                </li>
                <li className="mb-4 md:mb-0 md:ml-6">
                  <Link href="#about" className="font-semibold text-text-dark hover:text-primary-mid relative">
                    من نحن
                  </Link>
                </li>
                <li className="mb-4 md:mb-0 md:ml-6">
                  <Link href="#contact" className="font-semibold text-text-dark hover:text-primary-mid relative">
                    اتصل بنا
                  </Link>
                </li>
                <li className="mb-4 md:mb-0 md:ml-6">
                  <Link href="/admin" className="font-semibold text-primary-mid hover:text-primary-dark relative">
                    لوحة الإدارة
                  </Link>
                </li>
              </ul>
            </nav>
            
            <button 
              className="md:hidden text-2xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <i className="fas fa-times"></i>
              ) : (
                <i className="fas fa-bars"></i>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-light/10 to-primary-dark/10 pt-32 pb-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-light to-primary-dark bg-clip-text text-transparent">
            إبداع بلا حدود
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            {settings.site_description || 'نقدم خدمات تصميم جرافيك وعروض تقديمية احترافية تساعدك على إيصال رسالتك بشكل مميز وجذاب'}
          </p>
          <div>
            <Link href="#services" className="btn btn-primary">
              استكشف خدماتنا
            </Link>
            <Link href="#contact" className="btn btn-outline mr-4">
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="section-title">
            <h2>خدماتنا</h2>
            <p>نقدم مجموعة متنوعة من خدمات التصميم الجرافيكي والعروض التقديمية لتلبية احتياجاتك</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-mid"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <div className="w-20 h-20 mx-auto mt-8 mb-4 flex items-center justify-center bg-gradient-to-r from-primary-light to-primary-dark rounded-full text-white">
                    <i className={service.icon + " text-2xl"}></i>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-4">
                      {service.description}
                    </p>
                    <Link href="#contact" className="btn btn-outline inline-block">
                      اطلب الخدمة
                    </Link>
                  </div>
                </div>
              ))}
              
              {services.length === 0 && !loading && (
                <div className="col-span-3 text-center py-8 text-gray-500">
                  لا توجد خدمات متاحة حالياً.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-r from-primary-light/10 to-primary-dark/10">
        <div className="container mx-auto px-4">
          <div className="section-title">
            <h2>{settings.about_title || 'من نحن'}</h2>
          </div>
          
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg leading-relaxed mb-8">
              {settings.about_content || 'Snotlex هي شركة متخصصة في تصميم الجرافيك والعروض التقديمية، تأسست بهدف تقديم حلول إبداعية تساعد الشركات والأفراد على إيصال رسائلهم بشكل مميز وفعال. نحن فريق من المصممين المحترفين والمبدعين الذين يجمعون بين الخبرة التقنية والرؤية الإبداعية لتقديم تصاميم عالية الجودة تلبي احتياجات عملائنا وتتجاوز توقعاتهم.'}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="section-title">
            <h2>اتصل بنا</h2>
            <p>نحن هنا للإجابة على استفساراتك ومساعدتك في تحقيق رؤيتك</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-6">معلومات التواصل</h3>
              
              <div className="flex items-start mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-light to-primary-dark flex items-center justify-center text-white ml-4 flex-shrink-0">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1">العنوان</h4>
                  <p className="text-gray-600">{settings.address || 'الرياض، المملكة العربية السعودية'}</p>
                </div>
              </div>
              
              <div className="flex items-start mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-light to-primary-dark flex items-center justify-center text-white ml-4 flex-shrink-0">
                  <i className="fas fa-phone"></i>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1">الهاتف</h4>
                  <p className="text-gray-600">{settings.phone || '+966 12 345 6789'}</p>
                </div>
              </div>
              
              <div className="flex items-start mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-light to-primary-dark flex items-center justify-center text-white ml-4 flex-shrink-0">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1">البريد الإلكتروني</h4>
                  <p className="text-gray-600">{settings.email || 'info@snotlex.com'}</p>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4">تابعنا على</h4>
                <div className="flex">
                  {settings.facebook && (
                    <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-light to-primary-dark flex items-center justify-center text-white ml-2 transition-all hover:-translate-y-1">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                  )}
                  {settings.twitter && (
                    <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-light to-primary-dark flex items-center justify-center text-white ml-2 transition-all hover:-translate-y-1">
                      <i className="fab fa-twitter"></i>
                    </a>
                  )}
                  {settings.instagram && (
                    <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-light to-primary-dark flex items-center justify-center text-white ml-2 transition-all hover:-translate-y-1">
                      <i className="fab fa-instagram"></i>
                    </a>
                  )}
                  {settings.linkedin && (
                    <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-light to-primary-dark flex items-center justify-center text-white transition-all hover:-translate-y-1">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-6">أرسل لنا رسالة</h3>
              
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bg-dark text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 relative ml-2">
                  <Image 
                    src="/images/logo.png" 
                    alt="Snotlex Logo" 
                    layout="fill" 
                    objectFit="contain" 
                  />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-primary-light to-primary-dark bg-clip-text text-transparent">
                  Snotlex
                </h3>
              </div>
              <p className="text-gray-400 mb-4">
                {settings.site_description || 'نقدم خدمات تصميم جرافيك وعروض تقديمية احترافية تساعدك على إيصال رسالتك بشكل مميز وجذاب.'}
              </p>
              <div className="flex">
                {settings.facebook && (
                  <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-light to-primary-dark flex items-center justify-center text-white ml-2 transition-all hover:-translate-y-1">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                )}
                {settings.twitter && (
                  <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-light to-primary-dark flex items-center justify-center text-white ml-2 transition-all hover:-translate-y-1">
                    <i className="fab fa-twitter"></i>
                  </a>
                )}
                {settings.instagram && (
                  <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-light to-primary-dark flex items-center justify-center text-white ml-2 transition-all hover:-translate-y-1">
                    <i className="fab fa-instagram"></i>
                  </a>
                )}
                {settings.linkedin && (
                  <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-light to-primary-dark flex items-center justify-center text-white transition-all hover:-translate-y-1">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 pb-2 border-b border-gray-700 relative">
                روابط سريعة
                <span className="absolute bottom-0 right-0 w-12 h-0.5 bg-gradient-to-r from-primary-light to-primary-dark"></span>
              </h4>
              <ul>
                <li className="mb-2">
                  <Link href="/" className="text-gray-400 hover:text-primary-light transition-colors">
                    الرئيسية
                  </Link>
                </li>
                <li className="mb-2">
                  <Link href="#services" className="text-gray-400 hover:text-primary-light transition-colors">
                    خدماتنا
                  </Link>
                </li>
                <li className="mb-2">
                  <Link href="#portfolio" className="text-gray-400 hover:text-primary-light transition-colors">
                    أعمالنا
                  </Link>
                </li>
                <li className="mb-2">
                  <Link href="#about" className="text-gray-400 hover:text-primary-light transition-colors">
                    من نحن
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="text-gray-400 hover:text-primary-light transition-colors">
                    اتصل بنا
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 pb-2 border-b border-gray-700 relative">
                معلومات التواصل
                <span className="absolute bottom-0 right-0 w-12 h-0.5 bg-gradient-to-r from-primary-light to-primary-dark"></span>
              </h4>
              <div className="flex items-start mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-light to-primary-dark flex items-center justify-center text-white ml-3 flex-shrink-0">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <span className="text-gray-400">{settings.address || 'الرياض، المملكة العربية السعودية'}</span>
              </div>
              <div className="flex items-start mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-light to-primary-dark flex items-center justify-center text-white ml-3 flex-shrink-0">
                  <i className="fas fa-phone"></i>
                </div>
                <span className="text-gray-400">{settings.phone || '+966 12 345 6789'}</span>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-light to-primary-dark flex items-center justify-center text-white ml-3 flex-shrink-0">
                  <i className="fas fa-envelope"></i>
                </div>
                <span className="text-gray-400">{settings.email || 'info@snotlex.com'}</span>
              </div>
            </div>
          </div>
          
          <div className="text-center pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Snotlex. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// مكون نموذج الاتصال
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/public/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        setError(data.message || 'حدث خطأ أثناء إرسال الرسالة');
      }
    } catch (err) {
      setError('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm mb-4">
          {success}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            الاسم
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-mid focus:border-primary-mid"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-mid focus:border-primary-mid"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            رقم الهاتف
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-mid focus:border-primary-mid"
          />
        </div>
        
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            الموضوع
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-mid focus:border-primary-mid"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          الرسالة
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="5"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-mid focus:border-primary-mid"
          required
        ></textarea>
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
          {loading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
        </button>
      </div>
    </form>
  );
}
