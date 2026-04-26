package com.campushub.campus_hub.service.impl;

import com.campushub.campus_hub.dto.EventDTO;
import com.campushub.campus_hub.dao.EventDao;
import com.campushub.campus_hub.entity.EventEntity;
import com.campushub.campus_hub.exceptions.EventNotFoundException;
import com.campushub.campus_hub.service.EventService;
import com.campushub.campus_hub.util.EntityDTOConversion;
import com.campushub.campus_hub.util.UtilityData;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {
    private final EventDao eventDao;
    private final EntityDTOConversion entityDTOConversion;

    @Override
    public void saveEvent(EventDTO event) {
        event.setEvent_id(UtilityData.generateEvent_id());
        eventDao.save(entityDTOConversion.toEventEntity(event));

    }

    @Override
    public void updateEvent(String event_Title, EventDTO event) {
        Optional<EventEntity> existingEvent = eventDao.findByEventTitle(event_Title);
        if(!existingEvent.isPresent()) {
            throw new EventNotFoundException("The event not found");
        }
        existingEvent.get().setEventTitle(event.getEventTitle());
        existingEvent.get().setEvent_date(event.getEvent_date());
        existingEvent.get().setEvent_time(event.getEvent_time());
        existingEvent.get().setLocation_name(event.getLocation_name());
        existingEvent.get().setClub_name(event.getClub_name());

    }

    @Override
    public void deleteEvent(String event_Id) {
        if(!eventDao.findById(event_Id).isPresent()) {
            throw new EventNotFoundException("The event not found");
        }
        eventDao.deleteById(event_Id);

    }

    @Override
    public EventDTO searchEvent(String event_Title) {
        if(!eventDao.findByEventTitle(event_Title).isPresent()) {
            throw new EventNotFoundException("The event not found");
        }
        return entityDTOConversion.toEventDTO(eventDao.findByEventTitle(event_Title).get());
    }

    @Override
    public List<EventDTO> getAllEvents() {
        return entityDTOConversion.toEventDTOList(eventDao.findAll());
    }
}
