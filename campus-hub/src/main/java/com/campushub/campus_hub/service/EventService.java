package com.campushub.campus_hub.service;

import com.campushub.campus_hub.dto.EventDTO;

import java.util.List;

public interface EventService {
    void saveEvent(EventDTO event);
    void updateEvent(String event_Id, EventDTO event);
    void deleteEvent(String event_Id);
    EventDTO searchEvent(String event_Title);
    List<EventDTO> getAllEvents();
}
