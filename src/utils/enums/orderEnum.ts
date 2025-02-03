export enum PaymentStatus {
  Paid = 'PAID',
  Unpaid = 'UNPAID'
}
export enum VerifyPaymentStatus {
  Failed = 'FAILED',
  Success = 'SUCCESS'
}
export enum OrderStatus {
  Delivered = 'DELIVERED',
  Delivering = 'DELIVERING',
  Confirmed = 'CONFIRMED',
  Pending = 'PENDING',
  Cancelled = 'CANCELLED'
}

export enum PaymentMethod {
  Stripe = 'STRIPE',
  COD = 'COD'
}

export enum SortOptions {
  DateDecrease = 'DATE-DECREASE',
  DateIncrease = 'DATE-INCREASE',
  PriceDecrease = 'PRICE-DECREASE',
  PriceIncrease = 'PRICE-INCREASE'
}

export enum FilterOptions {
  Delivered = 'DELIVERED',
  Delivering = 'DELIVERING',
  Confirmed = 'CONFIRMED',
  Pending = 'PENDING',
  Cancelled = 'CANCELLED',
  None = 'NONE'
}
