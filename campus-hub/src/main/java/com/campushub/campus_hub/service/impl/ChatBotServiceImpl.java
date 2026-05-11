package com.campushub.campus_hub.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.ai.chat.client.ChatClient;

@Service
public class ChatBotServiceImpl {

    private final ChatClient chatClient;

    public ChatBotServiceImpl(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public String getResponse(String message) {
        try {
            return chatClient.prompt()
                    .user(message)
                    .call()
                    .content();
        } catch (org.springframework.ai.retry.NonTransientAiException e) {
            return "Google API Error: " + e.getMessage();
        } catch (Exception e) {
            return "System Error: " + e.getMessage();
        }
    }


}
