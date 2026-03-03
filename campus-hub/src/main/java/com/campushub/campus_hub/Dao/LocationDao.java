package com.campushub.campus_hub.Dao;

import com.campushub.campus_hub.Entity.LocationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationDao extends JpaRepository<LocationEntity,String> {
}
