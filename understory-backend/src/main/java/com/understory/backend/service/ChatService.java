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
            RestTemplate rest = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = new HashMap<>();

            List<Map<String, Object>> contents = new ArrayList<>();

            Map<String, Object> requestContent = new HashMap<>();

            List<Map<String, String>> requestParts = new ArrayList<>();

            requestParts.add(Map.of(
                    "text",
                    message == null ? "" : message
            ));

            requestContent.put("parts", requestParts);

            contents.add(requestContent);

            body.put("contents", contents);
            String url ="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key="
                            + googleApiKey;
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<String> resp = rest.postForEntity(url, entity, String.class);
            String bodyStr = resp.getBody();
            if (resp.getStatusCode().is2xxSuccessful() && bodyStr != null) {
                try {
                    com.fasterxml.jackson.databind.ObjectMapper om = new com.fasterxml.jackson.databind.ObjectMapper();
                    Map<String, Object> parsed = om.readValue(bodyStr, Map.class);

                    List<Map<String, Object>> candidates =
                            (List<Map<String, Object>>) parsed.get("candidates");

                    if (candidates != null && !candidates.isEmpty()) {

                        Map<String, Object> candidate = candidates.get(0);

                        Map<String, Object> content =
                                (Map<String, Object>) candidate.get("content");

                        List<Map<String, Object>> parts =
                                (List<Map<String, Object>>) content.get("parts");

                        if (parts != null && !parts.isEmpty()) {
                            return parts.get(0).get("text").toString();
                        }
                    }
                } catch (Exception ex) {
                    return "Google parse error: " + ex.getMessage() + " — raw: " + bodyStr;
                }
            } else {
                String status = resp.getStatusCode().toString();
                String msg = (bodyStr == null || bodyStr.isEmpty()) ? "[no body]" : bodyStr;
                return "Google Generative API error: " + status + " — " + msg + "\nCheck API key, model name, and that the Generative API is enabled in GCP.";
            }
        } catch (Exception e) {
            return "Google Generative API exception: " + e.getMessage();
        }
        return null;
    }
}