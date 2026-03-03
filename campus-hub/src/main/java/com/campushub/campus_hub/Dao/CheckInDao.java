package com.campushub.campus_hub.Dao;

import com.campushub.campus_hub.Entity.CheckInEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CheckInDao extends JpaRepository<CheckInEntity,String> {
}
