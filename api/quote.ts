import { createFormHandler } from './_lib/handler.js';
import { QuoteSchema } from './_lib/validate.js';

export default createFormHandler({ schema: QuoteSchema, formType: 'quote' });
