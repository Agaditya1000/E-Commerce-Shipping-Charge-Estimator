# 📦 E-Commerce Shipping Charge Estimator

A robust backend application built with **Node.js**, **Express 5**, and **TypeScript** to calculate shipping charges for a B2B e-commerce marketplace (like Kirana stores ordering from sellers). It dynamically determines the most efficient warehouse for a seller drop-off and computes the final shipping charges based on item weight, geographic distance, and transport heuristics.

---

## ✨ Features

- **Distance Engine** — Uses the **Haversine Formula** to precisely calculate geographic distances (in km) between two coordinates (`lat`/`lng`).
- **Optimal Warehouse Routing** — Computes the shortest distance from the Seller's location to any marketplace warehouse.
- **Design Patterns**:
  - **Strategy Pattern** — Selects transport mode based on distance:
    | Distance Tier | Transport Mode | Rate |
    |:---|:---|:---|
    | ≥ 500 km | ✈️ Aeroplane | ₹1 per km per kg |
    | 100 – 499 km | 🚛 Truck | ₹2 per km per kg |
    | < 100 km | 🚐 Mini Van | ₹3 per km per kg |
  - **Factory Pattern** — Calculates delivery speed pricing:
    | Speed | Pricing |
    |:---|:---|
    | Standard | ₹10 courier charge + shipping rate |
    | Express | ₹10 courier charge + ₹1.2/kg surcharge + shipping rate |
- **MongoDB Atlas Integration** — Cloud-hosted document database with Mongoose ODM.
- **Input Validation** — Request validation using **Zod** schemas.
- **Automated Testing** — Unit + integration tests via Jest, Supertest, and MongoDB Memory Server.

---

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| Runtime | Node.js (v18+) |
| Framework | Express.js 5 |
| Language | TypeScript |
| Database | MongoDB (Mongoose ODM) |
| Validation | Zod |
| Testing | Jest + Supertest + MongoDB Memory Server |

---

## 📁 Project Structure

```
E-Commerce Shipping Charge Estimator/
├── src/
│   ├── app.ts                          # Express app setup & middleware
│   ├── server.ts                       # Server entry point
│   ├── controllers/
│   │   └── shippingController.ts       # Route handlers with Zod validation
│   ├── db/
│   │   ├── connection.ts               # MongoDB connection logic
│   │   ├── seed.ts                     # Database seeding script
│   │   └── models/
│   │       ├── Customer.ts             # Customer schema
│   │       ├── Seller.ts               # Seller schema
│   │       ├── Product.ts              # Product schema
│   │       └── Warehouse.ts            # Warehouse schema
│   ├── patterns/
│   │   ├── TransportStrategy.ts        # Strategy Pattern (Aeroplane/Truck/MiniVan)
│   │   └── DeliverySpeedFactory.ts     # Factory Pattern (Standard/Express)
│   ├── routes/
│   │   └── api.ts                      # API route definitions
│   └── services/
│       ├── distanceService.ts          # Haversine distance calculation
│       ├── shippingService.ts          # Shipping charge orchestration
│       └── warehouseService.ts         # Nearest warehouse lookup
├── test/
│   ├── api.test.ts                     # Integration tests (API endpoints)
│   └── core.test.ts                    # Unit tests (Distance, Strategy, Factory)
├── package.json
├── tsconfig.json
└── .env
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB Atlas** cluster connection URI (or a local MongoDB instance)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd E-Commerce-Shipping-Charge-Estimator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the project root:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<URL_ENCODED_PASSWORD>@cluster...
   PORT=3000
   ```
   > **Note:** Always URL-encode special characters like `@` or `#` in your MongoDB Atlas password.

4. **Seed the database:**

   Populate the database with sample Sellers, Customers, Products, and Warehouses:
   ```bash
   npm run seed
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   The server will start at `http://localhost:3000`.

---

## 📡 API Endpoints

Base URL: `http://localhost:3000/api/v1`

### 1. Get Nearest Warehouse

| | |
|:---|:---|
| **Method** | `GET` |
| **Endpoint** | `/warehouse/nearest` |
| **Description** | Finds the closest warehouse to a seller's location. |

**Query Parameters:**

