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
        event.setEvent_date(UtilityData.generateTodayDate());
        event.setEvent_time(LocalTime.now(ZoneOffset.UTC));

        eventDao.save(entityDTOConversion.toEventEntity(event));

    }

    @Override
    public void updateEvent(String event_Id, EventDTO event) {
        Optional<EventEntity> existingEvent = eventDao.findById(event_Id);
        if(!existingEvent.isPresent()) {
            throw new EventNotFoundException("The event not found");
        }
        existingEvent.get().setEventTitle(event.getEventTitle());
        existingEvent.get().setEvent_date(UtilityData.generateTodayDate());
        existingEvent.get().setEvent_time(LocalTime.now(ZoneOffset.UTC));
        existingEvent.get().setLocation_id(event.getLocation_id());
        existingEvent.get().setClub_id(event.getClub_id());

    }

    @Override
    public void deleteEvent(String event_Id) {
        if(!eventDao.findById(event_Id).isPresent()) {
            throw new EventNotFoundException("The event not found");
        }
        eventDao.deleteById(event_Id);

    }

    @Override
    public List<EventDTO> getAllEvents() {
        return entityDTOConversion.toEventDTOList(eventDao.findAll());
    }
}
