import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

// مكونات لوحة التحكم
const Sidebar = ({ activeMenu, setActiveMenu }) => {
  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: 'fas fa-tachometer-alt' },
    { id: 'services', label: 'الخدمات', icon: 'fas fa-cogs' },
    { id: 'portfolio', label: 'معرض الأعمال', icon: 'fas fa-images' },
    { id: 'about', label: 'من نحن', icon: 'fas fa-info-circle' },
    { id: 'messages', label: 'الرسائل', icon: 'fas fa-envelope' },
    { id: 'settings', label: 'الإعدادات', icon: 'fas fa-cog' },
  ];

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/admin');
  };

  return (
    <div className="bg-bg-dark text-white h-screen w-64 fixed right-0 top-0 overflow-y-auto">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-center">
          <div className="h-10 w-10 relative ml-2">
            <Image 
              src="/images/logo.png" 
              alt="Snotlex Logo" 
              layout="fill" 
              objectFit="contain" 
            />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary-light to-primary-dark bg-clip-text text-transparent">
            Snotlex
          </h1>
        </div>
      </div>
      
      <nav className="mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className="mb-2">
              <button
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center py-3 px-4 transition-colors ${
                  activeMenu === item.id
                    ? 'bg-primary-dark/20 border-r-4 border-primary-light'
                    : 'hover:bg-gray-800'
                }`}
              >
                <i className={`${item.icon} w-6`}></i>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
        <Link href="/" className="flex items-center text-gray-400 hover:text-white transition-colors">
          <i className="fas fa-external-link-alt ml-2"></i>
          <span>عرض الموقع</span>
        </Link>
        <button 
          onClick={handleLogout}
          className="flex items-center text-gray-400 hover:text-white transition-colors mt-3"
        >
          <i className="fas fa-sign-out-alt ml-2"></i>
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
};

// مكون لوحة التحكم الرئيسية
const DashboardContent = ({ services, portfolio, messages }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">لوحة التحكم</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-primary-light/20 flex items-center justify-center text-primary-light ml-4">
              <i className="fas fa-cogs text-xl"></i>
            </div>
            <div>
              <p className="text-gray-500 text-sm">الخدمات</p>
              <h3 className="text-2xl font-bold">{services.length}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-primary-mid/20 flex items-center justify-center text-primary-mid ml-4">
              <i className="fas fa-images text-xl"></i>
            </div>
            <div>
              <p className="text-gray-500 text-sm">معرض الأعمال</p>
              <h3 className="text-2xl font-bold">{portfolio.length}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-primary-dark/20 flex items-center justify-center text-primary-dark ml-4">
              <i className="fas fa-envelope text-xl"></i>
            </div>
            <div>
              <p className="text-gray-500 text-sm">الرسائل الجديدة</p>
              <h3 className="text-2xl font-bold">{messages.filter(msg => msg.status === 'new').length}</h3>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">آخر الرسائل</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-right">الاسم</th>
                <th className="py-3 px-4 text-right">البريد الإلكتروني</th>
                <th className="py-3 px-4 text-right">الموضوع</th>
                <th className="py-3 px-4 text-right">التاريخ</th>
                <th className="py-3 px-4 text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {messages.slice(0, 3).map(message => (
                <tr key={message.id} className="border-b">
                  <td className="py-3 px-4">{message.name}</td>
                  <td className="py-3 px-4">{message.email}</td>
                  <td className="py-3 px-4">{message.subject || 'بدون موضوع'}</td>
                  <td className="py-3 px-4">{new Date(message.created_at).toLocaleDateString('ar-SA')}</td>
                  <td className="py-3 px-4">
                    <button className="text-primary-mid hover:text-primary-dark ml-2">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {messages.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">لا توجد رسائل</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">إحصائيات الزيارات</h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">سيتم عرض رسم بياني للزيارات هنا</p>
        </div>
      </div>
    </div>
  );
};

// مكون إدارة الخدمات
const ServicesContent = ({ services, fetchServices }) => {
  const [showForm, setShowForm] = useState(false);
  const [currentService, setCurrentService] = useState({ id: null, title: '', icon: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleAddEdit = (service = null) => {
    if (service) {
      setCurrentService(service);
    } else {
      setCurrentService({ id: null, title: '', icon: '', description: '' });
    }
    setShowForm(true);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      let response;
      
      if (currentService.id) {
        // تحديث خدمة موجودة
        response = await fetch(`/api/services/${currentService.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(currentService)
        });
      } else {
        // إضافة خدمة جديدة
        response = await fetch('/api/services', {
          method: 'POST',
          headers,
          body: JSON.stringify(currentService)
        });
      }
      
      const data = await response.json();
      
      if (response.ok) {
        // إعادة تحميل الخدمات
        fetchServices();
        setShowForm(false);
        setCurrentService({ id: null, title: '', icon: '', description: '' });
      } else {
        setError(data.message || 'حدث خطأ أثناء حفظ الخدمة');
      }
    } catch (err) {
      setError('حدث خطأ أثناء حفظ الخدمة. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    if (confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/services/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          // إعادة تحميل الخدمات
          fetchServices();
        } else {
          const data = await response.json();
          alert(data.message || 'حدث خطأ أثناء حذف الخدمة');
        }
      } catch (err) {
        alert('حدث خطأ أثناء حذف الخدمة. يرجى المحاولة مرة أخرى.');
      }
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">إدارة الخدمات</h2>
        <button 
          onClick={() => handleAddEdit()}
          className="btn btn-primary"
        >
          <i className="fas fa-plus ml-2"></i>
          إضافة خدمة جديدة
        </button>
      </div>
      
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">
            {currentService.id ? 'تعديل خدمة' : 'إضافة خدمة جديدة'}
          </h3>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                عنوان الخدمة
              </label>
              <input
                type="text"
                id="title"
                value={currentService.title}
                onChange={(e) => setCurrentService({...currentService, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-mid"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="icon">
                أيقونة الخدمة (Font Awesome)
              </label>
              <input
                type="text"
                id="icon"
                value={currentService.icon}
                onChange={(e) => setCurrentService({...currentService, icon: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-mid"
                required
                placeholder="مثال: fas fa-paint-brush"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                وصف الخدمة
              </label>
              <textarea
                id="description"
                value={currentService.description}
                onChange={(e) => setCurrentService({...currentService, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-mid"
                rows="4"
                required
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-outline ml-2"
                disabled={loading}
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="btn btn-primary flex items-center"
                disabled={loading}
              >
                {loading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {currentService.id ? 'تحديث' : 'إضافة'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-light to-primary-dark flex items-center justify-center text-white ml-4">
                <i className={service.icon}></i>
              </div>
              <h3 className="text-xl font-bold">{service.title}</h3>
            </div>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <div className="flex justify-end">
              <button
                onClick={() => handleAddEdit(service)}
                className="text-primary-mid hover:text-primary-dark ml-3"
              >
                <i className="fas fa-edit"></i>
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="text-red-500 hover:text-red-700"
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        ))}
        
        {services.length === 0 && (
          <div className="col-span-2 text-center py-8 text-gray-500">
            لا توجد خدمات. قم بإضافة خدمة جديدة.
          </div>
        )}
      </div>
    </div>
  );
};

// مكون إدارة معرض الأعمال
const PortfolioContent = ({ portfolio, fetchPortfolio }) => {
  // يمكن إضافة وظائف مماثلة لإدارة معرض الأعمال هنا
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">إدارة معرض الأعمال</h2>
        <button className="btn btn-primary">
          <i className="fas fa-plus ml-2"></i>
          إضافة عمل جديد
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {portfolio.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-primary-light to-primary-dark flex items-center justify-center text-white">
              {item.image ? (
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <i className="fas fa-image text-4xl"></i>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{item.description || 'لا يوجد وصف'}</p>
              <div className="flex justify-end">
                <button className="text-primary-mid hover:text-primary-dark ml-3">
                  <i className="fas fa-edit"></i>
                </button>
                <button className="text-red-500 hover:text-red-700">
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {portfolio.length === 0 && (
          <div className="col-span-3 text-center py-8 text-gray-500">
            لا توجد أعمال في المعرض. قم بإضافة عمل جديد.
          </div>
        )}
      </div>
    </div>
  );
};

// مكون إدارة الرسائل
const MessagesContent = ({ messages, fetchMessages }) => {
  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        // إعادة تحميل الرسائل
        fetchMessages();
      } else {
        const data = await response.json();
        alert(data.message || 'حدث خطأ أثناء تحديث حالة الرسالة');
      }
    } catch (err) {
      alert('حدث خطأ أثناء تحديث حالة الرسالة. يرجى المحاولة مرة أخرى.');
    }
  };
  
  const handleDelete = async (id) => {
    if (confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/messages/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          // إعادة تحميل الرسائل
          fetchMessages();
        } else {
          const data = await response.json();
          alert(data.message || 'حدث خطأ أثناء حذف الرسالة');
        }
      } catch (err) {
        alert('حدث خطأ أثناء حذف الرسالة. يرجى المحاولة مرة أخرى.');
      }
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">إدارة الرسائل</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-right">الاسم</th>
                <th className="py-3 px-4 text-right">البريد الإلكتروني</th>
                <th className="py-3 px-4 text-right">الموضوع</th>
                <th className="py-3 px-4 text-right">التاريخ</th>
                <th className="py-3 px-4 text-right">الحالة</th>
                <th className="py-3 px-4 text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(message => (
                <tr key={message.id} className="border-b">
                  <td className="py-3 px-4">{message.name}</td>
                  <td className="py-3 px-4">{message.email}</td>
                  <td className="py-3 px-4">{message.subject || 'بدون موضوع'}</td>
                  <td className="py-3 px-4">{new Date(message.created_at).toLocaleDateString('ar-SA')}</td>
                  <td className="py-3 px-4">
                    {message.status === 'new' ? (
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">جديدة</span>
                    ) : (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">تم الرد</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-primary-mid hover:text-primary-dark ml-2">
                      <i className="fas fa-eye"></i>
                    </button>
                    {message.status === 'new' && (
                      <button 
                        className="text-green-500 hover:text-green-700 ml-2"
                        onClick={() => handleUpdateStatus(message.id, 'replied')}
                      >
                        <i className="fas fa-check"></i>
                      </button>
                    )}
                    <button 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(message.id)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
              
              {messages.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-4 text-center text-gray-500">لا توجد رسائل</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// مكون الإعدادات
const SettingsContent = ({ settings, fetchSettings }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);
  
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
      const token = localStorage.getItem('token');
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('تم حفظ الإعدادات بنجاح');
        fetchSettings();
      } else {
        setError(data.message || 'حدث خطأ أثناء حفظ الإعدادات');
      }
    } catch (err) {
      setError('حدث خطأ أثناء حفظ الإعدادات. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">إعدادات الموقع</h2>
      
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
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">معلومات الموقع</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="site_title">
              عنوان الموقع
            </label>
            <input
              type="text"
              id="site_title"
              name="site_title"
              value={formData.site_title || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-mid"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="site_description">
              وصف الموقع
            </label>
            <textarea
              id="site_description"
              name="site_description"
              value={formData.site_description || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-mid"
              rows="2"
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-mid"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              رقم الهاتف
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-mid"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
              العنوان
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-mid"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="about_title">
              عنوان صفحة من نحن
            </label>
            <input
              type="text"
              id="about_title"
              name="about_title"
              value={formData.about_title || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-mid"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="about_content">
              محتوى صفحة من نحن
            </label>
            <textarea
              id="about_content"
              name="about_content"
              value={formData.about_content || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-mid"
              rows="4"
            ></textarea>
          </div>
          
          <h3 className="text-xl font-bold mb-4 mt-8">روابط التواصل الاجتماعي</h3>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="facebook">
              فيسبوك
            </label>
            <input
              type="url"
              id="facebook"
              name="facebook"
              value={formData.facebook || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-mid"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="twitter">
              تويتر
            </label>
            <input
              type="url"
              id="twitter"
              name="twitter"
              value={formData.twitter || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-mid"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="instagram">
              انستغرام
            </label>
            <input
              type="url"
              id="instagram"
              name="instagram"
              value={formData.instagram || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-mid"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="linkedin">
              لينكد إن
            </label>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              value={formData.linkedin || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-mid"
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary flex items-center"
              disabled={loading}
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              حفظ التغييرات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isClient, setIsClient] = useState(false);
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [messages, setMessages] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  
  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/services', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setServices(data.data);
      } else {
        console.error('فشل في الحصول على الخدمات');
      }
    } catch (error) {
      console.error('خطأ في الحصول على الخدمات:', error);
    }
  };
  
  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/portfolio', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPortfolio(data.data);
      } else {
        console.error('فشل في الحصول على معرض الأعمال');
      }
    } catch (error) {
      console.error('خطأ في الحصول على معرض الأعمال:', error);
    }
  };
  
  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/messages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.data);
      } else {
        console.error('فشل في الحصول على الرسائل');
      }
    } catch (error) {
      console.error('خطأ في الحصول على الرسائل:', error);
    }
  };
  
  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSettings(data.data);
      } else {
        console.error('فشل في الحصول على الإعدادات');
      }
    } catch (error) {
      console.error('خطأ في الحصول على الإعدادات:', error);
    }
  };
  
  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/admin');
      return;
    }
    
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchServices(),
        fetchPortfolio(),
        fetchMessages(),
        fetchSettings()
      ]);
      setLoading(false);
    };
    
    fetchData();
  }, [router]);
  
  if (!isClient) {
    return null; // تجنب مشاكل عدم تطابق الترميز بين الخادم والعميل
  }
  
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-mid"></div>
        </div>
      );
    }
    
    switch (activeMenu) {
      case 'dashboard':
        return <DashboardContent services={services} portfolio={portfolio} messages={messages} />;
      case 'services':
        return <ServicesContent services={services} fetchServices={fetchServices} />;
      case 'portfolio':
        return <PortfolioContent portfolio={portfolio} fetchPortfolio={fetchPortfolio} />;
      case 'messages':
        return <MessagesContent messages={messages} fetchMessages={fetchMessages} />;
      case 'settings':
        return <SettingsContent settings={settings} fetchSettings={fetchSettings} />;
      default:
        return <DashboardContent services={services} portfolio={portfolio} messages={messages} />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      
      <div className="mr-64 p-8">
        {renderContent()}
      </div>
    </div>
  );
}
