# Nodejs-MongoDB

### <u>Solutions :</u> 

1. Here CORS exception was handled.
2. It is an nodejs service here you can find create account ,forgot password , reset password with notification mail scinario's.  
3. Topic's discussed/used
   1. cluster / application level scaling
   2. JWT token based authentication
   3. Notification Mails using Nodejs
4. Please find the API documentation from the below segment.

#### <u>Pre-requirements :</u> 

 1. Please do the changes which is mentioned below ,

     1. file name : ./router/config.js

        `module.exports = {

        ​    'secret': 'mysecret',

        ​    'username':'yourmail@gmail.com',

        ​    'password':'YOUR PASSWORD',

        ​    'service':'gmail',

        ​    'db_namespace':'localhost',

        ​    'port':27017

          };`

    

### <u>API Documentation :</u> 

1. Create Account 

   1. API : http://localhost:3000/authentication/account/create 

   2. header : Content-Type:application/json

   3. Method : POST

   4. Body : 

      `{
      	"accountname":"vivek",
      	"email":"vivekjava96@gmail.in",
      	"password":"Vivekjava"
      }`

   5. Response : 

      1. Success : 

         `{
             "code": 200,
             "message": "Record inserted successfully."
         }`

      2. Exception :  (if email already exists)

         `{
             "code": 400,
             "message": "Account Already Exists."
         }`

2. Forgot password : 

   1. API : http://localhost:3000/authentication/account/forgot 

   2. header : Content-Type:application/json

   3. Method : POST

   4. Body : 

      `{
      	"email":"vivekjava96@gmail.in"
      }`

   5. Response : 

      1. Success : 

         `{
             "code": 200,
             "message": "Please check your mail to reset your password."
         }`

         Description : In your email you will get a four digit number, you should send that four digit number with password reset API.

3. Password Reset : 

   1. API : http://localhost:3000/authentication/account/reset 

   2. header : Content-Type:application/json

   3. Method : POST

   4. Body : 

      `{
      	

      ```json
      "email":"vivekjava96@yahoo.in",
      "password":"Vivek@1996",
      "code":"2011"
      ```
      }`

   5. Response : 

      1. Success : 

         `{
             "code": 200,
             "message": "Password reset successfully."
         }`

      2. Exception : 

         `{
             "code": 400,
             "message": "invalid code please try again."
         }`

         Description : In case if the code was already used or wrong code was given by the user.

   6. Login API : 

      1. API : http://localhost:3000/authentication/account/authenticate  

      2. header : Content-Type:application/json

      3. Method : POST

      4. Body : 

         `{
         	

         ```json
         "email":"vivekjava96@yahoo.in",
         "password":"Your_Password"
         ```
         }`

      5. Response : 

         1. Success : 

            `{
                "code": 200,
                "message": "successfully logged in.",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgyMGEzMWIyLTQwZTAtNDBhMS04NjZjLTIzZmNhZTAyNTA3YyIsInRpbWVzdGFtcCI6IjIwMTgtMTAtMDlUMDk6MDY6MjguODA5WiIsImlhdCI6MTUzOTA3NTk4OCwiZXhwIjoxNTM5MTYyMzg4fQ.8uu-QlDXvlGrEAfGCW5_Hf-CIb8QiJoxjIg7MzcDhJM"
            }`

         2. Exception : 

            `{
                "code": 401,
                "message": "un-authorized"
            }`

