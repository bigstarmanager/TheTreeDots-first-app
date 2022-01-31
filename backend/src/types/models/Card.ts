import { list, objectType, unionType } from 'nexus';

const getTypeName = (data) => {
  const __typename =
    'error' in data
      ? 'CardErrorResponse'
      : data?.data?.length === 0 || data?.data?.[0]?.object === 'payment_method'
      ? 'ListCustomerCard'
      : 'paymentMethodId' in data
      ? 'DefaultStripeCardResponse'
      : null;

  if (!__typename) {
    throw new Error(`Could not resolve the type of data passed to union type "StripeResult"`);
  }
  return __typename;
};

export const StripePaymentMethod = objectType({
  name: 'StripePaymentMethod',
  definition(t) {
    t.string('id');
    t.string('object');
    t.field('card', { type: StripeCard });
    t.string('customer');
    t.string('type');
    t.string('created');
  }
});

export const StripeCard = objectType({
  name: 'StripeCard',
  definition(t) {
    t.string('brand');
    t.int('exp_month');
    t.int('exp_year');
    t.string('fingerprint');
    t.string('last4');
    t.string('country');
    t.string('funding');
  }
});

export const ListCustomerCard = objectType({
  name: 'ListCustomerCard',
  definition(t) {
    t.string('object');
    t.field('data', { type: list(StripePaymentMethod) });
    t.boolean('has_more');
    t.string('url');
  }
});

export const DefaultStripeCardResponse = objectType({
  name: 'DefaultStripeCardResponse',
  definition(t) {
    t.string('paymentMethodId');
    t.string('stripeCustomerId');
    t.field('card', { type: StripeCard });
  }
});

export const CardErrorResponse = objectType({
  name: 'CardErrorResponse',
  definition(t) {
    t.string('error');
    t.string('message');
  }
});

export const CardResponse = unionType({
  name: 'CardResponse',
  description: 'Card API Response',
  resolveType(data) {
    return getTypeName(data);
  },
  definition(t) {
    t.members(ListCustomerCard, DefaultStripeCardResponse, CardErrorResponse);
  }
});
