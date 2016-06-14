# OTP is a JavaScript One Time Password (OTP) Hook

## About the App

This app is used to generate the OTP token and validate the tokens generated . This hook can be used
by other applications by integrating this hook in their routers. Once it is routed it can generate the
OTP using /genrate and validate the otp using /validate


## Options

OTP can have the following options which has to set in the config.json they are as follows :

 * **otpLength**: The size of the OTP-Key (default 4)
 * **otpType**: The type of the code generated .User can set as  "alphanumeric","alphabetic" and "numeric" (default numeric)
 * **otpExpiryTime**: The Expiry time for the generated code (default 15)
 
Sample configuration will look as follows:
```javascript
"otp": {
    "otpLength": 5,
    "otpExpiryTime": 4,
    "otpType": "numeric"
  }
 
```
Applications can enable the hooks in the developer application by downloading the source code template from here;
inject the code in the application to call the OTP in an orderly fashion. It can be made as a prehook or posthook
Prehooks will be called before an event, onhook will be called during the event and post hook will be called post
the event. The sequence will be called on successful response from the previous event. If there are any errors, 
the subsequent hooks will not be called.
