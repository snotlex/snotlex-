import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// إنشاء اتصال بقاعدة البيانات
async function openDb() {
  return open({
    filename: './snotlex.db',
    driver: sqlite3.Database
  });
}

// تهيئة قاعدة البيانات وإنشاء الجداول
async function initDb() {
  const db = await openDb();
  
  // إنشاء جدول المستخدمين
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // إنشاء جدول الخدمات
  await db.exec(`
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
  await db.exec(`
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
  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'new',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // إنشاء جدول الإعدادات
  await db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // إضافة بيانات أولية للمستخدمين
  const adminUser = await db.get('SELECT * FROM users WHERE email = ?', ['admin@snotlex.com']);
  if (!adminUser) {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      ['admin', 'admin@snotlex.com', hashedPassword]
    );
  }
  
  // إضافة بيانات أولية للخدمات
  const servicesCount = await db.get('SELECT COUNT(*) as count FROM services');
  if (servicesCount.count === 0) {
    const initialServices = [
      {
        title: 'تصميم الهوية البصرية',
        icon: 'fas fa-paint-brush',
        description: 'نصمم هويات بصرية فريدة تعكس قيم علامتك التجارية وتميزها عن المنافسين، بدءاً من الشعار وحتى كافة عناصر الهوية.'
      },
      {
        title: 'تصميم العروض التقديمية',
        icon: 'fas fa-desktop',
        description: 'نصمم عروض تقديمية احترافية وجذابة تساعدك على إيصال أفكارك بوضوح وتأثير، سواء كانت للأعمال أو التعليم.'
      },
      {
        title: 'تصميم الإعلانات',
        icon: 'fas fa-bullhorn',
        description: 'نصمم إعلانات مبتكرة للمنصات الرقمية والمطبوعة تجذب انتباه الجمهور المستهدف وتحقق أهدافك التسويقية.'
      },
      {
        title: 'تصميم واجهات المستخدم',
        icon: 'fas fa-mobile-alt',
        description: 'نصمم واجهات مستخدم سهلة الاستخدام وجذابة للمواقع الإلكترونية والتطبيقات، مع التركيز على تجربة المستخدم.'
      },
      {
        title: 'تصميم المطبوعات',
        icon: 'fas fa-book',
        description: 'نصمم مختلف أنواع المطبوعات من كتيبات ونشرات وبطاقات أعمال وأغلفة كتب بتصاميم عصرية وجذابة.'
      },
      {
        title: 'تصميم الإنفوجرافيك',
        icon: 'fas fa-chart-line',
        description: 'نحول البيانات المعقدة إلى تصاميم إنفوجرافيك سهلة الفهم وجذابة بصرياً لتوصيل المعلومات بشكل فعال.'
      }
    ];
    
    for (const service of initialServices) {
      await db.run(
        'INSERT INTO services (title, icon, description) VALUES (?, ?, ?)',
        [service.title, service.icon, service.description]
      );
    }
  }
  
  // إضافة بيانات أولية للإعدادات
  const settingsCount = await db.get('SELECT COUNT(*) as count FROM settings');
  if (settingsCount.count === 0) {
    const initialSettings = [
      { key: 'site_title', value: 'Snotlex - خدمات تصميم جرافيك وعروض تقديمية' },
      { key: 'site_description', value: 'Snotlex - شركة متخصصة في تصميم الجرافيك والعروض التقديمية الاحترافية' },
      { key: 'email', value: 'info@snotlex.com' },
      { key: 'phone', value: '+966 12 345 6789' },
      { key: 'address', value: 'الرياض، المملكة العربية السعودية' },
      { key: 'facebook', value: 'https://facebook.com/snotlex' },
      { key: 'twitter', value: 'https://twitter.com/snotlex' },
      { key: 'instagram', value: 'https://instagram.com/snotlex' },
      { key: 'linkedin', value: 'https://linkedin.com/company/snotlex' },
      { key: 'about_title', value: 'من نحن' },
      { key: 'about_content', value: 'Snotlex هي شركة متخصصة في تصميم الجرافيك والعروض التقديمية، تأسست بهدف تقديم حلول إبداعية تساعد الشركات والأفراد على إيصال رسائلهم بشكل مميز وفعال. نحن فريق من المصممين المحترفين والمبدعين الذين يجمعون بين الخبرة التقنية والرؤية الإبداعية لتقديم تصاميم عالية الجودة تلبي احتياجات عملائنا وتتجاوز توقعاتهم.' }
    ];
    
    for (const setting of initialSettings) {
      await db.run(
        'INSERT INTO settings (key, value) VALUES (?, ?)',
        [setting.key, setting.value]
      );
    }
  }
  
  return db;
}

export { openDb, initDb };
