const { sqliteTable, text, integer, primaryKey } = require('drizzle-orm/sqlite-core');
const { relations } = require('drizzle-orm');

// Users table - matching Django User model
const users = sqliteTable('users_user', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  email: text('email'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  isStaff: integer('is_staff', { mode: 'boolean' }).default(false),
  isSuperuser: integer('is_superuser', { mode: 'boolean' }).default(false),
  dateJoined: text('date_joined').default(new Date().toISOString()),
  lastLogin: text('last_login'),
  group: text('group').notNull(), // 'ADMIN' or 'MANAGER'
});

// Patients table - matching Django Patient model
const patients = sqliteTable('patient_patient', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  doctorId: integer('doctor_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  phone: text('phone'),
  bloodgroup: text('bloodgroup'),
  sex: text('sex').default('MALE'), // 'MALE' or 'FEMALE'
  age: integer('age'),
  createdAt: text('created_at').default(new Date().toISOString()),
  updatedAt: text('updated_at').default(new Date().toISOString()),
});

// Adult Teeth Chart - matching Django AdultTeethChart model
const adultTeethCharts = sqliteTable('patient_adultteethchart', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  patientId: integer('patient_id').notNull().references(() => patients.id),
  UR_1: text('UR_1').default('None'),
  UR_2: text('UR_2').default('None'),
  UR_3: text('UR_3').default('None'),
  UR_4: text('UR_4').default('None'),
  UR_5: text('UR_5').default('None'),
  UR_6: text('UR_6').default('None'),
  UR_7: text('UR_7').default('None'),
  UR_8: text('UR_8').default('None'),
  UL_9: text('UL_9').default('None'),
  UL_10: text('UL_10').default('None'),
  UL_11: text('UL_11').default('None'),
  UL_12: text('UL_12').default('None'),
  UL_13: text('UL_13').default('None'),
  UL_14: text('UL_14').default('None'),
  UL_15: text('UL_15').default('None'),
  UL_16: text('UL_16').default('None'),
  LL_17: text('LL_17').default('None'),
  LL_18: text('LL_18').default('None'),
  LL_19: text('LL_19').default('None'),
  LL_20: text('LL_20').default('None'),
  LL_21: text('LL_21').default('None'),
  LL_22: text('LL_22').default('None'),
  LL_23: text('LL_23').default('None'),
  LL_24: text('LL_24').default('None'),
  LR_25: text('LR_25').default('None'),
  LR_26: text('LR_26').default('None'),
  LR_27: text('LR_27').default('None'),
  LR_28: text('LR_28').default('None'),
  LR_29: text('LR_29').default('None'),
  LR_30: text('LR_30').default('None'),
  LR_31: text('LR_31').default('None'),
  LR_32: text('LR_32').default('None'),
});

// Child Teeth Chart - matching Django ChildTeethChart model
const childTeethCharts = sqliteTable('patient_childteethchart', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  patientId: integer('patient_id').notNull().references(() => patients.id),
  UR_A: text('UR_A').default('None'),
  UR_B: text('UR_B').default('None'),
  UR_C: text('UR_C').default('None'),
  UR_D: text('UR_D').default('None'),
  UR_E: text('UR_E').default('None'),
  UL_F: text('UL_F').default('None'),
  UL_G: text('UL_G').default('None'),
  UL_H: text('UL_H').default('None'),
  UL_I: text('UL_I').default('None'),
  UL_J: text('UL_J').default('None'),
  LL_K: text('LL_K').default('None'),
  LL_L: text('LL_L').default('None'),
  LL_M: text('LL_M').default('None'),
  LL_N: text('LL_N').default('None'),
  LL_O: text('LL_O').default('None'),
  LR_P: text('LR_P').default('None'),
  LR_Q: text('LR_Q').default('None'),
  LR_R: text('LR_R').default('None'),
  LR_S: text('LR_S').default('None'),
  LR_T: text('LR_T').default('None'),
});

// Appointments table - matching Django Appointment model
const appointments = sqliteTable('appointment_appointment', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  patientId: integer('patient_id').notNull().references(() => patients.id),
  doctorId: integer('doctor_id').notNull().references(() => users.id),
  token: integer('token'),
  date: text('date'),
  time: text('time'),
  reason: text('reason').notNull(),
  createdAt: text('created_at').default(new Date().toISOString()),
  updatedAt: text('updated_at').default(new Date().toISOString()),
});

// Treatments table - matching Django Treatment model
const treatments = sqliteTable('treatment_treatment', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  patientId: integer('patient_id').notNull().references(() => patients.id),
  title: text('title').notNull(),
  token: integer('token').notNull(),
  description: text('description'),
  toothPosition: text('toothPosition'),
  dentalTest: text('dental_test'),
  createdAt: text('created_at').default(new Date().toISOString()),
  updatedAt: text('updated_at').default(new Date().toISOString()),
});

// Bills table - matching Django Bill model
const bills = sqliteTable('payment_bill', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  appointmentId: integer('appointment_id').notNull().references(() => appointments.id),
  amountPaid: integer('amount_paid').default(0),
  currentBalanceBefore: integer('current_balance_before').default(0),
  newBalanceAfter: integer('new_balance_after').default(0),
  datePaid: text('date_paid').default(new Date().toISOString()),
});

// Authentication tokens table
const authTokens = sqliteTable('authtoken_token', {
  key: text('key').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  created: text('created').default(new Date().toISOString()),
});

// Relations
const usersRelations = relations(users, ({ many }) => ({
  patients: many(patients),
  appointments: many(appointments),
  tokens: many(authTokens),
}));

const patientsRelations = relations(patients, ({ one, many }) => ({
  doctor: one(users, {
    fields: [patients.doctorId],
    references: [users.id],
  }),
  adultTeethChart: one(adultTeethCharts),
  childTeethChart: one(childTeethCharts),
  appointments: many(appointments),
  treatments: many(treatments),
}));

const appointmentsRelations = relations(appointments, ({ one }) => ({
  patient: one(patients, {
    fields: [appointments.patientId],
    references: [patients.id],
  }),
  doctor: one(users, {
    fields: [appointments.doctorId],
    references: [users.id],
  }),
  bill: one(bills),
}));

const treatmentsRelations = relations(treatments, ({ one }) => ({
  patient: one(patients, {
    fields: [treatments.patientId],
    references: [patients.id],
  }),
}));

const billsRelations = relations(bills, ({ one }) => ({
  appointment: one(appointments, {
    fields: [bills.appointmentId],
    references: [appointments.id],
  }),
}));

const adultTeethChartsRelations = relations(adultTeethCharts, ({ one }) => ({
  patient: one(patients, {
    fields: [adultTeethCharts.patientId],
    references: [patients.id],
  }),
}));

const childTeethChartsRelations = relations(childTeethCharts, ({ one }) => ({
  patient: one(patients, {
    fields: [childTeethCharts.patientId],
    references: [patients.id],
  }),
}));

const authTokensRelations = relations(authTokens, ({ one }) => ({
  user: one(users, {
    fields: [authTokens.userId],
    references: [users.id],
  }),
}));

module.exports = {
  users,
  patients,
  adultTeethCharts,
  childTeethCharts,
  appointments,
  treatments,
  bills,
  authTokens,
  usersRelations,
  patientsRelations,
  appointmentsRelations,
  treatmentsRelations,
  billsRelations,
  adultTeethChartsRelations,
  childTeethChartsRelations,
  authTokensRelations,
};