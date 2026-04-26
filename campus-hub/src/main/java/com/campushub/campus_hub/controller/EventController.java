package com.campushub.campus_hub.controller;

import com.campushub.campus_hub.dto.EventDTO;
import com.campushub.campus_hub.dao.EventDao;
import com.campushub.campus_hub.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EventController {
    private final EventService eventService;
    private final EventDao eventDao;

    @PostMapping
    public ResponseEntity<String> saveEvent(@RequestBody EventDTO eventDTO){
        eventService.saveEvent(eventDTO);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public ResponseEntity<List<EventDTO>> getEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @PutMapping("/name/{eventName}")
    public ResponseEntity<Void> updateEvent(@PathVariable String eventName, @RequestBody EventDTO eventDTO){
        eventService.updateEvent(eventName, eventDTO);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable String id){
        eventService.deleteEvent(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("/search")
    public ResponseEntity<EventDTO> getEventByTitle(@RequestParam String title) {
        return ResponseEntity.ok(eventService.searchEvent(title));
    }
}
