/**
 * config/authMiddleware.js
 * ----------------------------------------------------\
 * دوال Express Middleware للمصادقة والتحقق من صلاحيات المشرف باستخدام Firebase Admin.
 */

import * as admin from 'firebase-admin';
import { logError } from '../utils/notifier.js';

/**
 * 🌟 دالة المصادقة لـ Firebase (لحماية نقاط نهاية المستخدمين)
 */
export async function firebaseAuth(req, res, next) {
    if (!admin.apps.length) {
         logError('Firebase Admin غير مهيأ.', null, 'FIREBASE_AUTH_PRE_FAIL');
         return res.status(503).json({ error: 'الخادم غير جاهز: Firebase Admin غير مهيأ.' });
    }
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'غير مصرح بالدخول: لا يوجد رمز وصول (Token).' });
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        logError('فشل التحقق من Firebase ID Token.', error, 'FIREBASE_AUTH_FAIL');
        return res.status(401).json({ error: 'غير مصرح بالدخول: رمز الوصول غير صالح أو منتهي الصلاحية.' });
    }
}

/**
 * 🌟 دالة المصادقة الإدارية (تحقق من Custom Claim)
 */
export async function firebaseAdminAuth(req, res, next) {
    // 1. التحقق الأساسي من المصادقة أولاً
    await firebaseAuth(req, res, () => {
        // يتم استدعاء هذه الدالة فقط إذا نجح firebaseAuth
        if (req.user) {
            // 2. التحقق من صلاحية المشرف (Admin Claim)
            if (req.user.admin === true) {
                next(); // المصادقة الإدارية ناجحة
            } else {
                // ليس لديه صلاحية المشرف
                return res.status(403).json({ error: 'ممنوع: المستخدم غير مصرَّح له بصلاحيات المشرف.' });
            }
        }
        // إذا فشل firebaseAuth، فإنه يرسل الاستجابة 401 بالفعل
    });
}
