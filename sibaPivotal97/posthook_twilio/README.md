# Twilio
This module is used to send SMS using twilio 

## Main Function

  sendSMS()

## Sample

```javascript

twilio.sendSms({
    "accountSID": "r8skU2912a",
    "authToken":"BPRV4rL9N7jM9272",
    "to": "PHONE_NO",
    "from": "PHONE_NO",
    "body": "My first sms"
    }, function(err, json) {
    if (err) { return console.error(err); }
    console.log(json);
    });
```
User has to provide the AccountSID and the auth Token which is needed to connect with 
the send grid. 

Applications can enable the hooks in the developer application by downloading the source code template from here; 
inject the code in the application to call the twilio in an orderly fashion. It can be made as a prehook or posthook 
Prehooks will be called before an event, onhook will be called during the event and post hook will be called post 
the event. The sequence will be called on successful response from the previous event. If there are any errors,
the subsequent hooks will not be called.
