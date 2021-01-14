Mobile & Web Applications - Courswork 2 built utilising NextJS

## Marks Achieved
 - Home Test Self-reporting page including validation, TTN verification: 33/35
 - Log-in/sign-out function - 17/20
 - Demographics statistics for Admin Dashboard - 31/35
 - Error handling: 9/10
 
Total: 90/100

**Marks: 90/100**

This project is hosted on vercel if you want to avoid installation/setup garbage -> https://mycovtesthub.vercel.app

## Installation

You'll need nodejs or yarn to run this project

Install the dependencies

```bash
npm install
# or
yarn install
```

Start the development server

```bash
npm run dev
# or
yarn dev
```

**Note**: If installation fails please check your node/npm versions by running the following command or install the following versions.

```bash
# 12.16.2 - Node
  node -v
# 6.14.4 - npm
  npm -v
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result and test :)

## Features/Technology

- Firestore from Google for storage
- TTN Report & Validation
- API
- NextJS
- JSONWebTokens
- Nivo - Chart Displays
- Auth

## Authentication

The system provides login for the Admin/Tester users as defined in the specification.

Credential 1:

- Username: admin
- Password: 12345

Credential 2:

- Username: tester
- Password: abcde

Once a user is authenticated they are able to use all services(based on role) for 2 **hours**. This is done with the use of json webtoken stored in cookies. The secret for this jwt can be found in the `.env` file under: `JWT_SECRET`

## API

The api routes can be found under `pages/api` and has the following end points. Each file/(folder/file) is an endpoint,

`/api/ttnCodes` => This will return an array of all the ttn codes currently stored on the server.

Result (truncated for brevity):

```json
{
  "data": [
    {
      "isUsed": true,
      "code": "34GC829B"
    },
    {
      "isUsed": false,
      "code": "4F7YKH9G"
    }
  ]
}
```

`/api/ttnCodes/[ttnCode]` => This will return the data for the specified code.

Example: `/api/ttnCodes/4F7YKH9G`

```json
{
  "status": 200,
  "data": {
    "isUsed": false,
    "code": "4F7YKH9G"
  }
}
```

## Authenticated / Role Specific Routes

The following lists the routes that require authentication and/or a specific role

Route: `/api/dashboard` => This will return the raw test results held in firebase

Conditions:

- Authenticated
- Role = Admin

Example:

```json
{
  "data": [
    {
      "ttnCode": "8RL4ENTK",
      "fullName": "aaa",
      "email": "dtmohamed95@gmail.com",
      "gender": "Other",
      "address": "a@gmail.com",
      "postcode": "111",
      "testResult": "Inconclusive",
      "age": "66"
    }
  ]
}
```

Optionally you can pass in a aggregate mode query string to retreive the data mapped for the dashboard

Route: `/api/dashboard?mode=aggregate`

Data (Truncated):

```json
{
  "data": {
    "byResultCount": [
      {
        "type": "Positive",
        "cases": 13
      },
      {
        "type": "Negative",
        "cases": 2
      },
      {
        "type": "Inconclusive",
        "cases": 1
      }
    ]
  }
}
```

Route: `/api/verifyUserRole` -> Can be used to determine if the user is of a specific role

Conditions:

- Authenticated
- Header Set to Content-Type: application/json
- Body: { "roleIs": 'admin'| 'tester' | string }

// TODO: add test results api only for authenticated users

Example Request:

```json
{
  "roleIs": "tester"
}
```

Response:

```json
{
  "status": 200,
  "msg": "The user is a tester"
}
```

There are two other routes which i do not have time to document:

- `/api/login` -> Accepts a username/password json object and authenticates you
- `/api/logout` -> Will log you out if the user is authenticated
