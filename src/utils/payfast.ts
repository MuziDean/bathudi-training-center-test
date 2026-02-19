import CryptoJS from 'crypto-js';

export interface PayFastData {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  name_first?: string;
  name_last?: string;
  email_address?: string;
  cell_number?: string;
  m_payment_id?: string;
  amount: string;
  item_name: string;
  item_description?: string;
  email_confirmation?: '1' | '0';
  confirmation_address?: string;
  payment_method?: string;
}

export const generatePayFastSignature = (data: PayFastData, passphrase: string): string => {
  // Create a sorted array of parameter names (alphabetical order)
  const sortedKeys = Object.keys(data).sort() as Array<keyof PayFastData>;
  
  // Build the parameter string
  let pfOutput = '';
  
  for (const key of sortedKeys) {
    const value = data[key];
    // Skip empty values
    if (value === undefined || value === null || value === '') {
      continue;
    }
    
    // Convert to string and URL encode with quote_plus style (spaces become +)
    const stringValue = value.toString().trim();
    // CRITICAL: Use the same encoding as PayFast expects
    const encodedValue = encodeURIComponent(stringValue)
      .replace(/%20/g, '+')  // Replace %20 with + for spaces
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A');
    
    pfOutput += `${key}=${encodedValue}&`;
  }
  
  // Add the passphrase (NO ENCODING for passphrase in the string)
  pfOutput += `passphrase=${passphrase}`;
  
  console.log('🔐 String for signature:', pfOutput);
  
  // Generate MD5 hash
  const signature = CryptoJS.MD5(pfOutput).toString();
  console.log('✅ Generated signature:', signature);
  
  return signature;
};

export const PAYFAST_URLS = {
  sandbox: 'https://sandbox.payfast.co.za/eng/process',
  live: 'https://www.payfast.co.za/eng/process'
};

export const generatePaymentId = (): string => {
  return `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};