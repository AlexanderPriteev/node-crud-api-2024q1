# CRUD API
To install all dependencies use `npm install` or `npm i`  

 ---

## Scripts

Start development mode `npm start` or `npm run start:dev`  
Start production mode `npm run start:prod`  
Start multiple mode `npm run start:multi` (development) or `npm run start:prod:multi` (production)  

Start tests `npm run test` or `npm run test:verbose` (with logging)  

 ---

## Endpoints

Default base URL is http://localhost:4000/ *(configure port in `.env`)*  

**GET** `api/users` is used to get all persons  
**GET** `api/users/{userId}`   
**POST** `api/users` is used to create record about new user and store it in database  
**PUT** `api/users/{userId}` is used to update existing user  
**DELETE** `api/users/{userId}` is used to delete existing user from database  

*`{userId}` is generated using UUIDv4*