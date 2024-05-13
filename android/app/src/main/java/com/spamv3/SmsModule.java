package com.spamv3;

import android.Manifest;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.provider.Telephony.Sms;
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
import java.util.Locale;

public class SmsModule extends ReactContextBaseJavaModule {
    private static final String SMS_READ_PERMISSION = Manifest.permission.READ_SMS;
    private static final String PERMISSION_DENIED = "PERMISSION_DENIED";
    private static final String SMS_URI = "content://sms/inbox";
    private static final String DEFAULT_MOBILE_NUMBER = "9876543210";

    public SmsModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "SmsModule";
    }

    @ReactMethod
    public void getSMS(Promise promise) {
        if (ContextCompat.checkSelfPermission(getReactApplicationContext(), SMS_READ_PERMISSION) != PackageManager.PERMISSION_GRANTED) {
            promise.reject(PERMISSION_DENIED, "SMS read permission not granted");
            return;
        }

        TelephonyManager telephonyManager = (TelephonyManager) getReactApplicationContext().getSystemService(Context.TELEPHONY_SERVICE);
        String userMobileNumber = telephonyManager.getLine1Number();

        // If the userMobileNumber is not available, set a default number
        if (userMobileNumber == null || userMobileNumber.isEmpty()) {
            userMobileNumber = DEFAULT_MOBILE_NUMBER;
        }

        List<WritableMap> smsList = new ArrayList<>();
        Uri uri = Uri.parse(SMS_URI);
        Cursor cursor = getReactApplicationContext().getContentResolver().query(uri, null, null, null, null);

        if (cursor != null && cursor.moveToFirst()) {
            int addressIndex = cursor.getColumnIndex(Sms.ADDRESS);
            int bodyIndex = cursor.getColumnIndex(Sms.BODY);
            int dateIndex = cursor.getColumnIndex(Sms.DATE);

            do {
                String address = cursor.getString(addressIndex);
                String body = cursor.getString(bodyIndex);
                long dateInMillis = cursor.getLong(dateIndex);

                String smsDate = formatDate(dateInMillis, "yyyy-MM-dd");
                String smsTime = formatDate(dateInMillis, "HH:mm:ss");

                WritableMap smsMap = Arguments.createMap();
                smsMap.putString("sender", address);
                smsMap.putString("date", smsDate);
                smsMap.putString("message", body);
                smsMap.putString("time", smsTime);
                smsMap.putString("userMobileNumber", userMobileNumber);
                smsList.add(smsMap);
            } while (cursor.moveToNext());

            cursor.close();
        }

        WritableArray smsArray = Arguments.createArray();
        for (WritableMap sms : smsList) {
            smsArray.pushMap(sms);
        }

        promise.resolve(smsArray);
    }

    private String formatDate(long milliseconds, String pattern) {
        SimpleDateFormat sdf = new SimpleDateFormat(pattern, Locale.getDefault());
        return sdf.format(new Date(milliseconds));
    }
}
