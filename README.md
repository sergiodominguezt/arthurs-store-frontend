# Single Page Product Listing Application

This is a single-page application (SPA) designed for listing products with their details such as pictures, prices, quantities, and stock levels. Users can select a product, enter their payment information, and complete their purchases through a modal interface.

## Features

- **Product Listing**: Displays a list of products with images, prices, and available stock.
- **Buy Button**: Allows users to initiate the purchase process for each product.
- **Payment Modal**: Opens a modal for users to enter their credit card information securely.
- **Loading Spinner**: Indicates a pending transaction state using Redux for state management.
- **Seamless User Experience**: After processing the payment, users are redirected back to the main page.

## Requirements

- Node.js (version 18.x or above)
- npm (bundled with Node.js)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
2. Install the dependencies:
   ```bash
   npm install

3. Running the application
    ```bash 
    npm run start
  The application will be available at http://localhost:3001

## API Integration
The application communicates with the backend API for product information and payment processing. Ensure your backend is running and accessible.

## Example API Endpoints
  - List Products: GET http://backend-ip:3000/products
  - Process Payment: POST http://backend-ip:3000/transaction

## Technologies Used
  - React: A JavaScript library for building user interfaces.
  - Redux: For managing application state and handling asynchronous actions.
  - Axios: For making HTTP requests to the backend API.
  - CSS: For styling the components and ensuring a responsive layout.
    
## Coverage report
[Coverage report screenshot](https://ibb.co/1LtdH3V)
