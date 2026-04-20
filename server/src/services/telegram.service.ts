import fetch from 'node-fetch';

interface QuoteData {
  fullName: string;
  phone: string;
  email?: string;
  apartment?: string;
  message?: string;
}

class TelegramService {
  private get botToken(): string | undefined {
    return process.env.TELEGRAM_BOT_TOKEN;
  }

  private get chatId(): string | undefined {
    return process.env.TELEGRAM_CHAT_ID;
  }

  private get apiUrl(): string {
    const token = this.botToken;
    return `https://api.telegram.org/bot${token}`;
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
          parse_mode: 'Markdown',
        }),
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

  async sendQuoteNotification(quote: QuoteData & { ipAddress?: string }): Promise<boolean> {
    const phoneRaw = quote.phone.replace(/\D/g, '');
    const message = `📩 *Yêu cầu báo giá mới*

👤 *Họ tên:* ${quote.fullName}
📱 *Điện thoại:* \`${quote.phone}\`
   ▶️ Copy SĐT: ${phoneRaw}
📧 *Email:* ${quote.email || '—'}
🏠 *Căn hộ:* ${quote.apartment || '—'}
💬 *Tin nhắn:* ${quote.message || '—'}
🌐 *IP gửi:* \`${quote.ipAddress || '—'}\`
⏰ *Thời gian:* ${new Date().toLocaleString('vi-VN')}`;

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
