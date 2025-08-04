# Clinic Management System - Node.js Backend

This clinic management system has been successfully converted from Django to Node.js with Express and DrizzleORM.

## Architecture

### Backend (Node.js + Express + DrizzleORM)
- **Server**: Express.js running on port 8000
- **Database**: SQLite with DrizzleORM
- **Authentication**: Token-based authentication (compatible with Django style)
- **API**: RESTful endpoints matching original Django patterns

### Frontend (React)
- **Framework**: React with Redux
- **UI**: Ant Design components
- **Development**: Runs on port 3000
- **Language**: Bilingual (Arabic/English)

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Install Frontend Dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Initialize Database**
   ```bash
   cd backend
   node seed.js
   ```

### Running the Application

#### Option 1: Run Both Services Together
```bash
npm run dev
```

#### Option 2: Run Services Separately

**Backend:**
```bash
npm run backend
# Backend will run on http://localhost:8000
```

**Frontend:**
```bash
npm start
# Frontend will run on http://localhost:3000
```

## Default Users

The system comes with two pre-configured users:

| Username | Password   | Role    | Token |
|----------|------------|---------|-------|
| admin    | admin123   | ADMIN   | Auto-generated |
| manager  | manager123 | MANAGER | Auto-generated |

## API Endpoints

### Authentication
- `POST /api-token-auth/` - Login and get token
- `GET /api/auth/user/` - Get current user info

### Patients
- `GET /patient/` - List all patients
- `GET /patient/:id/` - Get patient details
- `POST /patient/` - Create new patient
- `PUT /patient/:id/` - Update patient
- `DELETE /patient/:id/` - Delete patient

### Appointments
- `GET /appointments/` - List all appointments
- `GET /appointments/:id/` - Get appointment details
- `POST /appointments/` - Create new appointment
- `PUT /appointments/:id/` - Update appointment
- `DELETE /appointments/:id/` - Delete appointment

### Treatments
- `GET /treatments/` - List all treatments
- `GET /treatments/:id/` - Get treatment details
- `POST /treatments/` - Create new treatment
- `PUT /treatments/:id/` - Update treatment
- `DELETE /treatments/:id/` - Delete treatment

### Payments
- `GET /payment/` - List all payments/bills
- `GET /payment/:id/` - Get payment details
- `PUT /payment/:id/` - Update payment
- `POST /payment/` - Create new payment

### Dental Charts
- `GET /adultteeth/` - List adult teeth charts
- `GET /adultteeth/:id/` - Get adult teeth chart
- `PUT /adultteeth/:id/` - Update adult teeth chart
- `GET /childteeth/` - List child teeth charts
- `GET /childteeth/:id/` - Get child teeth chart
- `PUT /childteeth/:id/` - Update child teeth chart

## Database Schema

### Users
- Custom user model with ADMIN/MANAGER roles
- Token-based authentication

### Patients
- Patient demographic information
- Linked to doctor (user)
- Auto-generated dental charts

### Appointments
- Appointment scheduling
- Linked to patient and doctor
- Auto-generated billing records

### Treatments
- Medical treatment records
- Linked to patients
- Tooth position tracking

### Payments/Bills
- Financial transaction tracking
- Linked to appointments
- Balance management

### Dental Charts
- Adult teeth chart (32 teeth)
- Child teeth chart (20 teeth)
- Condition tracking per tooth

## Features

✅ **Complete CRUD Operations** for all entities
✅ **Authentication & Authorization** with token-based system
✅ **Dental Chart Management** for adult and child patients
✅ **Appointment Scheduling** with automatic bill creation
✅ **Financial Tracking** with payment management
✅ **Bilingual Interface** (Arabic/English)
✅ **Responsive Design** with Ant Design
✅ **Database Seeding** with sample data

## Development

### Project Structure
```
clinic/
├── backend/               # Node.js Express API
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth middleware
│   │   └── db/           # Database schema & config
│   ├── server.js         # Main server file
│   ├── seed.js           # Database seeding
│   └── package.json
├── src/                  # React frontend
├── public/               # Static assets
└── package.json         # Frontend dependencies
```

### Environment Variables

**Backend (.env)**
```
NODE_ENV=development
PORT=8000
JWT_SECRET=your-secret-key
DATABASE_URL=./database.db
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:8000
```

## Migration from Django

The system maintains API compatibility with the original Django backend:

- ✅ Same endpoint URLs and patterns
- ✅ Same request/response formats
- ✅ Compatible authentication tokens
- ✅ Identical database schema
- ✅ All original features preserved

## Health Check

Visit `http://localhost:8000/health` to verify the backend is running.

## Troubleshooting

### Common Issues

**React Build Errors**: Use `--openssl-legacy-provider` flag for older React versions
**Port Conflicts**: Ensure ports 3000 and 8000 are available
**Database Issues**: Re-run `node seed.js` to reset database

### Logs
- Backend logs appear in the terminal running the Express server
- Frontend logs appear in browser console and terminal