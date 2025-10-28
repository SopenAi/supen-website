/**
 * config/config.js
 * ----------------------------------------------------
 * إعدادات النظام والمفاتيح السرية
 * 🌟 تحديث حاسم: إضافة مفاتيح وإعدادات TikTok ونظام تحليل الإعلانات الذكي.
 * 💰 تحديث: دعم إعدادات الروابط الربحية (Monetizer).
 * 🎙️ تحديث: دعم تعيين معرفات الأصوات لـ ElevenLabs (Multi-Language).
 */

// ❌ تم حذف: import 'dotenv/config'; 

// ==========================================================
// 1. مفاتيح API (يتم سحبها من .env)
// ==========================================================
// مفتاح OpenAI API
const AI_API_KEY = process.env.AI_API_KEY || '';
// رابط قاعدة البيانات
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sopen_publisher_db';
// ⬅️ جديد: رابط Redis
const REDIS_URI = process.env.REDIS_URI || 'redis://localhost:6379';
// ⬅️ جديد: رابط RabbitMQ
const RABBITMQ_URI = process.env.RABBITMQ_URI || 'amqp://localhost';
// مفتاح Google Cloud لخدمة الترجمة
const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY || '';

// ⬅️ مفاتيح Google AdSense
const ADSENSE_CLIENT_ID = process.env.ADSENSE_CLIENT_ID || ''; // مثل: ca-pub-xxxxxxxxxxxxxxxx
const ADSENSE_SLOT_HEADER = process.env.ADSENSE_SLOT_HEADER || '1111111111';
const ADSENSE_SLOT_MID = process.env.ADSENSE_SLOT_MID || '2222222222';

// ⬅️ إعلانات داخلية (Internal House Ads)
const INTERNAL_AD_IMAGE_URL = process.env.INTERNAL_AD_IMAGE_URL || 'https://placehold.co/728x90/0d47a1/ffffff?text=Premium+AI+Service';
const INTERNAL_AD_LINK_URL = process.env.INTERNAL_AD_LINK_URL || '#';
const INTERNAL_AD_TEXT = process.env.INTERNAL_AD_TEXT || 'خدمات Sopen المتميزة في الذكاء الاصطناعي';


// مفاتيح النشر والإشعارات
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || '';
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'pN4XwF2h8eH0UeNq7p0M';

// 💰 إعدادات الروابط الربحية
const MONETIZER_API_KEY = process.env.MONETIZER_API_KEY || 'MOCK_MONETIZER_KEY';
const MONETIZER_BASE_URL = process.env.MONETIZER_BASE_URL || 'https://api.monetizer.example/shorten';


// مفاتيح منصات النشر
const TWITTER_APP_KEY = process.env.TWITTER_APP_KEY || '';
const TWITTER_APP_SECRET = process.env.TWITTER_APP_SECRET || ''; 
const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN || '';
const TWITTER_ACCESS_SECRET = process.env.TWITTER_ACCESS_SECRET || ''; 
const FB_PAGE_ID = process.env.FB_PAGE_ID || '';
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN || '';
const LINKEDIN_ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN || '';
const LINKEDIN_PERSON_URN = process.env.LINKEDIN_PERSON_URN || '';
const PINTEREST_ACCESS_TOKEN = process.env.PINTEREST_ACCESS_TOKEN || '';
const PINTEREST_BOARD_ID = process.env.PINTEREST_BOARD_ID || '';
const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID || '';
const REDDIT_CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET || ''; 
const TARGET_SUBREDDIT = process.env.TARGET_SUBREDDIT || 'technology'; 
const MEDIUM_TOKEN = process.env.MEDIUM_TOKEN || '';
const MEDIUM_AUTHOR_ID = process.env.MEDIUM_AUTHOR_ID || ''; 
const YOUTUBE_CLIENT_ID = process.env.YOUTUBE_CLIENT_ID || '';
const YOUTUBE_CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET || '';
const YOUTUBE_REFRESH_TOKEN = process.env.YOUTUBE_REFRESH_TOKEN || '';
const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY || '';
const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET || '';
const TIKTOK_ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN || '';


// ==========================================================
// 2. إعدادات الذكاء الاصطناعي والنماذج
// ==========================================================
// نقطة النهاية الأساسية لـ OpenAI API (للنصوص والصور)
const AI_BASE_URL = "https://api.openai.com/v1/chat/completions";

// النموذج الافتراضي للمهام ذات الجودة العالية (مثل توليد المحتوى)
const AI_MODEL = process.env.AI_MODEL || "gpt-4o-2024-05-13"; 

// النموذج الرئيسي لتوليد الصور (DALL-E)
const IMAGE_MODEL_MAIN = process.env.IMAGE_MODEL_MAIN || "dall-e-3"; 

// الحد الأقصى لعدد محاولات إعادة الاتصال (Exponential Backoff)
const MAX_RETRIES = 5;

// اللغات المستهدفة (بما في ذلك المصدر AR) - 4 لغات
const TARGET_LANGUAGES = ['ar', 'en', 'fr', 'es']; 

