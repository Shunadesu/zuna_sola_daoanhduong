import emailjs from '@emailjs/browser';

// EmailJS Configuration - loaded from environment variables
const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
};

const isEmailConfigured = () => {
  return (
    EMAILJS_CONFIG.serviceId &&
    EMAILJS_CONFIG.templateId &&
    EMAILJS_CONFIG.publicKey &&
    EMAILJS_CONFIG.serviceId !== 'YOUR_SERVICE_ID' &&
    EMAILJS_CONFIG.templateId !== 'YOUR_TEMPLATE_ID' &&
    EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY'
  );
};

export interface EmailParams {
  to_name: string;
  to_email: string;
  from_name: string;
  from_phone: string;
  from_email?: string;
  apartment?: string;
  message: string;
  source: 'popup' | 'contact_form';
}

// Template variables for EmailJS
const createTemplateParams = (params: EmailParams) => ({
  to_name: 'Sola Global City Team',
  // to_email: 'namp280918@gmail.com',
  to_email: 'thanhpham.02092002@gmail.com',
  from_name: params.from_name || 'Khách hàng',
  from_phone: params.from_phone,
  from_email: params.from_email || 'Không có',
  apartment: params.apartment || 'Chưa chọn',
  source: params.source === 'popup' ? 'Popup đăng ký' : 'Form liên hệ',
  message: params.message || `Yêu cầu tư vấn từ ${params.from_name || 'khách hàng'} - SĐT: ${params.from_phone}`,
  reply_to: params.from_email || params.from_phone,
});

export const emailService = {
  /**
   * Send notification email via EmailJS
   * @param params - Email parameters
   * @returns Promise<boolean> - true if email sent successfully
   */
  async sendNotification(params: EmailParams): Promise<boolean> {
    try {
      // Skip if not configured
      if (!isEmailConfigured()) {
        console.warn('EmailJS not configured. Email will not be sent.');
        return true;
      }

      const templateParams = createTemplateParams(params);

      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
      );

      return response.status === 200;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  },

  /**
   * Send confirmation email to customer
   * @param customerEmail - Customer's email
   * @param customerName - Customer's name
   * @returns Promise<boolean>
   */
  async sendConfirmation(customerEmail: string, customerName: string): Promise<boolean> {
    if (!customerEmail) return true;

    try {
      // Skip if not configured
      if (!isEmailConfigured()) {
        return true;
      }

      const templateParams = {
        to_name: customerName,
        to_email: customerEmail,
        reply_to: 'thanhpham.02092002@gmail.com',
      };

      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        'YOUR_CONFIRMATION_TEMPLATE_ID', // Create a separate template for confirmation
        templateParams,
        EMAILJS_CONFIG.publicKey
      );

      return response.status === 200;
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
      return false;
    }
  },
};

export default emailService;
