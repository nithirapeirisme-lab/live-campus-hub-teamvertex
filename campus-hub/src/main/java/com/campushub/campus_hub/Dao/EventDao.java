package com.campushub.campus_hub.Dao;

import com.campushub.campus_hub.Entity.EventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventDao extends JpaRepository<EventEntity,String> {
}
