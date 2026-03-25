package com.campushub.campus_hub.Dao;

import com.campushub.campus_hub.Entity.BusEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BusDao extends JpaRepository<BusEntity,String> {

}
