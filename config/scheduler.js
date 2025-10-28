/**
 * config/scheduler.js
 * ----------------------------------------------------\
 * مسؤول عن جدولة المهام الدورية (Cron Jobs) في النظام.
 * يفصل منطق الجدولة عن الخادم الرئيسي (server.js).
 * 🌟 تحديث حاسم: ضمان التتابع الصحيح لمهام التحليل (سحب البيانات قبل حساب السلوك).
 * 🚨 جديد: إضافة دورة تحديث أداء الإعلانات (Ad Performance).
 * 🚨 جديد: إضافة دورة تحديث أعداد المنشورات للفئات (Category Update).
 */

import cron from 'node-cron';
import { runDailyPublishingCycle } from '../worker/publisherWorker.js'; 
import { 
    runAnalyticsFetchCycle, 
    runBehaviorMetricsCalculation,
    runCategoryUpdateCycle, // ⬅️ استيراد دورة تحديث الفئات
    runAdPerformanceUpdate // 🚨 جديد: استيراد دورة تحديث أداء الإعلانات
} from '../database/analytics.js'; 
import { logSuccess, logError, sendCriticalNotification, cleanOldLogs } from '../utils/notifier.js'; 
import { runSmartNotificationCycle } from '../utils/notificationManager.js'; 
import config from './config.js';
import { analyzePerformance } from '../ai/feedbackAnalyzer.js';
// ⬅️ استيراد دالة تحليل الإعلانات الذكية الجديدة
import { runAdAnalysisCycle } from '../ai/adAnalyzer.js'; // ⚠️ ملاحظة: تم تجاهل هذه الدالة لصالح runAdPerformanceUpdate
import fs from 'fs';
import path from 'path';

// **سحب مواعيد الجدولة من ملف config.js:**
const PUBLISHING_CRON_SCHEDULE = config.PUBLISHING_CRON_SCHEDULE;
const ANALYTICS_CRON_SCHEDULE = config.ANALYTICS_CRON_SCHEDULE; 
// ⬅️ جديد: جدول تحليل الإعلانات
const AD_ANALYSIS_CRON_SCHEDULE = config.AD_ANALYSIS_CRON_SCHEDULE; // 0 0 1 * * *
const LOG_CLEANUP_CRON_SCHEDULE = '0 0 3 * * *'; // كل يوم الساعة 3:00 صباحاً
const NOTIFICATIONS_CRON_SCHEDULE = '0 30 7 * * *'; // كل يوم الساعة 7:30 صباحاً
const AI_TUNING_CRON_SCHEDULE = '0 0 */12 * * *'; // كل 12 ساعة
// 🚨 جديد: جدول تحديث الفئات
const CATEGORY_UPDATE_CRON_SCHEDULE = '0 0 5 * * *'; // كل يوم الساعة 5:00 صباحاً

const NICHE_TOPIC = config.NICHE_TOPIC; 
const TIMEZONE = config.SCHEDULER_TIMEZONE; 

const AI_INSIGHTS_FILE = path.resolve('logs', 'ai_insights.json'); 

/**
 * دالة لحفظ توصيات AI في ملف ليتم عرضها في لوحة التحكم.
 */
async function runAITuningAndSaveInsights() {
    logSuccess('بدء مهمة CRON Job لضبط AI وحفظ توصيات الإدارة...', 'AI_TUNING_CRON');
    try {
        // 1. تشغيل تحليل الأداء العميق
        const analysisResult = await analyzePerformance(config.ANALYTICS_DAYS_TO_ANALYZE);
        
        // 2. تصفية النتائج إلى توصيات إدارية فقط
        const insightsPayload = {
            summary: analysisResult.summary || "تم تحليل البيانات بنجاح.",
            best_performing_topic: analysisResult.best_performing_topic || "N/A",
            worst_performing_platform: analysisResult.worst_performing_platform || "N/A",
            timing_insight: analysisResult.timing_insight || "N/A",
            style_recommendation: analysisResult.style_recommendation || "N/A",
            actionable_recommendations: analysisResult.actionable_recommendations || ["لا توجد توصيات محددة."]
        };

        // 3. حفظها في ملف JSON
        fs.writeFileSync(AI_INSIGHTS_FILE, JSON.stringify(insightsPayload, null, 4), 'utf8');
        
        logSuccess('تم حفظ توصيات AI بنجاح لـ Dashboard.', 'AI_TUNING_SUCCESS');

    } catch (error) {
        logError('فشل في تنفيذ دورة ضبط AI وحفظ التوصيات.', error, 'AI_TUNING_FAIL');
    }
}

/**
 * دالة لتهيئة وبدء جميع مهام الجدولة المحددة للنظام.
 * هذه الدالة يتم استدعاؤها مرة واحدة من server.js عند بدء تشغيل الخادم.
 */
