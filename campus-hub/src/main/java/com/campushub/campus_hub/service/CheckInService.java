package com.campushub.campus_hub.service;

import com.campushub.campus_hub.dto.CheckInDTO;

import java.util.List;

public interface CheckInService {
    void saveCheckIn(String studentId, String locationId);
    void validateStudent(String studentId);
    void validateLocation(String locationId);
    List<String> getStudentAtLocation(String locationId);
    List<CheckInDTO> getAllCheckIns(String studentId);

}
