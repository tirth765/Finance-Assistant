# Finance Assistant

A comprehensive financial management application that helps users track their expenses, manage budgets, set financial goals, and receive notifications.

## Features

- User authentication and profile management
- Budget tracking and analysis
- Transaction management
- Financial goals setting and tracking
- Notifications and alerts
- Financial reports and analytics

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (for the backend)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd finance-assistant
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd ../Node/signup
npm install
```

4. Create a `.env` file in the frontend directory with the following content:
```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development
```

5. Create a `.env` file in the backend directory with the following content:
```
PORT=8000
MONGODB_URI=mongodb://localhost:27017/finance_assistant
JWT_SECRET=your_jwt_secret
```

## Running the Application

### Development Mode

To run both frontend and backend servers simultaneously:

```bash
# From the finance-assistant directory
npm run dev
```

This will start:
- Frontend server on http://localhost:3000
- Backend server on http://localhost:8000

### Running Frontend Only

```bash
npm start
```

### Running Backend Only

```bash
npm run start:backend
```

## Building for Production

To create a production build:

```bash
npm run build
```

The build files will be created in the `build` directory.

## Testing

To run tests:

```bash
npm test
```

## Project Structure

```
finance-assistant/
├── public/
├── src/
│   ├── components/
│   ├── redux/
│   ├── utils/
│   │   └── api/
│   ├── Container/
│   └── App.js
└── package.json

Node/signup/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
