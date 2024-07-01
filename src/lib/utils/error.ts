import Stripe from 'stripe';

export const StripeError = (err: Stripe.errors.StripeError) => {
  if (err) {
    console.log(err);
    throw err;
  }
};

export const PrismaDBError = (err: Error) => {
  if (err) {
    console.log(err);
    throw err;
  }
};

export const AuthError = (err: Error) => {
  if (err) {
    console.log(err);
    throw err;
  }
};

export const StripeWebhookError = (err: Error) => {
  if (err) {
    console.log(err);
    throw err;
  }
};

export const BlandAIError = (err: any) => {
  console.error('Bland AI Error:', err.message);
  if (err.response) {
    // The request was made and the server responded with a status code
    console.error('Response data:', err.response.data);
    console.error('Response status:', err.response.status);
    console.error('Response headers:', err.response.headers);
  } else if (err.request) {
    // The request was made but no response was received
    console.error('Request data:', err.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error message:', err.message);
  }
  throw new Error(`Bland AI API call failed: ${err.message}`);
};
