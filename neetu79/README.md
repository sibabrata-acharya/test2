# Node JS template application for OAuth2.0 authentication.

## Developer can leverage this template application code, modify according to their business functionality and can push to PaaS platform.

### Template application files

File | Description
:-- | :-- 
app.js | This file does all the bootstrapping by require-ing all the controllers, models and middlewares. Configures the port and domain, starts the application on the available or given port.
config.js | Configuration of API and Secret keys of the providers.
views/ | Contains the jade view files for different scenarios.
package.json | All npm packages contain a file, this file holds various metadata relevant to the project.


### Application configuration

- Find the required credentials of the AuthService from the VCAP_SERVICES. The credentials will contain the following details

      ```
       serviceUrl: Base URL for authentication service.
       *provider*_callback: This URL is the provider callback URL. Configure this URL as redirect URI in the provider app configuration. Keys will be in the form of facebook_callback, google_callback, linkedin_callback, twitter_callback
       clientID: This ID is required for consuming the authentication services APIs
       clientSecret: This Secret key is required for consuming the authentication services APIs. Do not share this key, keep it confidential
      ```

### Application execution

- app.js provides the sample routes calling the services of Authentication service.

      ```
       1. '/login' to show the provider options to login.
       2. '/OAuth' Initiates the call to Authentication service based on a selected provider login.
       3. '/callback' Authentication service redirects back to the application with accessToken and profile information. Later it is rendered to show some profile information.
       4. '/logout' to terminate an existing login session and redirect to login page.
      ```

- After all configuration is done, start the application and try 'YOUR_DOMAIN_URL' or 'YOUR_DOMAIN_URL'/login in the browser. For eg: http://localhost:3000/login or http://localhost:3000/


## Authentication Service API

## GET /facebook, /google, /twitter, /linkedin
Authenticates the user against facebook and redirects back to application with accessToken and profile information.

### Request
| Query Param  |                  Description                                                          |
|--------------|---------------------------------------------------------------------------------------|
| callbackUrl  | callbackUrl to where Authentication service needs to redirect after authentication    |

### Response
| HTTP           |      Value                                                                                                     |
|----------------|----------------------------------------------------------------------------------------------------------------|
| query params   | accessToken=eyJ0eXAiOiJKV1...&id=123456..&displayName=Johnson&provider=twitter&refreshToken=ciOiJIU...         |

*Note: refreshToken will be available only for /twitter call. Not applicable for other providers

* Example API call

      ```
       var url = "http://authservice.54.208.194.189.xip.io"+"/facebook?"+"callbackUrl=http://localhost:3000/callback";
       res.redirect(baseUrl);
      ```

## GET /logout
Terminates an existing login session and redirects to the callback URL

### Request
| Query Param  |                  Description                                                          |
|--------------|---------------------------------------------------------------------------------------|
| callbackUrl  | callbackUrl to where Authentication service needs to redirect after authentication    |

### Response
- Redirects back to the callbackUrl after successful session termination. No query params will be passed.


## POST /generate
- This API generates an OTP with the given combination(numeric,alpha or both) and sends the OTP to desired receipient based on the given channel and receipient details.
- Supports SendGrid and Twilio as channels.

### Request
| HTTP       |                             Value                                               |
|------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Body       | {"channel": "sendgrid", "otp": {"otpLength": 5,"otpType": "numeric","otpExpiryTime":  4},"sendgrid": {"accountSID": "1234","authToken": "abcd","toRecipient":"someemail@gmail.com","fromMail": "someemail@gmail.com"}} |

### Response
| HTTP       |  Value                                                             |
|------------|--------------------------------------------------------------------------------------------|
| Body       | {"otpCode":"79653","otpKey":"69687d70cb2503339e780f54db7a02bb958e86f84aeaa6023dc7397c531"} |

* Example JSON body for request

      ```
       1. for sendgrid : {"channel": "sendgrid", "otp": {"otpLength": 5,"otpType": "numeric","otpExpiryTime":  4},"sendgrid": {"accountSID": "1234","authToken": "abcd","toRecipient":"someemail@gmail.com","fromMail": "someemail@gmail.com"}}
       2. for twilio : {"channel": "twilio", "otp": {"otpLength": 5,"otpType": "numeric","otpExpiryTime":  4},"twilio":{"accountSID": "hdfk6545f47d11a6a7a56","authToken": "3505f762yujy655c727fe","toRecipient": "somenumber","fromNo": "registerd_number"}}
      ```

## POST /validate
- This API validates the requested OTP.

### Request
| HTTP       |                             Value                                                          |
|------------|--------------------------------------------------------------------------------------------|
| Body       | {"otpCode":"79653","otpKey":"69687d70cb2503339e780f54db7a02bb958e86f84aeaa6023dc7397c531"} |

### Response
| HTTP       |  Value                                      |
|------------|---------------------------------------------|
| Body       | {"status":"OTP is validated successfully"}  |

