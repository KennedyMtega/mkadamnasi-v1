import { PaymentGateway, InitiateParams, PaymentResult, PaymentStatus, CallbackResult } from './index';

/**
 * M-Pesa Payment Gateway (Vodacom Tanzania).
 *
 * Integration Steps (TODO):
 * 1. Register at https://openapiportal.m-pesa.com/
 * 2. Get API Key and Public Key
 * 3. Set environment variables:
 *    - MPESA_API_KEY
 *    - MPESA_PUBLIC_KEY
 *    - MPESA_SERVICE_PROVIDER_CODE
 *    - MPESA_BASE_URL (sandbox or production)
 * 4. Implement STK Push (C2B) flow
 * 5. Set up callback URL for payment confirmations
 *
 * M-Pesa Tanzania API docs:
 * https://openapiportal.m-pesa.com/api-documentation
 */
export class MpesaGateway implements PaymentGateway {
  name = 'M-Pesa';

  /**
   * Initiate an M-Pesa STK Push (C2B) payment.
   *
   * Flow:
   * 1. Generate session key using API Key + Public Key (RSA encryption)
   * 2. Send C2B single-stage payment request
   * 3. Customer receives prompt on their phone
   * 4. Result delivered via callback URL
   */
  async initiatePayment(params: InitiateParams): Promise<PaymentResult> {
    // TODO: Implement M-Pesa STK Push
    // 1. Generate session key using API Key + Public Key
    // 2. Send C2B payment request to MPESA_BASE_URL
    // 3. Return transaction reference
    console.warn('M-Pesa payment not yet implemented', {
      amount: params.amount,
      currency: params.currency,
      reference: params.reference,
    });
    return {
      success: false,
      error: 'Malipo ya M-Pesa hayajawezeshwa bado. Hivi karibuni!',
    };
  }

  /**
   * Query the status of an M-Pesa transaction.
   */
  async checkStatus(transactionId: string): Promise<PaymentStatus> {
    // TODO: Query M-Pesa transaction status API
    console.warn('M-Pesa status check not yet implemented for:', transactionId);
    return 'PENDING';
  }

  /**
   * Parse and validate an M-Pesa callback/webhook payload.
   *
   * TODO:
   * - Validate callback signature/origin
   * - Parse the M-Pesa result payload
   * - Extract transaction details (ConversationID, TransactionID, ResultCode)
   * - Update local Payment record status
   */
  async handleCallback(body: unknown): Promise<CallbackResult> {
    // TODO: Parse M-Pesa callback payload
    // Validate signature
    // Extract transaction details
    console.warn('M-Pesa callback handler not yet implemented', body);
    return {
      success: false,
      transactionId: '',
      providerRef: '',
      amount: 0,
      status: 'FAILED',
    };
  }
}

/** Singleton M-Pesa gateway instance. */
export const mpesa = new MpesaGateway();
