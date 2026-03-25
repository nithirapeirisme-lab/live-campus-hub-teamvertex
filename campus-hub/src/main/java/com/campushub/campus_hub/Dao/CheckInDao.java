package com.campushub.campus_hub.Dao;

import com.campushub.campus_hub.Entity.CheckInEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CheckInDao extends JpaRepository<CheckInEntity,String> {
    @Query("SELECT c.student_id FROM CheckInEntity c WHERE c.location_id = :locationId " +
            "AND c.checkIn_time = (SELECT MAX(c2.checkIn_time) FROM CheckInEntity c2 WHERE c2.student_id = c.student_id)")
    List<String> findStudentsCurrentlyAtLocation(@Param("locationId") String locationId);
}
