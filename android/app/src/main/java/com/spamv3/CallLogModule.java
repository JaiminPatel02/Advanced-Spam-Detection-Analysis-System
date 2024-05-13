package com.spamv3;

import android.content.pm.PackageManager;
import android.database.Cursor;
import android.provider.CallLog;
import androidx.core.content.ContextCompat;
import android.telephony.TelephonyManager;
import android.content.Context;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import android.net.Uri;
import java.util.Locale;


public class CallLogModule extends ReactContextBaseJavaModule {
    private static final String CALL_LOG_READ_PERMISSION = "android.permission.READ_CALL_LOG";
    private static final String PERMISSION_DENIED = "PERMISSION_DENIED";
    private static final String CALL_LOG_URI = CallLog.Calls.CONTENT_URI.toString();
    private static final String DEFAULT_MOBILE_NUMBER = "9876543210";

    public CallLogModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "CallLogModule";
    }

    @ReactMethod
    public void getCallLogs(Promise promise) {
        try {
            if (ContextCompat.checkSelfPermission(getReactApplicationContext(), CALL_LOG_READ_PERMISSION) != PackageManager.PERMISSION_GRANTED) {
                throw new SecurityException("Call log read permission not granted");
            }
    
            TelephonyManager telephonyManager = (TelephonyManager) getReactApplicationContext().getSystemService(Context.TELEPHONY_SERVICE);
            String userMobileNumber = telephonyManager.getLine1Number();
    
            // If userMobileNumber is null or empty, set a default phone number
            if (userMobileNumber == null || userMobileNumber.isEmpty()) {
                userMobileNumber = DEFAULT_MOBILE_NUMBER; // Replace "DEFAULT_PHONE_NUMBER" with your desired default number
            }
    
            List<WritableMap> callLogList = new ArrayList<>();
            Cursor cursor = getReactApplicationContext().getContentResolver().query(
                    Uri.parse(CALL_LOG_URI),
                    null,
                    null,
                    null,
                    CallLog.Calls.DATE + " DESC"
            );
    
            if (cursor != null && cursor.moveToFirst()) {
                int numberIndex = cursor.getColumnIndex(CallLog.Calls.NUMBER);
                int dateIndex = cursor.getColumnIndex(CallLog.Calls.DATE);
                int durationIndex = cursor.getColumnIndex(CallLog.Calls.DURATION);
                int typeIndex = cursor.getColumnIndex(CallLog.Calls.TYPE);
    
                do {
                    String number = cursor.getString(numberIndex);
                    long dateInMillis = cursor.getLong(dateIndex);
                    long duration = cursor.getLong(durationIndex);
                    int type = cursor.getInt(typeIndex);
    
                    // Handle null values in call log fields
                    String callDate = formatDate(dateInMillis, "yyyy-MM-dd");
                    String callTime = formatDate(dateInMillis, "HH:mm:ss");
    
                    WritableMap callLogMap = Arguments.createMap();
                    callLogMap.putString("sender", number);
                    callLogMap.putString("date", callDate);
                    callLogMap.putDouble("duration", duration);
                    callLogMap.putInt("type", type);
                    callLogMap.putString("time", callTime);
                    callLogMap.putString("userMobileNumber", userMobileNumber);
                    callLogList.add(callLogMap);
                } while (cursor.moveToNext());
    
                cursor.close();
            }
    
            WritableArray callLogArray = Arguments.createArray();
            for (WritableMap callLog : callLogList) {
                callLogArray.pushMap(callLog);
            }
    
            promise.resolve(callLogArray);
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }
    

    private String formatDate(long milliseconds, String pattern) {
        SimpleDateFormat sdf = new SimpleDateFormat(pattern, Locale.getDefault());
        return sdf.format(new Date(milliseconds));
    }
}
