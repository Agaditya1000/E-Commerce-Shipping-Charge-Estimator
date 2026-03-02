# E-Commerce Shipping Charge Estimator

A robust backend application built with **Node.js**, **Express**, and **TypeScript** to calculate shipping charges for a B2B e-commerce marketplace (like Kirana stores ordering from sellers). It dynamically determines the most efficient warehouse for a seller drop-off and computes the final shipping charges based on item weight, geographic distance, and transport heuristics.

## Features

*   **Distance Engine**: Uses the **Haversine Formula** to precisely calculate geographic distances (in kilometers) between two coordinates (`lat`/`lng`).
*   **Optimal Warehouse Routing**: Computes the shortest distance from the Seller's location to any given marketplace warehouse.
*   **Design Patterns Implementations**:
    *   **Strategy Pattern**: Calculates the base transport cost using specific strategies depending on distance tiers:
        *   `Aeroplane` (Over >500km): 1 Rs per km per kg
        *   `Truck` (100km to 499km): 2 Rs per km per kg
        *   `Mini Van` (<100km): 3 Rs per km per kg
    *   **Factory Pattern**: Calculates the courier and delivery pricing speeds:
        *   `Standard`: Base Courier + Shipping rate
        *   `Express`: Base Courier + Rs 1.2 per kg Surcharge + Shipping rate
*   **MongoDB Atlas Integration**: Hosted Document DB cluster using Mongoose schemas.
*   **Input Validation**: Safe query parsing using Zod middlewares.

## Tech Stack

*   **Runtime:** Node.js (v18+)
*   **Framework:** Express.js 5
*   **Language:** TypeScript
*   **Database:** MongoDB (mongoose)
*   **Testing Setup:** Jest + Supertest (API testing) + MongoDB Memory Server

## Project Installation

### Prerequisites

Make sure you have Node installed locally. You will also need a MongoDB Atlas Cluster connection URI.

### Steps

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    Ensure you have a `.env` file in the root of your project directory with the MongoDB Atlas Connection string:
    ```env
    MONGODB_URI=mongodb+srv://<username>:<URL_ENCODED_PASSWORD>@cluster...
    PORT=3000
    ```
    *Note: Always URL-encode special characters like `@` or `#` in your MongoDB Atlas password.*

3.  **Database Seeding Data:**
    Populate the cloud database with the sample Seller, Customer, Product, and Warehouse data from the original problem statement:
    ```bash
    npm run seed
    ```

4.  **Start the Local Server:**
    Runs the app locally using `nodemon` and `ts-node` for live compilation:
    ```bash
    npm run dev
    ```

## Running Tests

We implement unit tests (`Distance`, `Factory`, `Strategy`) and integration request tests on the Express routing layer natively bypassing local DNS configurations using a fast `mongodb-memory-server` setup.

```bash
npm run test
```

## API Documentation

| Method | Endpoint | Description | Query/Body Params |
| :-- | :--- | :--- | :--- |
| `GET` | `/api/v1/warehouse/nearest` | Given a `sellerId` and `productId`, returns the closest warehouse object coordinates. | `sellerId` (String), `productId` (String) |
| `GET` | `/api/v1/shipping-charge` | Calculates the delivery charge from a Warehouse to a Customer. | `warehouseId`, `customerId`, `deliverySpeed` ('standard'/'express'), `productId` |
| `POST` | `/api/v1/shipping-charge/calculate` | Combines both algorithms dynamically fetching nearest warehouse and computing exact total price automatically. | **Body:** `{ sellerId, customerId, deliverySpeed, productId }` |

### Sample Response (`POST /calculate`)

```json
{
  "shippingCharge": 180.00,
  "nearestWarehouse": {
    "warehouseId": "789",
    "warehouseLocation": { "lat": 12.99999, "lng": 37.923273 }
  }
}
```
