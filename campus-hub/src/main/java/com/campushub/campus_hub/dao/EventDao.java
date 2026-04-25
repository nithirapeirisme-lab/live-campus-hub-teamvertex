package com.campushub.campus_hub.dao;

import com.campushub.campus_hub.entity.EventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventDao extends JpaRepository<EventEntity,String> {
    Optional<EventEntity> findByEventTitle(String eventTitle);
}
