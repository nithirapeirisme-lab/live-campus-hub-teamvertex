package com.campushub.campus_hub.util;


import com.campushub.campus_hub.dto.*;
import com.campushub.campus_hub.entity.*;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class EntityDTOConversion {
    private final ModelMapper modelMapper;

    //Bus
    public BusDTO toBusDTO(BusEntity bus) {
        return modelMapper.map(bus, BusDTO.class);
    }
    public BusEntity toBusEntity(BusDTO busdto) {
        return modelMapper.map(busdto, BusEntity.class);
    }
    public List<BusDTO> toBusDTOList(List<BusEntity> buses) {
        return modelMapper.map(buses, new TypeToken<List<BusDTO>>() {}.getType());
    }

    //CheckIn
    public CheckInDTO toCheckInDTO(CheckInEntity checkin) {
        return modelMapper.map(checkin, CheckInDTO.class);
    }

    public CheckInEntity toCheckInEntity(CheckInDTO checkin) {
        return modelMapper.map(checkin, CheckInEntity.class);
    }
    public List<CheckInDTO> toCheckInDTOList(List<CheckInEntity> checkins) {
        return modelMapper.map(checkins, new TypeToken<List<CheckInDTO>>() {}.getType());
    }

    //Clubs
    public ClubDTO toClubDTO(ClubEntity club) {
        return modelMapper.map(club, ClubDTO.class);
    }
    public ClubEntity toClubEntity(ClubDTO club) {
        return modelMapper.map(club, ClubEntity.class);
    }
    public List<ClubDTO> toClubDTOList(List<ClubEntity> clubs) {
        return modelMapper.map(clubs, new TypeToken<List<ClubDTO>>() {}.getType());
    }

    //Departments
    public DepartmentDTO toDepartmentDTO(DepartmentEntity department) {
        return modelMapper.map(department, DepartmentDTO.class);
    }
    public DepartmentEntity toDepartmentEntity(DepartmentDTO department) {
        return modelMapper.map(department, DepartmentEntity.class);
    }
    public List<DepartmentDTO> toDepartmentDTOList(List<DepartmentEntity> departments) {
        return modelMapper.map(departments, new TypeToken<List<DepartmentDTO>>() {}.getType());
    }

    //Events
    public EventDTO toEventDTO(EventEntity event) {
        return modelMapper.map(event, EventDTO.class);
    }
    public EventEntity toEventEntity(EventDTO event) {
        return modelMapper.map(event, EventEntity.class);
    }
    public List<EventDTO> toEventDTOList(List<EventEntity> events) {
        return modelMapper.map(events, new TypeToken<List<EventDTO>>() {}.getType());
    }

    //Locations
    public LocationDTO toLocationDTO(LocationEntity location) {
        return modelMapper.map(location, LocationDTO.class);
    }
    public LocationEntity toLocationEntity(LocationDTO location) {
        return modelMapper.map(location, LocationEntity.class);
    }
    public List<LocationDTO> toLocationDTOList(List<LocationEntity> locations) {
        return modelMapper.map(locations, new TypeToken<List<LocationDTO>>() {}.getType());
    }

    //Rewards
    public RewardDTO toRewardDTO(RewardEntity reward) {
        return modelMapper.map(reward, RewardDTO.class);
    }
    public RewardEntity toRewardEntity(RewardDTO reward) {
        return modelMapper.map(reward, RewardEntity.class);
    }
    public List<RewardDTO> toRewardDTOList(List<RewardEntity> rewards) {
        return modelMapper.map(rewards, new TypeToken<List<RewardDTO>>() {}.getType());
    }

    //Staff
    public StaffDTO toStaffDTO(StaffEntity staff) {
        return modelMapper.map(staff, StaffDTO.class);
    }
    public StaffEntity toStaffEntity(StaffDTO staff) {
        return modelMapper.map(staff, StaffEntity.class);
    }
    public List<StaffDTO> toStaffDTOList(List<StaffEntity> staffs) {
        return modelMapper.map(staffs, new TypeToken<List<StaffDTO>>() {}.getType());
    }

    //Student Rewards
    public StudentRewardDTO toStudentRewardDTO(StudentRewardEntity studentReward) {
        return modelMapper.map(studentReward, StudentRewardDTO.class);
    }
    public StudentRewardEntity toStudentRewardEntity(StudentRewardDTO studentReward) {

        return modelMapper.map(studentReward, StudentRewardEntity.class);
    }
    public List<StudentRewardDTO> toStudentRewardDTOList(List<StudentRewardEntity> studentRewards) {
        return modelMapper.map(studentRewards, new TypeToken<List<StudentRewardDTO>>() {}.getType());
    }

    //Students
    public StudentDTO toStudentDTO(StudentEntity student) {
        return modelMapper.map(student, StudentDTO.class);
    }
    public StudentEntity toStudentEntity(StudentDTO student) {
        return modelMapper.map(student, StudentEntity.class);
    }
    public List<StudentDTO> toStudentDTOList(List<StudentEntity> students) {
        return modelMapper.map(students, new TypeToken<List<StudentDTO>>() {}.getType());
    }

    //Students clubs
    public StudentsClubDTO toStudentsClubDTO(StudentsClubEntity studentsClub) {
        return modelMapper.map(studentsClub, StudentsClubDTO.class);
    }

    public StudentsClubEntity toStudentsClubEntity(StudentsClubDTO studentsClub) {
        return modelMapper.map(studentsClub, StudentsClubEntity.class);
    }

    public List<StudentsClubDTO> toStudentsClubDTOList(List<StudentsClubEntity> studentsClubs) {
        return modelMapper.map(studentsClubs, new TypeToken<List<StudentsClubDTO>>() {}.getType());
    }
}
