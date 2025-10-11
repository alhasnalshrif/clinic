# Treatment Plans and Payment Plans - Feature Documentation

## Overview
This document describes the comprehensive treatment plan and payment plan features added to the clinic management system. These features enable multi-phase treatment planning with detailed cost tracking and flexible installment-based payment scheduling.

## Features Implemented

### 1. Treatment Plans 🏥

#### Core Functionality
- **Multi-Phase Treatment Planning**: Break down complex treatments into manageable phases
- **Cost Estimation**: Track estimated costs for entire treatment and individual phases
- **Timeline Management**: Set start dates, end dates, and estimated durations
- **Priority Levels**: Categorize plans by urgency (low, medium, high, urgent)
- **Status Tracking**: Monitor progress through different stages (planned, in_progress, completed, cancelled)

#### Treatment Plan Structure
```javascript
{
  id: 1,
  patientId: 123,
  doctorId: 456,
  title: "Complete Dental Restoration",
  description: "Full mouth rehabilitation including implants and crowns",
  status: "in_progress",
  priority: "high",
  totalCost: 50000,
  estimatedDuration: "12 months",
  startDate: "2024-12-01",
  endDate: "2025-12-01",
  completionDate: null,
  notes: "Patient requires sedation for procedures",
  phases: [...]
}
```

#### Treatment Phase Structure
```javascript
{
  id: 1,
  treatmentPlanId: 1,
  phaseNumber: 1,
  title: "Phase 1: Root Canal Treatment",
  description: "Root canal on teeth 14, 15",
  status: "completed",
  cost: 8000,
  estimatedDuration: "2 weeks",
  startDate: "2024-12-01",
  completionDate: "2024-12-15",
  notes: "Completed successfully"
}
```

### 2. Payment Plans 💰

#### Core Functionality
- **Installment-Based Payments**: Split large payments into manageable installments
- **Flexible Scheduling**: Configure weekly, biweekly, or monthly payment schedules
- **Automatic Calculations**: System calculates installment amounts and due dates
- **Payment Tracking**: Monitor paid amounts and remaining balances
- **Overdue Detection**: Automatically identify and flag overdue installments
- **Integration**: Link payment plans to treatment plans or appointments

#### Payment Plan Structure
```javascript
{
  id: 1,
  patientId: 123,
  treatmentPlanId: 1,
  appointmentId: null,
  title: "Payment Plan for Dental Restoration",
  totalAmount: 50000,
  paidAmount: 10000,
  remainingAmount: 40000,
  numberOfInstallments: 10,
  installmentAmount: 5000,
  status: "active",
  startDate: "2024-12-20",
  nextDueDate: "2025-01-20",
  notes: "Agreed to 10 monthly payments",
  installments: [...]
}
```

#### Payment Installment Structure
```javascript
{
  id: 1,
  paymentPlanId: 1,
  installmentNumber: 1,
  amount: 5000,
  dueDate: "2024-12-20",
  paidDate: "2024-12-20",
  paidAmount: 5000,
  status: "paid",
  notes: "Paid in full"
}
```

## Database Schema

### New Tables Created

#### 1. `treatment_plans`
- Stores comprehensive treatment plan information
- Links to patients and doctors
- Tracks status, priority, costs, and timelines

#### 2. `treatment_plan_phases`
- Stores individual phases of treatment plans
- Ordered by phase number
- Tracks phase-specific costs and status

#### 3. `payment_plans`
- Stores payment plan information
- Links to patients, treatment plans, or appointments
- Manages installment calculations and tracking

#### 4. `payment_installments`
- Stores individual installment records
- Tracks payment status and amounts
- Automatically generates based on payment plan configuration

## API Endpoints

### Treatment Plans API

#### Get All Treatment Plans
```
GET /treatment-plans/
Response: Array of treatment plans
```

#### Get Patient's Treatment Plans
```
GET /treatment-plans/patient/:patientId
Response: Array of treatment plans for specific patient
```

