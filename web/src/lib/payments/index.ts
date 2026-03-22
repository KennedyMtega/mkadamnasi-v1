/**
 * Payment gateway interface for Mkadamnasi platform.
 *
 * All payment providers (M-Pesa, Tigo Pesa, Airtel Money, Halo Pesa)
 * should implement this interface to ensure consistent integration.
 */

/** Parameters for initiating a payment request. */
export interface InitiateParams {
  /** Amount in the smallest currency unit (e.g., TZS). */
  amount: number;
  /** ISO 4217 currency code (e.g., "TZS"). */
  currency: string;
  /** Customer's phone number in international format. */
  phoneNumber: string;
  /** Human-readable description shown to the customer. */
  description: string;
  /** Internal reference for matching callbacks to transactions. */
  reference: string;
  /** URL the payment provider should call with the result. */
  callbackUrl: string;
}

/** Result of a payment initiation request. */
export interface PaymentResult {
  success: boolean;
  /** Internal transaction ID. */
  transactionId?: string;
  /** Provider-side reference number. */
  providerRef?: string;
  /** Error message if the initiation failed. */
  error?: string;
}

/** Result parsed from a provider callback. */
export interface CallbackResult {
  success: boolean;
  transactionId: string;
  providerRef: string;
  amount: number;
  status: 'COMPLETED' | 'FAILED';
}

/** Possible statuses for a payment transaction. */
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

/** Interface that all payment gateways must implement. */
export interface PaymentGateway {
  /** Display name of the payment provider. */
  name: string;

  /**
   * Initiate a payment (e.g., STK Push for M-Pesa).
   * @param params - Payment parameters
   * @returns Result with transaction ID on success
   */
  initiatePayment(params: InitiateParams): Promise<PaymentResult>;

  /**
   * Query the status of a previously initiated payment.
   * @param transactionId - Internal transaction ID
   * @returns Current payment status
   */
  checkStatus(transactionId: string): Promise<PaymentStatus>;

  /**
   * Process a callback/webhook from the payment provider.
   * @param body - Raw callback body from the provider
   * @returns Parsed callback result
   */
  handleCallback(body: unknown): Promise<CallbackResult>;
}
