package com.campushub.campus_hub.Service;

import com.campushub.campus_hub.DTO.CheckInDTO;

import java.util.List;

public interface CheckInService {
    void saveCheckIn(String studentId, String locationId);
    void validateStudent(String studentId);
    void validateLocation(String locationId);
    List<String> getStudentAtLocation(String locationId);
    List<CheckInDTO> getAllCheckIns(String studentId);

}
