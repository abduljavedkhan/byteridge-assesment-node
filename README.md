# byteridge-assesment-node

### Setup
```
clone the repo
npm install
npm start
```

update below details on .env
```
DBURL = <DB URL>
SECRET=<Your Secret Key>
```

##### /user/register

Request
```
{
  "firstName": "john",
  "lastName": "wick",
  "username": "johnwick",
  "password": "test_123",
  "role":"Auditor"
}
```
Response:200 -success

![image](https://user-images.githubusercontent.com/44355278/129446126-b120db7b-5e03-411a-ad7a-7183803a60f1.png)



### Login
##### /user/authenticate

Request
```
{
  "username": "test2u",
  "password":"test",
  "type":"login"
}
```
Response:
with clientIP and last login timestamp

![image](https://user-images.githubusercontent.com/44355278/129446186-ed7beaaa-564a-4525-b4be-2333ae74b81c.png)


### Logout 
##### /user/authenticate

Request
```
{
  "username": "johnwick",
  "type":"logout"
}
```
Response:
with last logout timestamp

![image](https://user-images.githubusercontent.com/44355278/129446216-e1ac762d-2a09-4126-b91c-4e7c2700f7ef.png)

### Audit API
##### /user/audit

Request:
Only work with user having role as "Auditor"\
Don't forget to include token

Response:200 & List of All user with clientIP, LastLogin and LastLogout

![image](https://user-images.githubusercontent.com/44355278/129446438-92757031-3e0a-418c-ae7d-44ea6a9c3295.png)

401 If the User has role as "User"

![image](https://user-images.githubusercontent.com/44355278/129446541-7c408ff5-976c-40c7-8dee-81a045fcda82.png)
