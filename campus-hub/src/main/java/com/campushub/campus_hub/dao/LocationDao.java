package com.campushub.campus_hub.dao;

import com.campushub.campus_hub.entity.LocationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationDao extends JpaRepository<LocationEntity,String> {
    boolean existsByLocationName(String locationName);
}
