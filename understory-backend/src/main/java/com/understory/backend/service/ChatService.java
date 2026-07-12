package com.understory.backend.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.Client;


@Service
public class ChatService {

    @Value("${OPENAI_API_KEY:}")
    private String openaiApiKey;

    @Value("${GOOGLE_API_KEY:}")
    private String googleApiKey;

    /**
     * Replies to a user message using either Google Generative API (if GOOGLE_API_KEY
     * is set) or OpenAI (if OPENAI_API_KEY is set). If neither key is configured,
     * returns a helpful message.
     */
    public String reply(String message) {
        if ((googleApiKey == null || googleApiKey.isEmpty()) && (openaiApiKey == null || openaiApiKey.isEmpty())) {
            return "No generative AI key configured on server. Set OPENAI_API_KEY or GOOGLE_API_KEY in environment to enable the chatbot.";
        }

        // Prefer Google if available
        if (googleApiKey != null && !googleApiKey.isEmpty()) {
            String g = tryGoogleReply(message);
            if (g != null) return g;
        }

        // Fallback to OpenAI
        if (openaiApiKey != null && !openaiApiKey.isEmpty()) {
            String o = tryOpenAIReply(message);
            if (o != null) return o;
        }

        return "No response from generative provider";
    }

    private String tryOpenAIReply(String message) {
        try {
            RestTemplate rest = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openaiApiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("model", "gpt-3.5-turbo");

            List<Map<String, String>> messages = new ArrayList<>();
            Map<String, String> userMsg = new HashMap<>();
            userMsg.put("role", "user");
            userMsg.put("content", message == null ? "" : message);
            messages.add(userMsg);

            body.put("messages", messages);
            body.put("max_tokens", 300);
            body.put("temperature", 0.7);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> resp = rest.postForEntity("https://api.openai.com/v1/chat/completions", entity, Map.class);
            if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null) {
                Object choicesObj = resp.getBody().get("choices");
                if (choicesObj instanceof List) {
                    List choices = (List) choicesObj;
                    if (!choices.isEmpty()) {
                        Object first = choices.get(0);
                        if (first instanceof Map) {
                            Object messageObj = ((Map) first).get("message");
                            if (messageObj instanceof Map) {
                                Object content = ((Map) messageObj).get("content");
                                if (content != null) return content.toString().trim();
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            return "OpenAI error: " + e.getMessage();
        }
        return null;
    }


    private String tryGoogleReply(String message) {

        try {

            Client client = Client.builder()
                    .apiKey(googleApiKey)
                    .build();

            GenerateContentResponse response =
                    client.models.generateContent(
                            "gemini-2.5-flash",
                            message,
                            null
                    );

            return response.text();

        } catch (Exception e) {
            return "Gemini Error: " + e.getMessage();
        }

    }
}