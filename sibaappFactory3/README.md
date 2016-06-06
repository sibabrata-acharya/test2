# Node JS template application for OAuth2.0 authentication.

## Developer can leverage this template application code, modify according to their business functionality and can push to PaaS platform.

### Template application files

File | Description
:-- | :-- 
app.js | This file does all the bootstrapping by require-ing all the controllers, models and middlewares. Configures the port and domain, starts the application on the available or given port.
facebook.js | Configures the Facebook strategy for use by Passport. Provides routes for facebook authentication.
google.js | Configures the Google strategy for use by Passport. Provides routes for Google authentication.
linkedin.js | Configures the LinkedIn strategy for use by Passport. Provides routes for LinkedIn authentication.
twitter.js | Configures the Twitter strategy for use by Passport. Provides routes for Twitter authentication.
oauth.js | Configuration of API and Secret keys of the providers.
views/ | Contains the jade view files for different scenarios.
package.json | All npm packages contain a file, this file holds various metadata relevant to the project.


### Application configuration

- Before using authentication template application, you must register an application with a provider. A new application can be created at Facebook/google/twitter/linkedin developers website. Your application will be issued an app ID and app secret.
- Provide app ID and app secret to the strategy. You will also need to configure a redirect URI(callbackURL) which matches the route in your application. Refer oauth.js file.
- Configure callbackURL as redirect URI in the provider app configuration. Modify config.json accordingly

      ```
       clientID: your Provider(facebook/google/twitter/linkedin) application's App ID
       clientSecret: your Provider(facebook/google/twitter/linkedin) application's App Secret
       callbackURL: URL to which Provider(facebook/google/twitter/linkedin) will redirect the user after granting authorization(eg: http://localhost:3000/auth/facebook/callback)
      ```

### Application execution

- app.js provides three routes

      ```
       1. '/login' to show the provider options to login.
       2. '/account' to show some profile information after login to any provider
       3. '/logout' to terminate an existing login session and redirect to login page.
      ```

- After all configuration is done, start the application and try 'YOUR_DOMAIN_URL' or 'YOUR_DOMAIN_URL'/login in the browser. For eg: http://localhost:3000/login or http://localhost:3000/

