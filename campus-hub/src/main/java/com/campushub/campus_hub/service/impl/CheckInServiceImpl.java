package com.campushub.campus_hub.service.impl;

import com.campushub.campus_hub.dto.CheckInDTO;
import com.campushub.campus_hub.dao.CheckInDao;
import com.campushub.campus_hub.dao.LocationDao;
import com.campushub.campus_hub.dao.StudentDao;
import com.campushub.campus_hub.service.RewardService;
import com.campushub.campus_hub.entity.CheckInEntity;
import com.campushub.campus_hub.service.CheckInService;
import com.campushub.campus_hub.util.UtilityData;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CheckInServiceImpl implements CheckInService {
    private final CheckInDao checkInDao;
    private final StudentDao studentDao;
    private final LocationDao locationDao;
    private final RewardService rewardService;

    @Override
    public void saveCheckIn(String studentId, String locationId) {
        validateStudent(studentId);
        validateLocation(locationId);

        CheckInEntity checkIn = new CheckInEntity();
        checkIn.setCheckin_id(UtilityData.generateCheckIn_id());
        checkIn.setStudent_id(studentId);
        checkIn.setLocation_id(locationId);
        checkIn.setCheckIn_time(UtilityData.generateTodayDateTime());

        checkInDao.save(checkIn);

        rewardService.addPoints(studentId, BigDecimal.valueOf(5.0));

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