// 🎙️ تعيين IDs الأصوات لـ ElevenLabs لكل لغة
const ELEVENLABS_VOICE_MAP = {
    'ar': 'pN4XwF2h8eH0UeNq7p0M', // صوت عربي افتراضي
    'en': 'EXcOaF4NRPg5aiyYQDkF', // صوت إنجليزي افتراضي (مثل Bella)
    'fr': 'zrIu4sLdM3gW0w4s6tDq', // صوت فرنسي افتراضي (مثل Antoine)
    'es': '21m00Tcm4oosOERqU2y8', // صوت إسباني افتراضي (مثل Antoni)
};


// ==========================================================
// 3. إعدادات النظام والإدارة
// ==========================================================
// منفذ تشغيل الخادم
const PORT = process.env.PORT || 8080;

// المجال الذي يركز عليه النظام (لتوجيه AI)
const NICHE_TOPIC = process.env.NICHE_TOPIC || 'الذكاء الاصطناعي والتكنولوجيا المالية';

// الرابط العام للخادم (مهم للروابط في sitemap والمنشورات الاجتماعية)
const HOSTNAME = process.env.HOSTNAME || 'http://localhost:8080';

// عدد الأيام التي يجب تحليل الأداء خلالها
const ANALYTICS_DAYS_TO_ANALYZE = 7;

// ==========================================================
// 4. إعدادات الجدولة (CRON)
// ==========================================================
// التوقيت الزمني للمجدول
const SCHEDULER_TIMEZONE = process.env.SCHEDULER_TIMEZONE || "Asia/Baghdad";
// النشر 10 مرات في اليوم
const PUBLISHING_CRON_SCHEDULE = process.env.PUBLISHING_CRON_SCHEDULE || '*/144 * * * *'; 
// التحليلات: كل 4 ساعات
const ANALYTICS_CRON_SCHEDULE = process.env.ANALYTICS_CRON_SCHEDULE || '0 */4 * * *'; 
// ⬅️ جديد: جدول تحليل الإعلانات (يومياً)
const AD_ANALYSIS_CRON_SCHEDULE = process.env.AD_ANALYSIS_CRON_SCHEDULE || '0 0 1 * * *'; // يومياً الساعة 1:00 صباحاً


// ==========================================================
// 5. حماية لوحة التحكم (Dashboard)
// ==========================================================
const DASHBOARD_USERNAME = process.env.DASHBOARD_USERNAME || 'admin';
const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || 'secure_password';


// ==========================================================
// 6. تصدير الإعدادات الموحدة
// ==========================================================
export default {
    // إعدادات الخادم
    PORT,
    HOSTNAME,
    
    // مفاتيح API
    AI_API_KEY,
    MONGODB_URI,
    REDIS_URI, 
    RABBITMQ_URI, 
    GOOGLE_TRANSLATE_API_KEY,
    TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID,
    ELEVENLABS_API_KEY,
    ELEVENLABS_VOICE_ID,
    TWITTER_APP_KEY,
    TWITTER_APP_SECRET,
    TWITTER_ACCESS_TOKEN,
    TWITTER_ACCESS_SECRET,
    FB_PAGE_ID,
    FB_ACCESS_TOKEN,
    LINKEDIN_ACCESS_TOKEN,
    LINKEDIN_PERSON_URN,
    PINTEREST_ACCESS_TOKEN,
    PINTEREST_BOARD_ID,
    REDDIT_CLIENT_ID,
    REDDIT_CLIENT_SECRET,
    TARGET_SUBREDDIT,
    MEDIUM_TOKEN,
    MEDIUM_AUTHOR_ID,
    YOUTUBE_CLIENT_ID,
    YOUTUBE_CLIENT_SECRET,
    YOUTUBE_REFRESH_TOKEN,
    TIKTOK_CLIENT_KEY, 
    TIKTOK_CLIENT_SECRET, 
    TIKTOK_ACCESS_TOKEN, 

    // ⬅️ مفاتيح الإعلانات
    ADSENSE_CLIENT_ID,
    ADSENSE_SLOT_HEADER,
    ADSENSE_SLOT_MID,
    INTERNAL_AD_IMAGE_URL,
    INTERNAL_AD_LINK_URL,
    INTERNAL_AD_TEXT,
    MONETIZER_API_KEY, // 💰 تصدير مفتاح الروابط الربحية
    MONETIZER_BASE_URL, // 💰 تصدير رابط الروابط الربحية


    // إعدادات AI
    AI_BASE_URL,
    AI_MODEL,
    IMAGE_MODEL_MAIN,
    MAX_RETRIES,
    NICHE_TOPIC,
    ANALYTICS_DAYS_TO_ANALYZE,
    TARGET_LANGUAGES,
    ELEVENLABS_VOICE_MAP, // 🎙️ تصدير خريطة الأصوات

    // إعدادات الجدولة والإدارة
    SCHEDULER_TIMEZONE,
    PUBLISHING_CRON_SCHEDULE,
    ANALYTICS_CRON_SCHEDULE,
    AD_ANALYSIS_CRON_SCHEDULE, 
    DASHBOARD_USERNAME,
    DASHBOARD_PASSWORD,
};