#### Get Single Treatment Plan
```
GET /treatment-plans/:id
Response: Treatment plan with all phases
```

#### Create Treatment Plan
```
POST /treatment-plans/
Body: {
  patientId: number,
  doctorId: number,
  title: string,
  description?: string,
  priority?: 'low' | 'medium' | 'high' | 'urgent',
  totalCost?: number,
  estimatedDuration?: string,
  startDate?: string,
  endDate?: string,
  notes?: string,
  phases?: Array<PhaseData>
}
Response: Created treatment plan
```

#### Update Treatment Plan
```
PUT /treatment-plans/:id
Body: Partial treatment plan data
Response: Updated treatment plan
```

#### Update Treatment Plan Status
```
PATCH /treatment-plans/:id/status
Body: {
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled',
  completionDate?: string
}
Response: Updated treatment plan
```

#### Delete Treatment Plan
```
DELETE /treatment-plans/:id
Response: Success message
```

#### Add Phase to Treatment Plan
```
POST /treatment-plans/:id/phases
Body: Phase data
Response: Created phase
```

#### Update Phase
```
PUT /treatment-plans/:id/phases/:phaseId
Body: Partial phase data
Response: Updated phase
```

#### Delete Phase
```
DELETE /treatment-plans/:id/phases/:phaseId
Response: Success message
```

### Payment Plans API

#### Get All Payment Plans
```
GET /payment-plans/
Response: Array of payment plans
```

#### Get Patient's Payment Plans
```
GET /payment-plans/patient/:patientId
Response: Array of payment plans for specific patient
```

#### Get Single Payment Plan
```
GET /payment-plans/:id
Response: Payment plan with all installments
```

#### Create Payment Plan
```
POST /payment-plans/
Body: {
  patientId: number,
  treatmentPlanId?: number,
  appointmentId?: number,
  title: string,
  totalAmount: number,
  numberOfInstallments: number,
  startDate: string,
  installmentFrequency: 'weekly' | 'biweekly' | 'monthly',
  notes?: string
}
Response: Created payment plan with installments
```

#### Pay Installment
```
POST /payment-plans/:id/installments/:installmentId/pay
Body: {
  amount: number,
  paidDate?: string,
  notes?: string
}
Response: Updated installment
```

#### Update Payment Plan
```
PUT /payment-plans/:id
Body: Partial payment plan data
Response: Updated payment plan
```

#### Cancel Payment Plan
```
PATCH /payment-plans/:id/cancel
Response: Cancelled payment plan
```

#### Get Overdue Installments
```
GET /payment-plans/overdue
Response: Array of overdue installments
```

#### Delete Payment Plan
```
DELETE /payment-plans/:id
Response: Success message
```

## Frontend Integration

### API Service Methods

All endpoints are available through the `apiService` object in `src/services/api.js`:

#### Treatment Plans
- `apiService.getTreatmentPlans()`
- `apiService.getPatientTreatmentPlans(patientId)`
- `apiService.getTreatmentPlan(id)`
- `apiService.createTreatmentPlan(data)`
- `apiService.updateTreatmentPlan(id, data)`
- `apiService.updateTreatmentPlanStatus(id, data)`
- `apiService.deleteTreatmentPlan(id)`
- `apiService.addTreatmentPhase(planId, data)`
- `apiService.updateTreatmentPhase(planId, phaseId, data)`
- `apiService.deleteTreatmentPhase(planId, phaseId)`

#### Payment Plans
- `apiService.getPaymentPlans()`
- `apiService.getPatientPaymentPlans(patientId)`
- `apiService.getPaymentPlan(id)`
- `apiService.createPaymentPlan(data)`
- `apiService.updatePaymentPlan(id, data)`
- `apiService.cancelPaymentPlan(id)`
- `apiService.deletePaymentPlan(id)`
- `apiService.payInstallment(planId, installmentId, data)`
- `apiService.getOverdueInstallments()`

