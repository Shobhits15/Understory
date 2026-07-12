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


    @Value("${groq.api.key}")
    private String groqApiKey;

    /**
     * Replies to a user message using gorq cloud . If neither key is configured,
     * returns a helpful message.
     */
    public String reply(String message) {

        if (groqApiKey == null || groqApiKey.isBlank()) {
            return "Groq API key is not configured.";
        }

        return tryGroqReply(message);
    }

    private String tryGroqReply(String message) {

        try {

            RestTemplate rest = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(groqApiKey);

            Map<String, Object> body = new HashMap<>();

            body.put("model", "llama-3.3-70b-versatile");

            List<Map<String, String>> messages = new ArrayList<>();

            Map<String, String> system = new HashMap<>();
            system.put("role", "system");
            system.put("content",
                    "You are Understory AI, a helpful shopping assistant. Help customers find products, answer questions, recommend items, explain features, shipping and orders.");

            messages.add(system);

            Map<String, String> user = new HashMap<>();
            user.put("role", "user");
            user.put("content", message);

            messages.add(user);

            body.put("messages", messages);
            body.put("temperature", 0.7);
            body.put("max_tokens", 512);

            HttpEntity<Map<String, Object>> entity =
                    new HttpEntity<>(body, headers);

            ResponseEntity<Map> response =
                    rest.postForEntity(
                            "https://api.groq.com/openai/v1/chat/completions",
                            entity,
                            Map.class);

            if (response.getBody() != null) {

                List choices = (List) response.getBody().get("choices");

                if (choices != null && !choices.isEmpty()) {

                    Map first = (Map) choices.get(0);

                    Map msg = (Map) first.get("message");

                    return msg.get("content").toString().trim();
                }
            }

            return "No response from Groq.";

        } catch (Exception e) {

            return "Groq Error: " + e.getMessage();

        }
    }
}