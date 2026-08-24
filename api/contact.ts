import { createFormHandler } from './_lib/handler.js';
import { ContactSchema } from './_lib/schemas.js';

export default createFormHandler({ formType: 'contact', schema: ContactSchema });
