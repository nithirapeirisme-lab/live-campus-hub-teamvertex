package com.campushub.campus_hub.service;

import com.campushub.campus_hub.dto.ClubDTO;

import java.util.List;

public interface ClubService {
    void saveClub(ClubDTO clubDTO);
    void updateClub(ClubDTO club);
    void deleteClub(String clubId);
    void updateClubStatus(String clubId, boolean status);
    List<ClubDTO> getAllClubs();


}
