# Rate Limiting Implementation

## Overview

The application now includes rate limiting to prevent abuse and protect API resources. Rate limiting is implemented using **Upstash Redis** with sliding window algorithm.

## Configuration

### Environment Variables

Add to your `.env.local`:

```bash
# Optional - if not configured, rate limiting will be disabled
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

### Get Upstash Credentials

1. Sign up at [upstash.com](https://upstash.com/)
2. Create a new Redis database
3. Copy the REST URL and Token from the dashboard
4. Add to your `.env.local`

## Rate Limits

### Essay Submission
- **Limit**: 5 requests per hour
- **Purpose**: Prevent AI abuse, manage costs
- **Identifier**: User ID (authenticated) or fingerprint (guest)

### Vocabulary Generation
- **Limit**: 10 requests per hour
- **Purpose**: Prevent excessive AI calls
- **Identifier**: User ID

### General API Calls
- **Limit**: 30 requests per minute
- **Purpose**: DDoS protection
- **Identifier**: IP address or user ID

## How It Works

### Sliding Window Algorithm

```typescript
Ratelimit.slidingWindow(5, '1 h')
// Allows 5 requests within any 1-hour window
// More accurate than fixed window
```

### Response Headers

When rate limited, the response includes:

```
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1640995200
```

### Error Response

```json
{
  "error": "Too many requests. Please try again later.",
  "limit": 5,
  "remaining": 0,
  "reset": 1640995200
}
```

## Development vs Production

### Development
- Rate limiting is **optional** in development
- If Redis not configured, requests are allowed
- Warning logged: `[Rate Limit] Upstash Redis not configured - rate limiting disabled`

### Production
- **Highly recommended** to configure Redis
- Protects against abuse and DDoS
- Helps manage AI API costs

## Implementation Details

### File Structure

```
lib/
  rate-limit.ts          # Rate limiting utilities
  logger.ts              # Logging (no console.log in production)

app/api/
  essays/submit/
    route.ts             # Essay API with rate limiting
```

### Usage Example

```typescript
import { rateLimiters, checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  // Get identifier (user ID, fingerprint, or IP)
  const identifier = user?.id || fingerprint || 'anonymous'
  
  // Check rate limit
  const rateLimitResult = await checkRateLimit(
    identifier, 
    rateLimiters.essays()
  )
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { 
        error: 'Too many requests. Please try again later.',
        remaining: rateLimitResult.remaining,
        reset: rateLimitResult.reset
      },
      { status: 429 }
    )
  }
  
  // Process request...
}
```

## Monitoring

### Upstash Dashboard
- View request count
- See rate limit hits
- Monitor Redis usage
- Analytics enabled by default

### Application Logs
```typescript
logger.warn('Rate limit exceeded:', {
  identifier,
  limit: result.limit,
  reset: result.reset
})
```

## Adjusting Limits

Edit `lib/rate-limit.ts`:

```typescript
// Make essay limit stricter
limiter: Ratelimit.slidingWindow(3, '1 h'),  // 3 per hour

// Make it more lenient
limiter: Ratelimit.slidingWindow(10, '1 h'),  // 10 per hour
```

## Testing

### Test Rate Limit

```bash
# Submit essays rapidly to trigger rate limit
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/essays/submit \
    -H "Content-Type: application/json" \
    -d '{"prompt":"test","essay_content":"test content"}'
done
```

### Check Response

```json
// 6th request returns:
{
  "error": "Too many requests. Please try again later.",
  "limit": 5,
  "remaining": 0,
  "reset": 1640995200  // Unix timestamp
}
```

## Best Practices

1. **Use appropriate identifiers**
   - User ID for authenticated users
   - Fingerprint for guests
   - IP address as fallback

2. **Set realistic limits**
   - Consider user experience
   - Balance with API costs
   - Monitor and adjust

3. **Graceful degradation**
   - Allow requests if Redis is down
   - Log errors but don't block users
   - Have fallback mechanisms

4. **Clear error messages**
   - Tell users when to try again
   - Show remaining quota
   - Suggest alternatives (sign up, wait)

## Troubleshooting

### Rate limiting not working
- Check Redis credentials in `.env.local`
- Verify Upstash dashboard shows connections
- Look for warnings in logs

### Too many false positives
- Adjust time window (increase from 1h to 2h)
- Increase limit count
- Check identifier logic (might be too broad)

### Redis connection errors
- Verify Upstash database is active
- Check network connectivity
- Ensure correct region selected

---

**Implementation Date**: January 2025
**Dependencies**: `@upstash/ratelimit`, `@upstash/redis`
