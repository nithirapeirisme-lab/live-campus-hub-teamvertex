package com.campushub.campus_hub.Service;

import com.campushub.campus_hub.DTO.StaffDTO;

import java.util.List;

public interface StaffService {
    void saveStaffMember(StaffDTO staffMember);
    void updateStaffMember(StaffDTO staffMember);
    void deleteStaffMember(String staff_Id);
    StaffDTO getStaffById(String staff_Id);
    List<StaffDTO> getAllStaffs();
}
