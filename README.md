## Bug in Expo Notifications.requestPermissionsAsync

### Abstract

This repository serves to demonstrate that after initially requesting Notification permissions on iOS with a given set of options, calling the method again with different options has no effect.

### The Issue

On iOS, the permissions for Notification can be requested with a set of [options](https://developer.apple.com/documentation/usernotifications/unauthorizationoptions). The most common ones are to display alerts or play sounds, but they can also enable notifications on CarPlay displays, or enable critical alerts. Over the course of its lifetime, an app may introduce aditional capabilities, such as critical alerts or other, newly introduced iOS features and thus, must call `requestAuthorization(options:completionHandler:)` again with a new set of options. Expo Notifications supports all these [options](https://docs.expo.dev/versions/latest/sdk/notifications/#requestpermissionsasyncrequest-notificationpermissionsrequest-promisenotificationpermissionsstatus) for  `requestPermissionsAsync`.

The issue is, that after an app is newly installed on a device, the first call to `Notification.requestPermissionsAsync` will prompt the user, and set the given options. **However, subsequent calls will have no effect.**
This means, for the user to take advantage of new features, they will have to de-install and re-install the app, which is completely unacceptable.

### To Reproduce

* Build and run the project on the iOS Simulator or Device (Remember to run `npm i` and `(cd ios && pod install)` first).
* Press "Request Alerts". You should be prompted for consent, please allow.
* You should see that alerts are enabled, sounds are not. (Feel free to check in the Settings App)
* Press "Request Alerts & Sound"

### Expected Result

Alerts and Sounds are enabled

### Actual result

Still only Alerts are enabled

### The Root of the Problem

The root of the problem can be found in [EXPermissionsService.m:111](https://github.com/expo/expo/blob/168ee43f71f005baa11edf98e518593443e1807a/packages/expo-modules-core/ios/Services/Permissions/EXPermissionsService.m#L111):

```objc
  BOOL isGranted = [EXPermissionsService statusForPermission:permission] == EXPermissionStatusGranted;
  permission[@"granted"] = @(isGranted);
  
  if (isGranted) {
    return onResult(permission);
  }
  
  [self askForGlobalPermissionUsingRequesterClass:requesterClass 
                                     withResolver:onResult 
                                     withRejecter:reject];
```

This means that permissions are only ever requested again, if permission has not previously been granted. This however **does not consider different options**, but only if any sort of notification permissions have been granted. This means that if previously only Alerts have been requested, a new request for Alerts and Sounds will be ignored.

### The Solution

On iOS, it is perfectly acceptable to call `requestAuthorization(options:completionHandler:)` repeatedly: 
> subsequent calls to this method do not prompt the user again

My proposal therefore is to remove the method `askForPermissionUsingRequesterClass` entirely, and instead rename `askForGlobalPermissionUsingRequesterClass` appropriately.



