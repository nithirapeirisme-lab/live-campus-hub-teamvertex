package com.campushub.campus_hub.Service;

import com.campushub.campus_hub.DTO.EventDTO;

import java.util.List;

public interface EventService {
    void saveEvent(EventDTO event);
    void updateEvent(String event_Id, EventDTO event);
    void deleteEvent(String event_Id);
    List<EventDTO> getAllEvents();
}
