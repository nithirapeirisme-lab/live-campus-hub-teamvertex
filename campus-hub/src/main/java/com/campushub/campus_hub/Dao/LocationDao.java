package com.campushub.campus_hub.Dao;

import com.campushub.campus_hub.Entity.LocationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationDao extends JpaRepository<LocationEntity,String> {
}
