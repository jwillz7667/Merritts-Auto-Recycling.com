import { createFormHandler } from './_lib/handler.js';
import { QuoteSchema } from './_lib/schemas.js';

export default createFormHandler({ formType: 'quote', schema: QuoteSchema });
