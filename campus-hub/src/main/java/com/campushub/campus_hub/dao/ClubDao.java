package com.campushub.campus_hub.dao;

import com.campushub.campus_hub.entity.ClubEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClubDao extends JpaRepository<ClubEntity,String> {
    Boolean existsByClubName(String clubName);

}
