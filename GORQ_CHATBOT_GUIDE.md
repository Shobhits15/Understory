# Groq Chatbot Integration Guide

## Overview

The Understory application now includes an **AI-powered chatbot** built using **Groq's Cloud API**. This assistant provides real-time customer support and shopping assistance to users browsing the store.

The chatbot is named **"Understory Assistant"** and leverages Groq's high-performance LLaMA 3.3 70B Versatile model to deliver fast, intelligent responses.

---

## Architecture

### Components

#### 1. **Frontend: ChatWidget Component**
**Location:** `understory-frontend/src/components/ChatWidget.jsx`

The ChatWidget is a floating React component that provides:
- **Floating chat bubble** (position: fixed, bottom-right corner)
- **Collapsible chat window** with message history
- **Dual mode support:**
  - **Demo Mode**: Uses mock responses (no API required)
  - **Live Mode**: Connects to the backend Groq API

**Features:**
- Auto-scrolling message display
- Loading indicators during API calls
- Error handling and user feedback
- Real-time message exchange
- Keyboard support (Enter to send)

#### 2. **Backend: Chat Service (Java Spring Boot)**

**Files:**
- `ChatController.java` - REST endpoint handler
- `ChatService.java` - Business logic & Groq API integration
- `ChatRequest.java` - Request DTO
- `ChatResponse.java` - Response DTO

**Endpoint:** `POST /api/chat`

---

## How It Works

### Frontend Flow

```
User Input
    ↓
ChatWidget captures message
    ↓
Demo Mode? 
├─ YES → cannedReply() → Display mock response
└─ NO → fetch POST /api/chat
         ↓
    Wait for backend response
    ↓
    Display reply or error
```

### Backend Flow

```
Request arrives at ChatController
    ↓
ChatService.reply(message)
    ↓
Check Groq API key configured?
├─ NO  → Return "API key not configured"
└─ YES → Build request payload
         ↓
    Create system + user messages
    ↓
    Call Groq API (https://api.groq.com/openai/v1/chat/completions)
    ↓
    Parse response
    ↓
    Return message content to frontend
```

---

## API Integration Details

### Groq API Request Format

```java
POST https://api.groq.com/openai/v1/chat/completions

Headers:
  Content-Type: application/json
  Authorization: Bearer {GROQ_API_KEY}

Body:
{
  "model": "llama-3.3-70b-versatile",
  "messages": [
    {
      "role": "system",
      "content": "You are Understory AI, a helpful shopping assistant..."
    },
    {
      "role": "user",
      "content": "{user_message}"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 512
}
```

### System Prompt

```
"You are Understory AI, a helpful shopping assistant. 
Help customers find products, answer questions, recommend items, 
explain features, shipping and orders."
```

### Response Handling

```
Response Body:
{
  "choices": [
    {
      "message": {
        "content": "AI response text here..."
      }
    }
  ]
}

→ Extract: response.choices[0].message.content
```

---

## Configuration

### Environment Variables

**Backend (Java):**

Add to `application.properties` or set as environment variable:

```properties
groq.api.key=YOUR_GROQ_API_KEY
```

**Frontend (React):**

Uses `API_BASE` from client configuration:
```javascript
// understory-frontend/src/api/client.js
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';
```

### Groq API Setup

1. Visit: https://console.groq.com
2. Create an account or sign in
3. Navigate to API Keys
4. Generate a new API key
5. Copy the key to your environment configuration
6. **Security Note:** Never commit API keys to version control

---

## Features

### Demo Mode
- **Purpose:** Test chat UI without API configuration
- **Behavior:** Provides canned responses based on keywords
- **Mock Responses:**
  - "image" / "photo" → Image loading help
  - "cart" → Cart usage instructions
  - "hello" / "hi" → Welcome message
  - Default → Generic mock response

### Live Mode
- **Purpose:** Real AI responses via Groq
- **Requires:** Valid GROQ_API_KEY environment variable
- **Behavior:** Sends messages to backend → Groq API → Response displayed

### Error Handling
- **Missing API Key:** User sees helpful error message
- **Network Errors:** Displayed in chat interface
- **API Errors:** Server status and error details shown
- **Connection Issues:** Fallback error messages provided

---

## Frontend Integration

### Usage in App

**File:** `understory-frontend/src/App.jsx`

```javascript
import ChatWidget from "./components/ChatWidget";

export default function App() {
  // ... component logic ...
  return (
    <div>
      {/* Other components */}
      <ChatWidget />
    </div>
  );
}
```

The ChatWidget is automatically rendered as a floating component on every page.

### UI Components

