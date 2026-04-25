package com.campushub.campus_hub.dao;

import com.campushub.campus_hub.entity.BusEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BusDao extends JpaRepository<BusEntity,String> {
    boolean existsByBusNumber(String busNumber);

}
