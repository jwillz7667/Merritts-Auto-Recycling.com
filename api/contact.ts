import { createFormHandler } from './_lib/handler.js';
import { ContactSchema } from './_lib/validate.js';

export default createFormHandler({ schema: ContactSchema, formType: 'contact' });