**Chat Bubble Button:**
- Dark background (#0F172A)
- White text with emoji (💬)
- Positioned fixed at bottom-right (16px margins)
- Box shadow for depth

**Chat Window:**
- Width: 320px (responsive to mobile)
- Height: 460px
- Messages styled with different colors:
  - Bot: Light gray (#F3F4F6) with dark text
  - User: Dark background (#0F172A) with white text

---

## Message Handling

### User Message Flow

```
1. User types in input field
2. Press Enter or click Send
3. Message appended to chat history
4. Input cleared
5. Loading state activated
6. Request sent to /api/chat
7. Placeholder message shown ("…")
8. Wait for response
9. Placeholder removed
10. Response appended to history
```

### Response Parsing

```javascript
// Frontend receives:
{ reply: "AI generated response text" }

// Displayed in chat bubble as:
<div style={{...}}>AI generated response text</div>
```

---

## Model Configuration

### Groq Model: llama-3.3-70b-versatile

**Specifications:**
- **Model ID:** llama-3.3-70b-versatile
- **Provider:** Groq Cloud
- **Parameters:** 70 billion
- **Type:** Open-source LLaMA 3.3 variant
- **Optimized For:** Fast inference + quality responses

**Parameters Used:**
- `temperature: 0.7` - Balanced creativity vs accuracy
- `max_tokens: 512` - Response length limit
- `model: "llama-3.3-70b-versatile"` - Specific model version

---

## Error Scenarios & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Groq API key is not configured" | Missing environment variable | Set `groq.api.key` in properties |
| "Groq Error: ..." | API call failed | Check API key validity, network connectivity |
| "Network error: ..." | Frontend can't reach backend | Verify backend is running, CORS configured |
| Empty reply | Response parsing failed | Check Groq API response format |
| Request timeout | API takes too long | Increase timeout or check API status |

---

## Performance Metrics

### Response Times
- **Demo Mode:** ~600-1300ms (simulated delay)
- **Live Mode:** ~1-3 seconds (depends on Groq API)
- **Max Response Length:** 512 tokens (~200 words)

### Rate Limiting
- Groq API has rate limits (check documentation)
- Recommended: Implement request throttling if high volume
- Current: No built-in throttling (frontend sends immediately)

---

## Security Considerations

### API Key Protection
✅ **Good Practices:**
- Store API key in environment variables (never in code)
- Use `.env` files (not committed to git)
- Rotate keys periodically
- Use different keys for dev/prod

❌ **Avoid:**
- Exposing API key in frontend code
- Committing keys to version control
- Using same key across environments

### Input Sanitization
- Frontend: No HTML injection (pre-wrap text, plain text display)
- Backend: Uses RestTemplate (no injection vulnerabilities)
- Groq API: Treats input as plain text

### CORS Configuration
**File:** `com/understory/backend/config/CorsConfig.java`

Ensure CORS is properly configured to accept chat requests from frontend domain.

---

## Deployment Checklist

- [ ] Groq API key obtained and tested
- [ ] Backend environment variable `groq.api.key` configured
- [ ] Frontend `API_BASE` or backend URL properly set
- [ ] Backend running and accessible from frontend
- [ ] CORS properly configured
- [ ] ChatWidget imported in App.jsx
- [ ] Test demo mode (no API key needed)
- [ ] Test live mode (with API key)
- [ ] Error scenarios tested
- [ ] Response times within acceptable range

---

## Future Enhancements

### Possible Improvements

1. **Conversation History**
   - Store chat sessions per user
   - Load previous conversations
   - Multi-turn context improvement

2. **Advanced Features**
   - File uploads (product images)
   - Real-time product recommendations
   - Order status queries
   - User profile integration

3. **Performance**
   - Message caching
   - Request deduplication
   - Streaming responses

4. **Analytics**
   - Track common questions
   - Chat sentiment analysis
   - User satisfaction metrics

5. **Multiple AI Models**
   - Fall back to alternative models
   - User model preference selection
   - Cost optimization

---

## Troubleshooting

### Chat Not Appearing
- Check if `<ChatWidget />` is imported in App.jsx
- Verify component is rendering (browser console)
- Check for CSS conflicts (z-index issues)

### Live Mode Not Working
- Verify `groq.api.key` is set in environment
- Check backend is running (`http://localhost:8080/api/health`)
- Test API key with curl:
  ```bash
  curl -X POST https://api.groq.com/openai/v1/chat/completions \
    -H "Authorization: Bearer YOUR_KEY" \
    -H "Content-Type: application/json" \
    -d '{"model":"llama-3.3-70b-versatile","messages":[{"role":"user","content":"Hi"}]}'
  ```

### Slow Responses
- Check Groq API status (https://status.groq.com)
- Monitor network latency
- Verify backend performance
- Consider using different model or adjusting `max_tokens`

### CORS Errors
- Check backend CORS configuration
- Ensure frontend URL is whitelisted
- Test with preflight requests enabled

---

## References

- **Groq API Documentation:** https://console.groq.com/docs
- **LLaMA 3.3 Model:** https://llama.meta.com/
- **React Documentation:** https://react.dev
- **Spring Boot Documentation:** https://spring.io/projects/spring-boot

---

## Support

For issues or questions:
1. Check error messages in browser console
2. Review backend logs for API errors
3. Verify environment configuration
4. Test with curl/Postman for API connectivity
5. Refer to Groq documentation for API-specific issues

---

**Last Updated:** 2025
**Version:** 1.0
**Status:** Active ✅
