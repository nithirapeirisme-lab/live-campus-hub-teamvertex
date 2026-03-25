package com.campushub.campus_hub.Service.Impl;

import com.campushub.campus_hub.DTO.CheckInDTO;
import com.campushub.campus_hub.Dao.CheckInDao;
import com.campushub.campus_hub.Dao.LocationDao;
import com.campushub.campus_hub.Dao.StudentDao;
import com.campushub.campus_hub.util.UtilityData;
import com.campushub.campus_hub.Entity.CheckInEntity;
import com.campushub.campus_hub.Service.CheckInService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CheckInServiceImpl implements CheckInService {
    private final CheckInDao checkInDao;
    private final StudentDao studentDao;
    private final LocationDao locationDao;

    @Override
    public void saveCheckIn(String studentId, String locationId) {
        validateStudent(studentId);
        validateLocation(locationId);

        CheckInEntity checkIn = new CheckInEntity();
        checkIn.setStudent_id(studentId);
        checkIn.setLocation_id(locationId);
        checkIn.setCheckIn_time(UtilityData.generateTodayDateTime());

        checkInDao.save(checkIn);


    }

    @Override
    public void validateStudent(String studentId) {
        if(!studentDao.findById(studentId).isPresent()) {
            throw new RuntimeException("Student not found: " + studentId);
        }

    }

    @Override
    public void validateLocation(String locationId) {
        if(!locationDao.findById(locationId).isPresent()) {
            throw new RuntimeException("Location not found: " + locationId);
        }

    }

    @Override
    public List<String> getStudentAtLocation(String locationId) {
        validateLocation(locationId);
        List<String> studentIds =checkInDao.findStudentsCurrentlyAtLocation(locationId);
        return studentIds;
    }

    @Override
    public List<CheckInDTO> getAllCheckIns(String studentId) {
        return checkInDao.findAll().stream()
                .map(entity -> new CheckInDTO(entity.getCheckin_id(), entity.getStudent_id(), entity.getLocation_id(), entity.getCheckIn_time()))
                .toList();
    }
}

