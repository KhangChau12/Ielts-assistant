# Supabase Email Configuration Guide

## Bật Email Verification

### Bước 1: Enable Email Confirmation

1. Đi tới Supabase Dashboard → Authentication → Settings
2. Scroll xuống phần **Email Auth**
3. Tìm **"Enable email confirmations"**
4. **BẬT** toggle này lên

### Bước 2: Customize Email Templates

#### A. Confirm Signup Email Template

1. Đi tới Supabase Dashboard → Authentication → Email Templates
2. Chọn **"Confirm signup"** template
3. Thay thế nội dung bằng template sau:

```html
<h2>Welcome to IELTS Assistant! 🎓</h2>

<p>Hi there,</p>

<p>Thanks for signing up for <strong>IELTS Assistant</strong> - your AI-powered IELTS Writing coach!</p>

<p>To get started and activate your account, please verify your email address by clicking the button below:</p>

<p style="text-align: center; margin: 30px 0;">
  <a
    href="{{ .ConfirmationURL }}"
    style="background: linear-gradient(to right, #06b6d4, #0284c7); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;"
  >
    Verify Email Address
  </a>
</p>

<p>Or copy and paste this link into your browser:</p>
<p style="color: #0369a1; word-break: break-all;">{{ .ConfirmationURL }}</p>

<hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">

<h3>What's next after verification?</h3>
<ul>
  <li>✍️ Submit your IELTS Writing Task 2 essays</li>
  <li>📊 Get instant AI-powered band scores (0-9)</li>
  <li>📈 Track your progress with detailed analytics</li>
  <li>📚 Enhance vocabulary with C1-C2 level suggestions</li>
  <li>🎴 Learn with interactive flashcards and quizzes</li>
</ul>

<p>If you didn't create an account with IELTS Assistant, you can safely ignore this email.</p>

<p>Happy writing!<br>
The IELTS Assistant Team</p>

<hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
<p style="font-size: 12px; color: #64748b;">
  This is an automated email from IELTS Assistant. Please do not reply to this email.
</p>
```

#### B. Reset Password Email Template

1. Chọn **"Reset password"** template
2. Thay thế nội dung:

```html
<h2>Reset Your IELTS Assistant Password 🔐</h2>

<p>Hi there,</p>

<p>We received a request to reset the password for your <strong>IELTS Assistant</strong> account.</p>

<p>Click the button below to create a new password:</p>

<p style="text-align: center; margin: 30px 0;">
  <a
    href="{{ .ConfirmationURL }}"
    style="background: linear-gradient(to right, #06b6d4, #0284c7); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;"
  >
    Reset Password
  </a>
</p>

<p>Or copy and paste this link into your browser:</p>
<p style="color: #0369a1; word-break: break-all;">{{ .ConfirmationURL }}</p>

<p><strong>⚠️ This link will expire in 1 hour for security reasons.</strong></p>

<p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>

<p>Best regards,<br>
The IELTS Assistant Team</p>

<hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
<p style="font-size: 12px; color: #64748b;">
  This is an automated email from IELTS Assistant. Please do not reply to this email.
</p>
```

#### C. Magic Link Email Template

1. Chọn **"Magic Link"** template
2. Thay thế nội dung:

```html
<h2>Sign in to IELTS Assistant 🔗</h2>

<p>Hi there,</p>

<p>Click the button below to sign in to your <strong>IELTS Assistant</strong> account:</p>

<p style="text-align: center; margin: 30px 0;">
  <a
    href="{{ .ConfirmationURL }}"
    style="background: linear-gradient(to right, #06b6d4, #0284c7); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;"
  >
    Sign In
  </a>
</p>

<p>Or copy and paste this link into your browser:</p>
<p style="color: #0369a1; word-break: break-all;">{{ .ConfirmationURL }}</p>

<p><strong>⚠️ This link will expire in 1 hour for security reasons.</strong></p>

<p>If you didn't request this sign-in link, you can safely ignore this email.</p>

<p>Happy writing!<br>
The IELTS Assistant Team</p>

<hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
<p style="font-size: 12px; color: #64748b;">
  This is an automated email from IELTS Assistant. Please do not reply to this email.
</p>
```

### Bước 3: Customize Email Settings

