##### Design and Implementation of backend service for Wallet system supporting
* Setup wallet
* Credit / Debit transactions
* Fetching transactions on wallet
* Get wallet details

#### Environment 
* Node Version: v16.14.0
* Default Port: 3000



**Commands to setup/run**
if running locally need to have `.env` file in root directory
you can refer **env.example** file.
- run: 
```bash
npm run dev
```
- install: 
```bash
npm install
```
### Postman Collection for Wallet api 
` https://www.getpostman.com/collections/9812dce46c6d94fcaf22 `

#### BASE API ENDPOINT 
`https://wall3t.herokuapp.com`

#### Setup Wallet
- API EndPoint: `https://wall3t.herokuapp.com/setup`
- Request Type: `POST`
```bash
    curl --location --request POST 'https://wall3t.herokuapp.com/setup' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "name": "Wallet Bank",
        "balance": 10
    }'
```
- output
```bash
    {
        "id": "62bc2a22a1a08c7b0ddb25b6",
        "balance": 10,
        "name": "Wallet Bank",
        "transactionId": "62bc2a22a1a08c7b0ddb25b8",
        "date": "2022-06-29T10:27:38.858Z"
    }
```


#### Credit / Debit transactions
- API EndPoint: `https://wall3t.herokuapp.com/transact/:walletId`
- Request Type: `POST`
- Note: `For type credit -> amount should be +ve`
      `For type debit -> amount should be -ve`


**Case 1: CREDIT Transaction**
```bash
    curl --location --request POST 'https://wall3t.herokuapp.com/transact/62bc2235744655f120a19032' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        
        "amount": 30.1003,
        "description": "wallet recharge1",
        "type": "CREDIT"
    }'
```
- output
```bash
    {
    "balance": 52.9003,
    "tranactionId": "62bc2ee1a1a08c7b0ddb25c2"
    }
```

**Case 2: DEBIT Transaction**

```bash
    curl --location --request POST 'https://wall3t.herokuapp.com/transact/62bc2235744655f120a19032' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        
        "amount": -30.9003,
        "description": "wallet recharge1",
        "type": "DEBIT"
    }'
```
- output
```bash
        {
        "balance": 22,
        "tranactionId": "62bc2fc8a1a08c7b0ddb25c6"
        }
```


#### Fetching transactions on wallet

- API EndPoint: `https://wall3t.herokuapp.com/transactions/?walletId={walletId}&skip={skip}&limit={limit}`
- Request Type: `GET`
```bash
    curl --location --request GET 'https://wall3t.herokuapp.com/transactions/?walletId=62bc2235744655f120a19032&skip=0&limit=20'
```
- output
```bash
[
    {
        "id": "62bc2fc8a1a08c7b0ddb25c6",
        "walletId": "62bc2235744655f120a19032",
        "amount": -30.9003,
        "balance": 22,
        "description": "wallet recharge1",
        "date": "2022-06-29T10:27:38.868Z",
        "type": "DEBIT"
    },
    {
        "id": "62bc2ee1a1a08c7b0ddb25c2",
        "walletId": "62bc2235744655f120a19032",
        "amount": 30.1003,
        "balance": 52.9003,
        "description": "wallet recharge1",
        "date": "2022-06-29T10:27:38.868Z",
        "type": "CREDIT"
    },
    {
        "id": "62bc29b3a1a08c7b0ddb25b0",
        "walletId": "62bc2235744655f120a19032",
        "amount": 20.4,
        "balance": 22.8,
        "description": "Reacharge done",
        "date": "2022-06-29T10:27:38.868Z",
        "type": "CREDIT"
    },
    {
        "id": "62bc296aa1a08c7b0ddb25ac",
        "walletId": "62bc2235744655f120a19032",
        "amount": 2.4,
        "balance": 2.4,
        "description": "Reacharge done",
        "date": "2022-06-29T10:27:38.868Z",
        "type": "CREDIT"
    },
    {
        "id": "62bc22ba25ea39f83063b328",
        "walletId": "62bc2235744655f120a19032",
        "amount": -30,
        "balance": 0,
        "description": "withdraw my money2",
        "date": "2022-06-29T09:59:53.703Z",
        "type": "DEBIT"
    },
    {
        "id": "62bc22ab25ea39f83063b324",
        "walletId": "62bc2235744655f120a19032",
        "amount": 10,
        "balance": 30,
        "description": "ADD my money2",
        "date": "2022-06-29T09:59:53.703Z",
        "type": "CREDIT"
    },
    {
        "id": "62bc2268744655f120a1903c",
        "walletId": "62bc2235744655f120a19032",
        "amount": 10,
        "balance": 20,
        "description": "ADD my money",
        "date": "2022-06-29T09:57:58.625Z",
        "type": "CREDIT"
    },
    {
        "id": "62bc2235744655f120a19034",
        "walletId": "62bc2235744655f120a19032",
        "amount": 10,
        "balance": 10,
        "description": "Setup",
        "date": "2022-06-29T09:57:58.625Z",
        "type": "CREDIT"
    }
]
```

#### Get wallet details

- API EndPoint: `curl --location --request GET 'https://wall3t.herokuapp.com/wallet/:walletId'`
- Request Type: `GET`
```bash
    curl --location --request POST 'https://wall3t.herokuapp.com/setup' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "name": "Wallet Bank",
        "balance": 10
    }'
```
- output
```bash
    {
        "id": "62bc2235744655f120a19032",
        "balance": 22,
        "name": "Wallet Bank",
        "date": "2022-06-29T10:27:38.868Z"
    }
```

#### Database Design
- Using Mongoose with MongoDB

We are having 2 Document Schema one is Wallet and other is TransactionWallet.

I have modeled one-to-many relationship where all the transaction (debit/credit) is being stored in the seprate TransactionWallet document, with Wallet as a parent reference to connect them with Wallet document.

- Wallet Schema

```bash
    name: 
        type: String
    created_at: 
        type: Date   
```

- TransactionWallet Schema
```bash
    wallet_id: 
        type: String,
        ref: 'Wallet'
    
    amount: 
        type: Number,
      
    description:
        type: String
      
    balance: 
        type: Number
     
    created_at: 
        type: Date
      
    type: 
        type: String,
        enum: ['CREDIT', 'DEBIT'],
       
```



