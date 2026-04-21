import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../../middleware/index.js';

const router = Router();

router.use(authMiddleware);

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

function parseChatIds(raw?: string): string[] {
  if (!raw) return [];
  return raw.split(',').map(id => id.trim()).filter(Boolean);
}

const getChatIds = (): string[] => {
  return parseChatIds(process.env.TELEGRAM_CHAT_IDS || process.env.TELEGRAM_CHAT_ID);
};

// GET - Lấy thông tin cấu hình Telegram hiện tại
router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const chatIds = getChatIds();
    res.json({
      success: true,
      data: {
        botToken: BOT_TOKEN ? `${BOT_TOKEN.substring(0, 10)}...${BOT_TOKEN.substring(BOT_TOKEN.length - 5)}` : '',
        botTokenRaw: BOT_TOKEN,
        chatIds,
        chatIdsRaw: chatIds.join(', '),
        isConfigured: !!(BOT_TOKEN && chatIds.length > 0),
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
    const { botToken, chatIds: chatIdsInput } = req.body;

    if (!botToken || !chatIdsInput) {
      res.status(400).json({ success: false, message: 'Bot token và Chat ID (ít nhất 1) bắt buộc' });
      return;
    }

    // chatIdsInput có thể là string (comma-separated) hoặc array
    const chatIdsRaw = Array.isArray(chatIdsInput)
      ? chatIdsInput.join(',')
      : chatIdsInput;

    const chatIds = parseChatIds(chatIdsRaw);

    if (chatIds.length === 0) {
      res.status(400).json({ success: false, message: 'Phải có ít nhất 1 Chat ID hợp lệ' });
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

    // Xóa TELEGRAM_CHAT_ID cũ nếu có
    const removeLine = (key: string) => {
      const regex = new RegExp(`^${key}=.*$\n?`, 'm');
      envContent = envContent.replace(regex, '');
    };

    updateLine('TELEGRAM_BOT_TOKEN', botToken.trim());
    removeLine('TELEGRAM_CHAT_ID');
    updateLine('TELEGRAM_CHAT_IDS', chatIdsRaw.trim());

    fs.writeFileSync(envPath, envContent.trim() + '\n');

    process.env.TELEGRAM_BOT_TOKEN = botToken.trim();
    process.env.TELEGRAM_CHAT_IDS = chatIdsRaw.trim();
    delete process.env.TELEGRAM_CHAT_ID;

    res.json({
      success: true,
      message: 'Cấu hình Telegram đã được lưu',
      data: {
        botToken: `${botToken.trim().substring(0, 10)}...${botToken.trim().substring(botToken.trim().length - 5)}`,
        chatIds,
        chatIdsRaw: chatIds.join(', '),
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
    const { botToken, chatId, chatIds: chatIdsInput } = req.body;

    const token = botToken || process.env.TELEGRAM_BOT_TOKEN;

    let targets: string[] = [];
    if (chatIdsInput) {
      const raw = Array.isArray(chatIdsInput) ? chatIdsInput.join(',') : chatIdsInput;
      targets = parseChatIds(raw);
    } else if (chatId) {
      targets = [chatId];
    } else {
      targets = getChatIds();
    }

    if (!token || targets.length === 0) {
      res.status(400).json({ success: false, message: 'Bot token và Chat ID bắt buộc' });
      return;
    }

    const fetch = (await import('node-fetch')).default;
    const apiUrl = `https://api.telegram.org/bot${token}`;

    const testMessage = `✅ *Bot đã kết nối thành công!*\n\n🕐 ${new Date().toLocaleString('vi-VN')}\n📋 Nguồn: Sola Admin Panel`;

    const results = await Promise.allSettled(
      targets.map(chat =>
        fetch(`${apiUrl}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chat,
            text: testMessage,
            parse_mode: 'Markdown',
          }),
        })
      )
    );

    const failures = results.filter(
      r => r.status === 'rejected' || !((r as PromiseFulfilledResult<unknown>).value as { ok?: boolean }).ok
    );

    if (failures.length === targets.length) {
      res.status(400).json({ success: false, message: 'Tất cả tin nhắn đều gửi thất bại' });
      return;
    }

    const sent = targets.length - failures.length;
    res.json({
      success: true,
      message: failures.length === 0
        ? `Tin nhắn test đã được gửi thành công đến ${sent} người nhận!`
        : `Đã gửi đến ${sent}/${targets.length} người nhận`
    });
  } catch (error) {
    console.error('Telegram test error:', error);
    res.status(500).json({ success: false, message: 'Không thể gửi tin nhắn test' });
  }
});

// GET - Lấy thông tin bot và danh sách người dùng đã Start bot
router.get('/subscribers', async (req: AuthRequest, res: Response) => {
  try {
    const token = (req.query.token as string) || process.env.TELEGRAM_BOT_TOKEN;
    const savedChatIds = getChatIds();

    if (!token) {
      res.status(400).json({ success: false, message: 'Bot token bắt buộc' });
      return;
    }

    const fetch = (await import('node-fetch')).default;
    const apiUrl = `https://api.telegram.org/bot${token}`;

    const botInfoRes = await fetch(`${apiUrl}/getMe`, { method: 'GET' });
    const botInfo = await botInfoRes.json() as any;

    if (!botInfoRes.ok || !botInfo.ok) {
      res.status(400).json({ success: false, message: `Lỗi Bot Token: ${botInfo.description || 'Token không hợp lệ'}` });
      return;
    }

    const updatesRes = await fetch(`${apiUrl}/getUpdates?limit=100&timeout=0`, { method: 'GET' });
    const updatesData = await updatesRes.json() as any;

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
      isConfigured: savedChatIds.includes(String(u.id)),
    }));

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
