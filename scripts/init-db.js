// سكربت تهيئة قاعدة البيانات
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

// إنشاء قاعدة البيانات
const db = new sqlite3.Database(path.join(__dirname, 'snotlex.db'));

// تنفيذ العمليات بشكل متسلسل
db.serialize(() => {
  // إنشاء جدول المستخدمين
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // إنشاء جدول الخدمات
  db.run(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      icon TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // إنشاء جدول معرض الأعمال
  db.run(`
    CREATE TABLE IF NOT EXISTS portfolio (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      image TEXT,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // إنشاء جدول الرسائل
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // إنشاء جدول الإعدادات
  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // التحقق من وجود مستخدم افتراضي
  db.get('SELECT * FROM users WHERE email = ?', ['admin@snotlex.com'], (err, user) => {
    if (err) {
      console.error('خطأ في التحقق من وجود المستخدم:', err);
      return;
    }

    // إذا لم يكن هناك مستخدم، قم بإنشاء مستخدم افتراضي
    if (!user) {
      // تشفير كلمة المرور
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync('admin123', salt);

      // إضافة المستخدم الافتراضي
      db.run(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Admin', 'admin@snotlex.com', hashedPassword, 'admin'],
        function(err) {
          if (err) {
            console.error('خطأ في إضافة المستخدم الافتراضي:', err);
            return;
          }
          console.log('تم إضافة المستخدم الافتراضي بنجاح');
        }
      );
    }
  });

  // إضافة خدمات افتراضية
  const defaultServices = [
    {
      title: 'تصميم الهوية البصرية',
      icon: 'fas fa-paint-brush',
      description: 'نقدم خدمات تصميم هوية بصرية متكاملة تعكس قيم علامتك التجارية وتميزها عن المنافسين.'
    },
    {
      title: 'العروض التقديمية',
      icon: 'fas fa-desktop',
      description: 'نصمم عروض تقديمية احترافية تساعدك على إيصال أفكارك بشكل واضح وجذاب.'
    },
    {
      title: 'تصميم الإعلانات',
      icon: 'fas fa-ad',
      description: 'نبتكر إعلانات مميزة للمنصات الرقمية والمطبوعة تجذب انتباه جمهورك المستهدف.'
    },
    {
      title: 'تصميم واجهات المستخدم',
      icon: 'fas fa-mobile-alt',
      description: 'نصمم واجهات مستخدم سهلة الاستخدام وجذابة للمواقع الإلكترونية والتطبيقات.'
    },
    {
      title: 'التصميم المطبوع',
      icon: 'fas fa-print',
      description: 'نقدم خدمات تصميم للمطبوعات بمختلف أنواعها من كتيبات ونشرات وبطاقات وغيرها.'
    },
    {
      title: 'تصميم الإنفوجرافيك',
      icon: 'fas fa-chart-pie',
      description: 'نحول البيانات المعقدة إلى رسومات معلوماتية سهلة الفهم وجذابة بصرياً.'
    }
  ];

  // التحقق من وجود خدمات
  db.get('SELECT COUNT(*) as count FROM services', (err, result) => {
    if (err) {
      console.error('خطأ في التحقق من وجود الخدمات:', err);
      return;
    }

    // إذا لم تكن هناك خدمات، قم بإضافة الخدمات الافتراضية
    if (result.count === 0) {
      const stmt = db.prepare('INSERT INTO services (title, icon, description) VALUES (?, ?, ?)');
      
      defaultServices.forEach(service => {
        stmt.run(service.title, service.icon, service.description);
      });
      
      stmt.finalize();
      console.log('تم إضافة الخدمات الافتراضية بنجاح');
    }
  });

  // إضافة إعدادات افتراضية
  const defaultSettings = [
    { key: 'site_title', value: 'Snotlex - خدمات تصميم جرافيك وعروض تقديمية' },
    { key: 'site_description', value: 'نقدم خدمات تصميم جرافيك وعروض تقديمية احترافية تساعدك على إيصال رسالتك بشكل مميز وجذاب' },
    { key: 'email', value: 'info@snotlex.com' },
    { key: 'phone', value: '+966 12 345 6789' },
    { key: 'address', value: 'الرياض، المملكة العربية السعودية' },
    { key: 'about_title', value: 'من نحن' },
    { key: 'about_content', value: 'Snotlex هي شركة متخصصة في تصميم الجرافيك والعروض التقديمية، تأسست بهدف تقديم حلول إبداعية تساعد الشركات والأفراد على إيصال رسائلهم بشكل مميز وفعال. نحن فريق من المصممين المحترفين والمبدعين الذين يجمعون بين الخبرة التقنية والرؤية الإبداعية لتقديم تصاميم عالية الجودة تلبي احتياجات عملائنا وتتجاوز توقعاتهم.' },
    { key: 'facebook', value: 'https://facebook.com/snotlex' },
    { key: 'twitter', value: 'https://twitter.com/snotlex' },
    { key: 'instagram', value: 'https://instagram.com/snotlex' },
    { key: 'linkedin', value: 'https://linkedin.com/company/snotlex' }
  ];

  // التحقق من وجود إعدادات
  db.get('SELECT COUNT(*) as count FROM settings', (err, result) => {
    if (err) {
      console.error('خطأ في التحقق من وجود الإعدادات:', err);
      return;
    }

    // إذا لم تكن هناك إعدادات، قم بإضافة الإعدادات الافتراضية
    if (result.count === 0) {
      const stmt = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
      
      defaultSettings.forEach(setting => {
        stmt.run(setting.key, setting.value);
      });
      
      stmt.finalize();
      console.log('تم إضافة الإعدادات الافتراضية بنجاح');
    }
  });
});

// إغلاق الاتصال بقاعدة البيانات عند الانتهاء
db.close((err) => {
  if (err) {
    console.error('خطأ في إغلاق قاعدة البيانات:', err);
    return;
  }
  console.log('تم إنشاء وتهيئة قاعدة البيانات بنجاح');
});