1. Scroll lên phần **"SMTP Settings"**
2. Mặc định Supabase dùng email của họ, nhưng bạn có thể:
   - **Option 1**: Giữ nguyên (sender sẽ là `noreply@mail.app.supabase.io`)
   - **Option 2**: Cấu hình SMTP server riêng của bạn (Gmail, SendGrid, etc.)

#### Để customize sender name (không cần SMTP):

Không thể đổi sender email với Supabase free tier, nhưng email templates ở trên đã rõ ràng là từ **IELTS Assistant**.

### Bước 4: Customize Redirect URLs

1. Đi tới Authentication → URL Configuration
2. Thêm redirect URLs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://your-domain.com/auth/callback` (production)

3. Trong **"Site URL"**, đặt:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`

---

## Testing Email Verification

### Test Flow:

1. Đăng ký tài khoản mới tại `/register`
2. Nhập email và password
3. Sau khi submit, bạn sẽ thấy màn hình **"Check Your Email"**
4. Mở email (kiểm tra spam folder nếu không thấy)
5. Click vào button **"Verify Email Address"** (màu xanh cyan-blue gradient)
6. Sẽ redirect về `/auth/callback`
7. Profile sẽ được tạo tự động
8. Redirect tiếp về `/dashboard`
9. Bạn đã đăng nhập thành công!

---

## Troubleshooting

### Email không gửi đi

**Giải pháp:**
1. Kiểm tra Supabase Dashboard → Authentication → Settings
2. Đảm bảo "Enable email confirmations" đã BẬT
3. Kiểm tra email có trong spam folder không
4. Với Supabase free tier, có rate limit 3-4 emails/hour cho mỗi địa chỉ

### Callback URL không hoạt động

**Giải pháp:**
1. Kiểm tra URL Configuration trong Supabase có đúng không
2. Đảm bảo file `app/auth/callback/route.ts` đã tồn tại
3. Restart development server
4. Clear browser cookies

### Email bị đánh dấu là spam

**Giải pháp:**
1. Đây là vấn đề phổ biến với Supabase free tier
2. Nói với users check spam folder
3. Add `noreply@mail.app.supabase.io` vào whitelist
4. Upgrade lên custom SMTP (paid option)

---

## Development Mode (Disable Email Confirmation)

Nếu muốn **TẮT email verification** trong development:

1. Supabase Dashboard → Authentication → Settings
2. **TẮT** "Enable email confirmations"
3. Users sẽ được tạo và đăng nhập ngay lập tức
4. **LƯU Ý**: Nhớ BẬT lại khi deploy production!

---

## Email Template Variables

Các biến có sẵn trong email templates:

- `{{ .Email }}` - Email của user
- `{{ .ConfirmationURL }}` - Link verification/reset password
- `{{ .Token }}` - Token (nếu cần)
- `{{ .TokenHash }}` - Token hash
- `{{ .SiteURL }}` - URL của app
- `{{ .RedirectTo }}` - Redirect URL

---

## Production Checklist

Trước khi deploy production:

- [ ] Email confirmation đã BẬT
- [ ] Email templates đã customize với branding IELTS Assistant
- [ ] Redirect URLs đã set đúng cho production domain
- [ ] Site URL đã set đúng
- [ ] Test toàn bộ flow: register → verify → login
- [ ] Email không bị vào spam (test với nhiều email providers)

---

## Custom SMTP Setup (Optional)

Nếu muốn dùng email domain riêng (ví dụ: `noreply@ieltsassistant.com`):

### Với Gmail:

1. Supabase Dashboard → Authentication → Settings → SMTP
2. Enable Custom SMTP
3. Điền thông tin:
   ```
   Host: smtp.gmail.com
   Port: 587
   Username: your-email@gmail.com
   Password: [App Password - tạo trong Gmail Security]
   Sender email: your-email@gmail.com
   Sender name: IELTS Assistant
   ```

### Với SendGrid (Recommended for Production):

1. Tạo account tại sendgrid.com
2. Verify domain của bạn
3. Tạo API key
4. Điền vào Supabase:
   ```
   Host: smtp.sendgrid.net
   Port: 587
   Username: apikey
   Password: [Your SendGrid API Key]
   Sender email: noreply@yourdomain.com
   Sender name: IELTS Assistant
   ```

---

**Email setup hoàn tất! Users giờ sẽ nhận được emails đẹp và rõ ràng từ IELTS Assistant! 📧✨**
