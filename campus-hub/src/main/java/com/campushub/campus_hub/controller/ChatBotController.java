package com.campushub.campus_hub.controller;


import com.campushub.campus_hub.service.impl.ChatBotServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/chatbot")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatBotController {

    private final ChatBotServiceImpl chatBotServiceimpl;

    @GetMapping("/ask")
    public Map<String, String> ask(@RequestParam String message) {
        try {
            String response = chatBotServiceimpl.getResponse(message);
            return Map.of("answer", response);
        } catch (Exception e) {
            return Map.of("error", "The bot is resting right now. Details: " + e.getMessage());
        }
    }
}