| Parameter | Type | Required | Description |
|:---|:---|:---|:---|
| `sellerId` | String | ✅ | The seller's unique ID |
| `productId` | String | ✅ | The product's unique ID |

**Example Request:**
```
GET /api/v1/warehouse/nearest?sellerId=Seller-101&productId=Prod-101
```

**Example Response:**
```json
{
  "warehouseId": "WH-BLR-01",
  "warehouseLocation": {
    "lat": 12.99999,
    "lng": 37.923273
  }
}
```

---

### 2. Get Shipping Charge

| | |
|:---|:---|
| **Method** | `GET` |
| **Endpoint** | `/shipping-charge` |
| **Description** | Calculates delivery charge from a warehouse to a customer. |

**Query Parameters:**

| Parameter | Type | Required | Description |
|:---|:---|:---|:---|
| `warehouseId` | String | ✅ | The warehouse's unique ID |
| `customerId` | String | ✅ | The customer's unique ID |
| `deliverySpeed` | String | ✅ | `standard` or `express` |
| `productId` | String | ✅ | The product's unique ID |

**Example Request:**
```
GET /api/v1/shipping-charge?warehouseId=WH-BLR-01&customerId=Cust-123&deliverySpeed=express&productId=Prod-101
```

**Example Response:**
```json
{
  "shippingCharge": 803.59
}
```

---

### 3. Calculate Combined Shipping (End-to-End)

| | |
|:---|:---|
| **Method** | `POST` |
| **Endpoint** | `/shipping-charge/calculate` |
| **Description** | Automatically finds the nearest warehouse and computes the total shipping charge in one request. |

**Request Body (JSON):**

| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `sellerId` | String | ✅ | The seller's unique ID |
| `customerId` | String | ✅ | The customer's unique ID |
| `deliverySpeed` | String | ✅ | `standard` or `express` |
| `productId` | String | ✅ | The product's unique ID |

**Example Request:**
```bash
POST /api/v1/shipping-charge/calculate
Content-Type: application/json

{
  "sellerId": "Seller-101",
  "customerId": "Cust-123",
  "deliverySpeed": "express",
  "productId": "Prod-101"
}
```

**Example Response:**
```json
{
  "shippingCharge": 803.59,
  "nearestWarehouse": {
    "warehouseId": "WH-BLR-01",
    "warehouseLocation": {
      "lat": 12.99999,
      "lng": 37.923273
    }
  }
}
```

---

## 🧪 Running Tests

Unit tests cover the **Distance Engine**, **Strategy Pattern**, and **Factory Pattern**. Integration tests validate all API endpoints using an in-memory MongoDB instance (no external DB required).

```bash
npm run test
```

---

## 📜 Available Scripts

| Script | Command | Description |
|:---|:---|:---|
| Dev Server | `npm run dev` | Starts the server with `nodemon` + `ts-node` (hot reload) |
| Production | `npm start` | Starts the server with `ts-node` |
| Seed DB | `npm run seed` | Seeds the database with sample data |
| Run Tests | `npm test` | Runs all Jest tests |

---

## 🗄️ Sample Seed Data

The `npm run seed` command populates the following data:

**Sellers:**
| ID | Name | Location |
|:---|:---|:---|
| Seller-101 | Nestle Seller | (13.0, 38.0) |
| Seller-102 | Rice Seller | (15.0, 30.0) |
| Seller-103 | Sugar Seller | (11.5, 27.5) |

**Customers:**
| ID | Name | Location |
|:---|:---|:---|
| Cust-123 | Shree Kirana Store | (11.232, 23.445) |
| Cust-124 | Andheri Mini Mart | (17.232, 33.445) |

**Products:**
| ID | Seller | Name | Weight |
|:---|:---|:---|:---|
| Prod-101 | Seller-101 | Maggie 500g Packet | 0.5 kg |
| Prod-102 | Seller-102 | Rice Bag 10Kg | 10 kg |
| Prod-103 | Seller-103 | Sugar Bag 25kg | 25 kg |

**Warehouses:**
| ID | Name | Location |
|:---|:---|:---|
| WH-BLR-01 | BLR_Warehouse | (12.999, 37.923) |
| WH-MUMB-01 | MUMB_Warehouse | (11.999, 27.923) |

---

## 📄 License

ISC