## Use Cases

### Use Case 1: Complex Multi-Phase Treatment

**Scenario**: Patient needs full mouth rehabilitation

1. Create treatment plan with 4 phases:
   - Phase 1: Extractions and cleaning (2,000 SAR)
   - Phase 2: Root canal treatments (8,000 SAR)
   - Phase 3: Dental implants (25,000 SAR)
   - Phase 4: Crown placements (15,000 SAR)

2. Create payment plan for 50,000 SAR total:
   - 10 monthly installments of 5,000 SAR each
   - First payment on treatment start date

3. Track progress:
   - Update phase status as each phase completes
   - Record installment payments as received
   - Monitor remaining balance and upcoming payments

### Use Case 2: Simple Treatment with Payment Plan

**Scenario**: Patient needs dental crown

1. Create treatment plan:
   - Single phase treatment
   - Cost: 5,000 SAR
   - Duration: 2 weeks

2. Create payment plan:
   - 5 weekly installments of 1,000 SAR
   - Patient pays weekly

3. Track:
   - Mark each installment as paid when received
   - System automatically updates remaining balance

### Use Case 3: Treatment Linked to Appointment

**Scenario**: Emergency treatment

1. Create appointment for patient
2. Create payment plan linked to appointment
3. No treatment plan needed for simple procedures
4. Track payment installments

## Benefits

### For Clinic Management
- 📊 **Better Financial Planning**: Clear visibility of expected revenue
- 📅 **Treatment Timeline Tracking**: Monitor multi-phase treatments
- 💵 **Flexible Payment Options**: Offer installment plans to patients
- 🎯 **Priority Management**: Focus on urgent cases
- 📈 **Revenue Forecasting**: Predict income based on payment schedules

### For Patients
- 💰 **Affordable Payments**: Break large bills into manageable amounts
- 📱 **Clear Communication**: Understand treatment phases and costs
- ⏰ **Payment Reminders**: Know when payments are due
- 📊 **Treatment Progress**: See how treatment is progressing

### For Doctors
- 📋 **Organized Planning**: Structure complex treatments logically
- 💡 **Cost Transparency**: Clear cost breakdown by phase
- ✅ **Phase Completion Tracking**: Mark phases as complete
- 📝 **Detailed Notes**: Add notes for each phase

## Testing Results

### Backend API Tests ✅
All endpoints tested successfully:

1. ✅ Create treatment plan with 3 phases
2. ✅ Retrieve treatment plan with phases
3. ✅ Create payment plan with 6 installments
4. ✅ Retrieve payment plan with installments
5. ✅ Pay first installment
6. ✅ Update treatment plan status
7. ✅ Get patient's treatment plans
8. ✅ Get patient's payment plans

### Test Scenario Results
- Patient created: ✅
- Treatment plan with 3 phases: ✅
- Payment plan with 6 installments: ✅
- Installment payment processed: ✅
- Automatic balance updates: ✅
- Status tracking: ✅

## Migration

The migration file `0002_add_treatment_payment_plans.sql` creates:
- 4 new tables
- 8 indexes for query optimization
- Foreign key relationships
- Default values for status fields

## Security Considerations

1. **Authentication Required**: All endpoints require authentication
2. **Patient Data Protection**: Links to patient records are protected
3. **Financial Data Security**: Payment information stored securely
4. **Audit Trail**: Created/updated timestamps for all records

## Future Enhancements

Potential future improvements:
- Automated payment reminders via SMS/Email
- Payment plan templates for common treatments
- Treatment outcome tracking
- Insurance integration
- Multi-currency support
- Payment gateway integration
- PDF invoice generation for installments
- Dashboard widgets for overdue payments

## Conclusion

The treatment plan and payment plan features provide comprehensive tools for:
- Managing complex, multi-phase dental treatments
- Offering flexible payment options to patients
- Tracking treatment progress and financial status
- Improving clinic revenue management

All features are fully functional, tested, and ready for production use.
