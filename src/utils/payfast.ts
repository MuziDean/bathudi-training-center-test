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
  // Get all keys and sort alphabetically
  const keys = Object.keys(data).sort() as Array<keyof PayFastData>;
  
  // Build the parameter string
  let paramString = '';
  const params: string[] = [];
  
  for (const key of keys) {
    const value = data[key];
    // Skip empty values
    if (value === undefined || value === null || value === '') {
      continue;
    }
    
    // Convert to string and encode properly
    const stringValue = value.toString().trim();
    // Important: Use encodeURIComponent then replace %20 with +
    const encodedValue = encodeURIComponent(stringValue).replace(/%20/g, '+');
    
    paramString += `${key}=${encodedValue}&`;
    params.push(`${key}=${encodedValue}`);
  }
  
  // Add passphrase (NO ENCODING for passphrase)
  paramString += `passphrase=${passphrase}`;
  params.push(`passphrase=${passphrase}`);
  
  // Log the exact string for debugging
  console.log('🔍 Parameter string for signature:');
  console.log(paramString);
  console.log('📋 Parameters in order:', params);
  
  // Generate MD5 hash
  const signature = CryptoJS.MD5(paramString).toString();
  console.log('✅ Generated signature:', signature);
  
  return signature;
};

export const generatePayFastSignatureAlt = (data: PayFastData, passphrase: string): string => {
  // Alternative method - build array then join
  const keys = Object.keys(data).sort() as Array<keyof PayFastData>;
  const pfOutput: string[] = [];
  
  for (const key of keys) {
    const value = data[key];
    if (value !== undefined && value !== null && value !== '') {
      const encodedValue = encodeURIComponent(value.toString().trim()).replace(/%20/g, '+');
      pfOutput.push(`${key}=${encodedValue}`);
    }
  }
  
  pfOutput.push(`passphrase=${passphrase}`);
  const paramString = pfOutput.join('&');
  
  console.log('🔍 Alternative param string:', paramString);
  
  return CryptoJS.MD5(paramString).toString();
};

export const PAYFAST_URLS = {
  sandbox: 'https://sandbox.payfast.co.za/eng/process',
  live: 'https://www.payfast.co.za/eng/process'
};

export const generatePaymentId = (): string => {
  return `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};