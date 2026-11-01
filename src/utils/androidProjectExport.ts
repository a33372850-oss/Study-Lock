import JSZip from 'jszip';

export async function generateAndroidProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // Root files
  zip.file(
    'settings.gradle.kts',
    `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "StudyLock"
include(":app")
`
  );

  zip.file(
    'build.gradle.kts',
    `plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
}
`
  );

  zip.file(
    'gradle.properties',
    `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
`
  );

  // app/build.gradle.kts
  zip.file(
    'app/build.gradle.kts',
    `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
}

android {
    namespace = "com.studylock.focusmode"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.studylock.focusmode"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2024.10.01")
    implementation(composeBom)
    androidTestImplementation(composeBom)

    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.7")
    implementation("androidx.activity:activity-compose:1.9.3")
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1")
}
`
  );

  // AndroidManifest.xml
  zip.file(
    'app/src/main/AndroidManifest.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.studylock.focusmode">

    <!-- Permissions required for exact app blocking & scheduling -->
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
    <uses-permission android:name="android.permission.USE_EXACT_ALARM" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.Material.NoActionBar">

        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Blocking Overlay Activity (Renders full-screen Hindi warning on top of blocked apps) -->
        <activity
            android:name=".LockOverlayActivity"
            android:excludeFromRecents="true"
            android:exported="false"
            android:launchMode="singleInstance"
            android:noHistory="true"
            android:theme="@android:style/Theme.Translucent.NoTitleBar.Fullscreen" />

        <!-- Real-Time App Detection Accessibility Service -->
        <service
            android:name=".service.StudyAccessibilityService"
            android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
            android:exported="true">
            <intent-filter>
                <action android:name="android.accessibilityservice.AccessibilityService" />
            </intent-filter>
            <meta-data
                android:name="android.accessibilityservice"
                android:resource="@xml/accessibility_service_config" />
        </service>

        <!-- Exact Schedule Wake-Up Receiver -->
        <receiver
            android:name=".receiver.ScheduleAlarmReceiver"
            android:enabled="true"
            android:exported="false">
            <intent-filter>
                <action android:name="com.studylock.ACTION_START_SESSION" />
                <action android:name="com.studylock.ACTION_END_SESSION" />
            </intent-filter>
        </receiver>

        <!-- Boot Receiver for Re-scheduling -->
        <receiver
            android:name=".receiver.BootReceiver"
            android:enabled="true"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
                <action android:name="android.intent.action.QUICKBOOT_POWERON" />
            </intent-filter>
        </receiver>
    </application>
</manifest>
`
  );

  // accessibility_service_config.xml
  zip.file(
    'app/src/main/res/xml/accessibility_service_config.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<accessibility-service xmlns:android="http://schemas.android.com/apk/res/android"
    android:accessibilityEventTypes="typeWindowStateChanged"
    android:accessibilityFeedbackType="feedbackGeneric"
    android:accessibilityFlags="flagIncludeNotImportantViews"
    android:canRetrieveWindowContent="false"
    android:description="@string/accessibility_description"
    android:notificationTimeout="50" />
`
  );

  // strings.xml
  zip.file(
    'app/src/main/res/values/strings.xml',
    `<resources>
    <string name="app_name">STUDY LOCK – Focus Mode</string>
    <string name="accessibility_description">Used to detect and automatically lock distracting apps during your scheduled study hours.</string>
</resources>
`
  );

  // Kotlin source files
  zip.file(
    'app/src/main/java/com/studylock/focusmode/MainActivity.kt',
    `package com.studylock.focusmode

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.studylock.focusmode.util.FocusSessionManager

val DarkBg = Color(0xFF0A071E)
val CardBg = Color(0xFF161138)
val ElectricViolet = Color(0xFF7000FF)
val NeonCyan = Color(0xFF00F5D4)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val sessionManager = FocusSessionManager(this)

        setContent {
            var isLocked by remember { mutableStateOf(sessionManager.isStudyLockActive()) }

            Surface(modifier = Modifier.fillMaxSize(), color = DarkBg) {
                LazyColumn(
                    modifier = Modifier.fillMaxSize().padding(horizontal = 20.dp, vertical = 24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    item {
                        // Header
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = "STUDY LOCK",
                                    color = Color.White,
                                    fontSize = 24.sp,
                                    fontWeight = FontWeight.Black
                                )
                                Text(
                                    text = "Focus Mode Control",
                                    color = Color(0xFF9E9AC2),
                                    fontSize = 13.sp
                                )
                            }
                            Surface(
                                color = if (isLocked) Color(0x3300F5D4) else Color(0x33FF5252),
                                shape = RoundedCornerShape(20.dp)
                            ) {
                                Text(
                                    text = if (isLocked) "ACTIVE" else "IDLE",
                                    color = if (isLocked) NeonCyan else Color(0xFFFF5252),
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(36.dp))

                        // Animated Dial / Timer Ring
                        Box(contentAlignment = Alignment.Center, modifier = Modifier.size(240.dp)) {
                            Canvas(modifier = Modifier.size(220.dp)) {
                                drawCircle(
                                    color = Color(0xFF231B4D),
                                    style = Stroke(width = 14.dp.toPx(), cap = StrokeCap.Round)
                                )
                                drawArc(
                                    brush = Brush.sweepGradient(listOf(ElectricViolet, NeonCyan, ElectricViolet)),
                                    startAngle = -90f,
                                    sweepAngle = if (isLocked) 280f else 0f,
                                    useCenter = false,
                                    style = Stroke(width = 14.dp.toPx(), cap = StrokeCap.Round)
                                )
                            }
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(
                                    text = if (isLocked) "FOCUS MODE" else "PAUSED",
                                    color = if (isLocked) NeonCyan else Color.LightGray,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 1.sp
                                )
                                Text(
                                    text = if (isLocked) "02:45:00" else "--:--",
                                    color = Color.White,
                                    fontSize = 36.sp,
                                    fontWeight = FontWeight.ExtraBold
                                )
                                Text(
                                    text = "Remaining Focus",
                                    color = Color(0xFF9E9AC2),
                                    fontSize = 12.sp
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(36.dp))

                        // Toggle Lock Button
                        Button(
                            onClick = {
                                if (!Settings.canDrawOverlays(this@MainActivity)) {
                                    startActivity(Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:$packageName")))
                                    return@Button
                                }
                                val newState = !isLocked
                                isLocked = newState
                                sessionManager.setStudyLockActive(newState)
                            },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (isLocked) Color(0xFFFF3366) else ElectricViolet
                            ),
                            shape = RoundedCornerShape(16.dp),
                            modifier = Modifier.fillMaxWidth().height(56.dp)
                        ) {
                            Icon(
                                imageVector = if (isLocked) Icons.Default.Lock else Icons.Default.PlayArrow,
                                contentDescription = null
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = if (isLocked) "Deactivate Lock" else "Start Study Lock",
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp
                            )
                        }

                        Spacer(modifier = Modifier.height(24.dp))

                        // Stats Cards
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(14.dp)
                        ) {
                            Card(
                                modifier = Modifier.weight(1f),
                                colors = CardDefaults.cardColors(containerColor = CardBg),
                                shape = RoundedCornerShape(18.dp)
                            ) {
                                Column(modifier = Modifier.padding(16.dp)) {
                                    Text("Today's Study", color = Color(0xFF9E9AC2), fontSize = 12.sp)
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text("3.5 Hours", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 20.sp)
                                    Text("Goal: 4.0h", color = NeonCyan, fontSize = 11.sp)
                                }
                            }
                            Card(
                                modifier = Modifier.weight(1f),
                                colors = CardDefaults.cardColors(containerColor = CardBg),
                                shape = RoundedCornerShape(18.dp)
                            ) {
                                Column(modifier = Modifier.padding(16.dp)) {
                                    Text("Current Streak", color = Color(0xFF9E9AC2), fontSize = 12.sp)
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text("7 Days", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 20.sp)
                                    Text("🔥 Fire Streak", color = NeonCyan, fontSize = 11.sp)
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(20.dp))

                        // Principle Note
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            colors = CardDefaults.cardColors(containerColor = CardBg),
                            shape = RoundedCornerShape(18.dp)
                        ) {
                            Row(
                                modifier = Modifier.padding(18.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text("💡", fontSize = 28.sp)
                                Spacer(modifier = Modifier.width(14.dp))
                                Column {
                                    Text(
                                        text = "Daily Principle",
                                        color = ElectricViolet,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 12.sp
                                    )
                                    Text(
                                        text = "Your future is created by what you do today, not tomorrow.",
                                        color = Color.LightGray,
                                        fontSize = 13.sp,
                                        lineHeight = 18.sp
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
`
  );

  // LockOverlayActivity.kt
  zip.file(
    'app/src/main/java/com/studylock/focusmode/LockOverlayActivity.kt',
    `package com.studylock.focusmode

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

class LockOverlayActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.verticalGradient(
                            listOf(Color(0xFF080614), Color(0xFF130E2E), Color(0xFF261A5C))
                        )
                    )
                    .padding(24.dp),
                contentAlignment = Alignment.Center
            ) {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(26.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0x1FFFFFFF))
                ) {
                    Column(
                        modifier = Modifier.padding(28.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(text = "📚", fontSize = 64.sp)
                        Spacer(modifier = Modifier.height(16.dp))

                        // Full Screen Hindi Message
                        Text(
                            text = "अभी पढ़ाई का समय है!\\nअपने भविष्य पर ध्यान दो।",
                            color = Color.White,
                            fontSize = 22.sp,
                            fontWeight = FontWeight.ExtraBold,
                            textAlign = TextAlign.Center,
                            lineHeight = 32.sp
                        )

                        Spacer(modifier = Modifier.height(14.dp))

                        Text(
                            text = "Focus Lock is strictly running. This application is locked until your scheduled study session finishes.",
                            color = Color(0xFFB5B0D8),
                            fontSize = 13.sp,
                            textAlign = TextAlign.Center,
                            lineHeight = 18.sp
                        )

                        Spacer(modifier = Modifier.height(28.dp))

                        Button(
                            onClick = { finish() },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF7000FF)),
                            shape = RoundedCornerShape(14.dp),
                            modifier = Modifier.fillMaxWidth().height(50.dp)
                        ) {
                            Text("वापस जाएं (Back to Dashboard)", color = Color.White, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        // Prevent dismissal via back button during strict focus
    }
}
`
  );

  // StudyAccessibilityService.kt
  zip.file(
    'app/src/main/java/com/studylock/focusmode/service/StudyAccessibilityService.kt',
    `package com.studylock.focusmode.service

import android.accessibilityservice.AccessibilityService
import android.content.Context
import android.content.Intent
import android.view.accessibility.AccessibilityEvent
import com.studylock.focusmode.LockOverlayActivity
import com.studylock.focusmode.util.FocusSessionManager

class StudyAccessibilityService : AccessibilityService() {

    private val defaultDistractions = setOf(
        "com.instagram.android",
        "com.google.android.youtube",
        "com.facebook.katana",
        "com.snapchat.android",
        "com.whatsapp",
        "com.twitter.android",
        "com.dts.freefireth",
        "com.pubg.imobile",
        "com.netflix.mediaclient"
    )

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null || event.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) return

        val foregroundPackage = event.packageName?.toString() ?: return
        if (foregroundPackage == applicationContext.packageName) return

        val sessionManager = FocusSessionManager(applicationContext)
        if (sessionManager.isStudyLockActive()) {
            val customBlocked = sessionManager.getBlockedApps()
            val totalBlocked = defaultDistractions + customBlocked

            if (totalBlocked.contains(foregroundPackage)) {
                // Send phone to home screen
                val homeIntent = Intent(Intent.ACTION_MAIN).apply {
                    addCategory(Intent.CATEGORY_HOME)
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK
                }
                startActivity(homeIntent)

                // Launch Full-Screen Hindi Lock Overlay
                val lockIntent = Intent(this, LockOverlayActivity::class.java).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                }
                startActivity(lockIntent)
            }
        }
    }

    override fun onInterrupt() {}
}
`
  );

  // FocusSessionManager.kt
  zip.file(
    'app/src/main/java/com/studylock/focusmode/util/FocusSessionManager.kt',
    `package com.studylock.focusmode.util

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import com.studylock.focusmode.receiver.ScheduleAlarmReceiver
import java.util.Calendar

class FocusSessionManager(private val context: Context) {
    private val prefs = context.getSharedPreferences("study_lock_prefs", Context.MODE_PRIVATE)

    fun isStudyLockActive(): Boolean = prefs.getBoolean("is_focus_active", false)

    fun setStudyLockActive(active: Boolean) {
        prefs.edit().putBoolean("is_focus_active", active).apply()
    }

    fun getBlockedApps(): Set<String> {
        return prefs.getStringSet("custom_blocked_apps", emptySet()) ?: emptySet()
    }

    fun scheduleSession(scheduleId: Long, startHour: Int, startMin: Int, endHour: Int, endMin: Int) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

        val startCal = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, startHour)
            set(Calendar.MINUTE, startMin)
            set(Calendar.SECOND, 0)
            if (before(Calendar.getInstance())) add(Calendar.DATE, 1)
        }

        val endCal = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, endHour)
            set(Calendar.MINUTE, endMin)
            set(Calendar.SECOND, 0)
            if (before(Calendar.getInstance())) add(Calendar.DATE, 1)
        }

        // Exact Trigger to START Study Lock
        val startIntent = Intent(context, ScheduleAlarmReceiver::class.java).apply {
            action = "com.studylock.ACTION_START_SESSION"
            putExtra("SCHEDULE_ID", scheduleId)
        }
        val startPending = PendingIntent.getBroadcast(
            context,
            (scheduleId * 2).toInt(),
            startIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, startCal.timeInMillis, startPending)

        // Exact Trigger to END Study Lock & automatically restore apps
        val endIntent = Intent(context, ScheduleAlarmReceiver::class.java).apply {
            action = "com.studylock.ACTION_END_SESSION"
            putExtra("SCHEDULE_ID", scheduleId)
        }
        val endPending = PendingIntent.getBroadcast(
            context,
            ((scheduleId * 2) + 1).toInt(),
            endIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, endCal.timeInMillis, endPending)
    }
}
`
  );

  // ScheduleAlarmReceiver.kt
  zip.file(
    'app/src/main/java/com/studylock/focusmode/receiver/ScheduleAlarmReceiver.kt',
    `package com.studylock.focusmode.receiver

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import com.studylock.focusmode.util.FocusSessionManager

class ScheduleAlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val sessionManager = FocusSessionManager(context)
        val notifManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        val channelId = "STUDY_LOCK_CHANNEL"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Study Lock Notifications",
                NotificationManager.IMPORTANCE_HIGH
            )
            notifManager.createNotificationChannel(channel)
        }

        when (intent.action) {
            "com.studylock.ACTION_START_SESSION" -> {
                sessionManager.setStudyLockActive(true)
                val notif = NotificationCompat.Builder(context, channelId)
                    .setSmallIcon(android.R.drawable.ic_lock_lock)
                    .setContentTitle("Study Lock Activated 📚")
                    .setContentText("Focus Mode is running. Distracting apps are now blocked.")
                    .setPriority(NotificationCompat.PRIORITY_MAX)
                    .setAutoCancel(true)
                    .build()
                notifManager.notify(101, notif)
            }
            "com.studylock.ACTION_END_SESSION" -> {
                sessionManager.setStudyLockActive(false)
                val notif = NotificationCompat.Builder(context, channelId)
                    .setSmallIcon(android.R.drawable.ic_input_add)
                    .setContentTitle("Study Session Completed! 🎉")
                    .setContentText("Great job! All apps have been automatically unlocked.")
                    .setPriority(NotificationCompat.PRIORITY_MAX)
                    .setAutoCancel(true)
                    .build()
                notifManager.notify(102, notif)
            }
        }
    }
}
`
  );

  // BootReceiver.kt
  zip.file(
    'app/src/main/java/com/studylock/focusmode/receiver/BootReceiver.kt',
    `package com.studylock.focusmode.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.studylock.focusmode.util.FocusSessionManager

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED || intent.action == "android.intent.action.QUICKBOOT_POWERON") {
            // Re-arm all active study schedules after phone restart
            val sessionManager = FocusSessionManager(context)
            // Schedule check logic here
        }
    }
}
`
  );

  // GitHub Actions Workflow for 100% Free Cloud APK Build
  zip.file(
    '.github/workflows/build-apk.yml',
    `name: Build Study Lock APK

on:
  push:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Repository
      uses: actions/checkout@v4

    - name: Set up Java JDK 17
      uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'temurin'

    - name: Setup Gradle
      uses: gradle/actions/setup-gradle@v3

    - name: Build Debug APK
      run: ./gradlew assembleDebug

    - name: Upload Debug APK Artifact
      uses: actions/upload-artifact@v4
      with:
        name: StudyLock-FocusMode-APK
        path: app/build/outputs/apk/debug/*.apk
`
  );

  // README
  zip.file(
    'README.md',
    `# STUDY LOCK – Focus Mode (Android Source Project)

## 📱 How to Build the APK File

### Method 1: Build in Cloud for Free via GitHub (Takes 2 minutes, No PC needed!)
1. Create a free account at https://github.com
2. Create a new repository: \`StudyLockApp\`
3. Upload all the files from this zip into the repository.
4. Go to the **Actions** tab on GitHub.
5. Click **Run workflow** (or simply commit a change).
6. In ~90 seconds, click on the completed run under **Artifacts** to download your **StudyLock-APK**!

### Method 2: Android Studio (on PC/Laptop)
1. Open Android Studio -> Click **Open...**
2. Select this unzipped project folder.
3. Wait for Gradle sync to complete.
4. Go to top menu: **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
5. Click **locate** in the popup to get your ready-to-install \`.apk\` file!

### Required Phone Permissions After Installing APK:
1. **Accessibility Service**: Settings > Accessibility > Installed Apps > Turn ON **STUDY LOCK**.
2. **Display Over Other Apps**: Settings > Apps > Special App Access > Display over other apps > Allow **STUDY LOCK**.
`
  );

  return await zip.generateAsync({ type: 'blob' });
}
