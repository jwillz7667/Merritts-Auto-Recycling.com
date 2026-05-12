import { createFormHandler } from './_lib/handler.js';
import { AppointmentSchema } from './_lib/validate.js';

export default createFormHandler({ schema: AppointmentSchema, formType: 'appointment' });