export function setupAndStartScheduler() {
    logSuccess('جاري تهيئة نظام الجدولة...', 'SCHEDULER');
    
    // ⚠️ تشغيل دورة واحدة فوراً عند بدء التشغيل
    logSuccess('بدء دورة النشر الاختبارية الفورية للتأكد من عمل النظام...', 'CRON_TEST');
    runDailyPublishingCycle(NICHE_TOPIC).catch(error => {
         logError(`فشل في تنفيذ دورة النشر الاختبارية الفورية: ${error.message}`, error, 'CRON_TEST_FAIL');
         sendCriticalNotification(`فشل حرج في دورة النشر الفورية: ${error.message}`);
    });
    
    // 1. جدولة دورة النشر المتكررة (10 مرات يومياً)
    cron.schedule(PUBLISHING_CRON_SCHEDULE, () => {
        logSuccess(`بدء مهمة CRON Job لدورة النشر المتكررة.`, 'CRON');
        runDailyPublishingCycle(NICHE_TOPIC).catch(error => {
            sendCriticalNotification(`فشل حرج في دورة النشر: ${error.message}`);
        });
    }, {
        timezone: TIMEZONE
    });
    
    // 2. جدولة دورة سحب التحليلات الاجتماعية وحساب مقاييس السلوك (كل 4 ساعات)
    // 🚨 التعديل الحاسم: يجب أن ننتظر اكتمال runAnalyticsFetchCycle قبل runBehaviorMetricsCalculation
    cron.schedule(ANALYTICS_CRON_SCHEDULE, async () => { // ⬅️ جعل الدالة غير متزامنة
        logSuccess(`بدء مهمة CRON Job لدورة التحليلات وحساب السلوك (تسلسل: Analytics -> Behavior).`, 'CRON_ANALYTICS_BEHAVIOR');
        
        try {
            // ⬅️ الخطوة 1: سحب التحليلات من المنصات الخارجية
            await runAnalyticsFetchCycle();
            logSuccess('اكتمل سحب التحليلات الخارجية. جاري حساب مقاييس السلوك...', 'CRON_ANALYTICS_DONE');
            
            // ⬅️ الخطوة 2: حساب السلوك (يعتمد على البيانات المحدثة)
            await runBehaviorMetricsCalculation();
            logSuccess('اكتمل حساب مقاييس السلوك بنجاح.', 'CRON_BEHAVIOR_DONE');

        } catch (error) {
             // يتم التقاط الأخطاء الداخلية في الدوال، ولكن هذا لضمان عدم توقف الجدولة
            logError(`فشل في تنفيذ دورة التحليلات/السلوك المتسلسلة: ${error.message}`, error, 'CRON_ANALYTICS_SEQ_FAIL');
        }
        
    }, {
        timezone: TIMEZONE
    });

    // 3. جدولة مهمة تحليل الإعلانات الذكية (يومياً) - تستخدم runAdPerformanceUpdate الجديدة
    cron.schedule(AD_ANALYSIS_CRON_SCHEDULE, () => {
         logSuccess(`بدء مهمة CRON Job لتحليل الإعلانات الذكية (Ad Performance Update).`, 'CRON_AD_ANALYSIS');
         // 🚨 استخدام runAdPerformanceUpdate الجديدة من analytics.js
         runAdPerformanceUpdate().catch(error => {
              logError(`فشل في تنفيذ دورة تحليل الإعلانات: ${error.message}`, error, 'CRON_AD_ANALYSIS_FAIL');
         });
    }, {
         timezone: TIMEZONE
    });
    
    // 4. جدولة مهمة ضبط AI وحفظ التوصيات (كل 12 ساعة)
    cron.schedule(AI_TUNING_CRON_SCHEDULE, runAITuningAndSaveInsights, {
        timezone: TIMEZONE
    });
    
    // 5. جدولة مهمة الإشعارات الذكية (يومياً)
    cron.schedule(NOTIFICATIONS_CRON_SCHEDULE, () => {
         logSuccess(`بدء مهمة CRON Job للإشعارات الذكية للمستخدمين.`, 'CRON_NOTIFICATIONS');
         runSmartNotificationCycle().catch(error => { 
             logError(`فشل في تنفيذ دورة الإشعارات الذكية: ${error.message}`, error, 'CRON_NOTIF_FAIL');
         });
    }, {
        timezone: TIMEZONE
    });

    // 6. جدولة مهمة تنظيف السجلات اليومية
    cron.schedule(LOG_CLEANUP_CRON_SCHEDULE, () => {
        logSuccess(`بدء مهمة CRON Job لتنظيف السجلات.`, 'CRON_CLEANUP');
        cleanOldLogs(config.ANALYTICS_DAYS_TO_ANALYZE);
    }, {
        timezone: TIMEZONE
    });

    // 🌟 7. جديد: جدولة مهمة تحديث الفئات اليومية
    cron.schedule(CATEGORY_UPDATE_CRON_SCHEDULE, () => {
        logSuccess(`بدء مهمة CRON Job لتحديث أعداد المنشورات في الفئات.`, 'CRON_CATEGORY_UPDATE');
        runCategoryUpdateCycle().catch(error => {
            logError(`فشل في تنفيذ دورة تحديث الفئات: ${error.message}`, error, 'CRON_CATEGORY_FAIL');
        });
    }, {
        timezone: TIMEZONE
    });

    logSuccess(`الناشر مُجدوَل يومياً على ${PUBLISHING_CRON_SCHEDULE}، والتحليلات كل 4 ساعات (بتسلسل)، والإعلانات يومياً.`, 'SCHEDULER');
}
