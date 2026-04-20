import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../../middleware/index.js';

const router = Router();

router.use(authMiddleware);

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

// GET - Lấy thông tin cấu hình Telegram hiện tại
router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    res.json({
      success: true,
      data: {
        botToken: BOT_TOKEN ? `${BOT_TOKEN.substring(0, 10)}...${BOT_TOKEN.substring(BOT_TOKEN.length - 5)}` : '',
        botTokenRaw: BOT_TOKEN,
        chatId: CHAT_ID,
        isConfigured: !!(BOT_TOKEN && CHAT_ID),
      },
    });
  } catch (error) {
    console.error('Get Telegram config error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// PUT - Cập nhật cấu hình Telegram (ghi vào file .env)
router.put('/', async (req: AuthRequest, res: Response) => {
  try {
    const { botToken, chatId } = req.body;

    if (!botToken || !chatId) {
      res.status(400).json({ success: false, message: 'Bot token và Chat ID đều bắt buộc' });
      return;
    }

    const fs = await import('fs');
    const path = await import('path');
    const envPath = path.resolve(process.cwd(), '.env');

    let envContent = '';
    try {
      envContent = fs.readFileSync(envPath, 'utf-8');
    } catch {
      envContent = '';
    }

    const updateLine = (key: string, value: string) => {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (envContent.match(regex)) {
        envContent = envContent.replace(regex, `${key}=${value}`);
      } else {
        envContent += `\n${key}=${value}`;
      }
    };

    updateLine('TELEGRAM_BOT_TOKEN', botToken.trim());
    updateLine('TELEGRAM_CHAT_ID', chatId.trim());

    fs.writeFileSync(envPath, envContent.trim() + '\n');

    process.env.TELEGRAM_BOT_TOKEN = botToken.trim();
    process.env.TELEGRAM_CHAT_ID = chatId.trim();

    res.json({
      success: true,
      message: 'Cấu hình Telegram đã được lưu',
      data: {
        botToken: `${botToken.trim().substring(0, 10)}...${botToken.trim().substring(botToken.trim().length - 5)}`,
        chatId: chatId.trim(),
        isConfigured: true,
      },
    });
  } catch (error) {
    console.error('Update Telegram config error:', error);
    res.status(500).json({ success: false, message: 'Không thể lưu cấu hình' });
  }
});

// POST - Gửi tin nhắn test đến Telegram
router.post('/test', async (req: AuthRequest, res: Response) => {
  try {
    const { botToken, chatId } = req.body;

    const token = botToken || process.env.TELEGRAM_BOT_TOKEN;
    const chat = chatId || process.env.TELEGRAM_CHAT_ID;

    if (!token || !chat) {
      res.status(400).json({ success: false, message: 'Bot token và Chat ID bắt buộc' });
      return;
    }

    const fetch = (await import('node-fetch')).default;
    const apiUrl = `https://api.telegram.org/bot${token}`;

    const testMessage = `✅ *Bot đã kết nối thành công!*\n\n🕐 ${new Date().toLocaleString('vi-VN')}\n📋 Nguồn: Sola Admin Panel`;

    const response = await fetch(`${apiUrl}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chat,
        text: testMessage,
        parse_mode: 'Markdown',
      }),
    });

    const data = await response.json() as any;

    if (!response.ok || !data.ok) {
      res.status(400).json({
        success: false,
        message: `Lỗi Telegram: ${data.description || 'Không xác định'}`,
      });
      return;
    }

    res.json({ success: true, message: 'Tin nhắn test đã được gửi thành công!' });
  } catch (error) {
    console.error('Telegram test error:', error);
    res.status(500).json({ success: false, message: 'Không thể gửi tin nhắn test' });
  }
});

// GET - Lấy thông tin bot và danh sách người dùng đã Start bot
// Query param: ?token=<bot_token> (nếu không có dùng token đã lưu)
router.get('/subscribers', async (req: AuthRequest, res: Response) => {
  try {
    const token = (req.query.token as string) || process.env.TELEGRAM_BOT_TOKEN;
    const savedChatId = process.env.TELEGRAM_CHAT_ID;

    if (!token) {
      res.status(400).json({ success: false, message: 'Bot token bắt buộc' });
      return;
    }

    const fetch = (await import('node-fetch')).default;
    const apiUrl = `https://api.telegram.org/bot${token}`;

    // 1. Lấy thông tin bot
    const botInfoRes = await fetch(`${apiUrl}/getMe`, { method: 'GET' });
    const botInfo = await botInfoRes.json() as any;

    if (!botInfoRes.ok || !botInfo.ok) {
      res.status(400).json({ success: false, message: `Lỗi Bot Token: ${botInfo.description || 'Token không hợp lệ'}` });
      return;
    }

    // 2. Lấy danh sách updates để tìm người dùng đã start bot
    const updatesRes = await fetch(`${apiUrl}/getUpdates?limit=100&timeout=0`, { method: 'GET' });
    const updatesData = await updatesRes.json() as any;

    // Map: chat_id -> thông tin người dùng
    const userMap = new Map<string, {
      id: number;
      first_name?: string;
      last_name?: string;
      username?: string;
      type: string;
      firstSeen: string;
      lastSeen: string;
      messageCount: number;
    }>();

    for (const update of (updatesData.result || [])) {
      const msg = update.message;
      if (msg) {
        const chat = msg.chat;
        const from = msg.from;

        if (chat && from) {
          const key = String(chat.id);
          const existing = userMap.get(key);

          const msgTime = new Date(msg.date * 1000).toISOString();

          if (!existing) {
            userMap.set(key, {
              id: chat.id,
              first_name: from.first_name,
              last_name: from.last_name,
              username: from.username,
              type: chat.type,
              firstSeen: msgTime,
              lastSeen: msgTime,
              messageCount: 1,
            });
          } else {
            existing.lastSeen = msgTime;
            existing.messageCount += 1;
          }
        }
      }
    }

    const subscribers = Array.from(userMap.values()).map((u) => ({
      ...u,
      isConfigured: String(u.id) === savedChatId || u.id === Number(savedChatId),
    }));

    // Sắp xếp: người đang được cấu hình lên đầu, sau đó theo lastSeen
    subscribers.sort((a, b) => {
      if (a.isConfigured && !b.isConfigured) return -1;
      if (!a.isConfigured && b.isConfigured) return 1;
      return new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime();
    });

    res.json({
      success: true,
      data: {
        bot: {
          id: botInfo.result.id,
          first_name: botInfo.result.first_name,
          username: botInfo.result.username,
          can_join_groups: botInfo.result.can_join_groups,
          can_read_all_group_messages: botInfo.result.can_read_all_group_messages,
        },
        subscribers,
        total: subscribers.length,
      },
    });
  } catch (error) {
    console.error('Get Telegram subscribers error:', error);
    res.status(500).json({ success: false, message: 'Không thể lấy danh sách người dùng' });
  }
});

export const telegramAdminRoutes = router;
