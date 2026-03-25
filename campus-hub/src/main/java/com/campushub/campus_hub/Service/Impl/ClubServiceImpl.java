package com.campushub.campus_hub.Service.Impl;

import com.campushub.campus_hub.DTO.ClubDTO;
import com.campushub.campus_hub.Dao.ClubDao;
import com.campushub.campus_hub.Entity.ClubEntity;
import com.campushub.campus_hub.Exceptions.ClubNotFoundException;
import com.campushub.campus_hub.Service.ClubService;
import com.campushub.campus_hub.util.EntityDTOConversion;
import com.campushub.campus_hub.util.UtilityData;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ClubServiceImpl implements ClubService {
    private final ClubDao clubDao;
    private final EntityDTOConversion entityDTOConversion;

    @Override
    public void saveClub(ClubDTO club) {
        club.setClub_id(UtilityData.generateClub_id());
        clubDao.save(entityDTOConversion.toClubEntity(club));


    }

    @Override
    public void updateClub(ClubDTO club) {
        Optional<ClubEntity> foundClub = clubDao.findById(club.getClub_id());
        if(!foundClub.isPresent()){
            throw new ClubNotFoundException("Club not found with Id: "+ club.getClub_id());

        }

        ClubEntity existingClub = foundClub.get();
        existingClub.setClubName(club.getClubName());
        existingClub.setStatus(club.getStatus());

        clubDao.save(existingClub);

    }

    @Override
    public void deleteClub(ClubDTO club) {
        Optional<ClubEntity> foundClub = clubDao.findById(club.getClub_id());
        if(!foundClub.isPresent()){
            throw new ClubNotFoundException("Club not found with the ID: " + club.getClub_id());

        }
        clubDao.deleteById(club.getClub_id());

    }

    @Override
    public void updateClubStatus(String clubId, boolean status) {
        Optional<ClubEntity> foundClub = clubDao.findById(clubId);
        if(!foundClub.isPresent()){
            throw new ClubNotFoundException("Club not found with the ID: " + clubId);
        }
        ClubEntity existingClub = foundClub.get();
        existingClub.setStatus(status);

    }

    @Override
    public List<ClubDTO> getAllClubs() {
        List<ClubEntity> allClubs = clubDao.findAll();
        return entityDTOConversion.toClubDTOList(allClubs);
    }
}
