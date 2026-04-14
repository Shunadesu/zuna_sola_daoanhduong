import fetch from 'node-fetch';

interface QuoteData {
  fullName: string;
  phone: string;
  email?: string;
  apartment?: string;
  message?: string;
}

class TelegramService {
  private botToken: string | undefined;
  private chatId: string | undefined;
  private apiUrl: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN;
    this.chatId = process.env.TELEGRAM_CHAT_ID;
    this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  isConfigured(): boolean {
    return !!(this.botToken && this.chatId);
  }

  private async sendMessage(text: string): Promise<boolean> {
    if (!this.isConfigured()) {
      console.log('Telegram not configured, skipping message');
      return false;
    }

    try {
      const response = await fetch(`${this.apiUrl}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.chatId,
          text,
          parse_mode: 'Markdown'
        })
      });

      if (!response.ok) {
        console.error('Telegram API error:', await response.text());
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to send Telegram message:', error);
      return false;
    }
  }

  async sendQuoteNotification(quote: QuoteData): Promise<boolean> {
    const message = `📩 *Yêu cầu báo giá mới*

👤 Họ tên: *${quote.fullName}*
📱 Điện thoại: ${quote.phone}
📧 Email: ${quote.email || 'Không có'}
🏠 Căn hộ: ${quote.apartment || 'Chưa chọn'}
💬 Tin nhắn: ${quote.message || 'Không có'}
⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}`;

    return this.sendMessage(message);
  }

  async sendVisitMilestone(total: number): Promise<boolean> {
    const message = `🎉 *Mốc lượt truy cập mới!*

📊 Tổng lượt truy cập: *${total.toLocaleString('vi-VN')}*
🕐 Thời gian: ${new Date().toLocaleString('vi-VN')}`;

    return this.sendMessage(message);
  }

  async sendTestMessage(): Promise<boolean> {
    return this.sendMessage('✅ *Bot đã kết nối thành công!*');
  }
}

export const telegramService = new TelegramService();
export default telegramService;
