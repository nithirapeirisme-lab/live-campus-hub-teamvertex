package com.campushub.campus_hub.service.impl;

import com.campushub.campus_hub.dto.StaffDTO;
import com.campushub.campus_hub.dao.StaffDao;
import com.campushub.campus_hub.entity.StaffEntity;
import com.campushub.campus_hub.exceptions.StaffMemberNotFoundException;
import com.campushub.campus_hub.service.StaffService;
import com.campushub.campus_hub.util.EntityDTOConversion;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class StaffServiceImpl implements StaffService {
    private final StaffDao staffDao;
    private final EntityDTOConversion entityDTOConversion;
    private final FileStorageService fileStorageService;
    @Override
    public void saveStaffMember(StaffDTO staffMember) {
        staffMember.setIs_admin(true);
        staffDao.save(entityDTOConversion.toStaffEntity(staffMember));

    }

    @Override
    public void updateStaffMember(StaffDTO staffMember) {
        Optional<StaffEntity> staff = staffDao.findById(staffMember.getStaff_id());
        if(!staff.isPresent()) {
            throw new StaffMemberNotFoundException("The staff member is not found.");
        }
        staff.get().setStaff_id(staffMember.getStaff_id());
        staff.get().setStaff_pwd(staffMember.getStaff_pwd());
        staff.get().setFirst_name(staffMember.getFirst_name());
        staff.get().setLast_name(staffMember.getLast_name());
        staff.get().setEmail(staffMember.getEmail());
        staff.get().setIs_admin(true);

    }

    @Override
    public void deleteStaffMember(String staff_Id) {
        Optional<StaffEntity> staff = staffDao.findById(staff_Id);
        if(!staff.isPresent()) {
            throw new StaffMemberNotFoundException("The staff member is not found.");
        }
        staffDao.delete(staff.get());

    }

    @Override
    public String updateProfileImage(String staffId, MultipartFile file) {
        StaffEntity staff = staffDao.findById(staffId)
                .orElseThrow(() -> new StaffMemberNotFoundException("The staff member is not found with id: " + staffId));

        String fName = fileStorageService.saveProfileImage(file);
        staff.setProfileImageUrl("/uploads/profiles/" + fName);
        staffDao.save(staff);
        return staff.getProfileImageUrl();
    }

    @Override
    public StaffDTO getStaffById(String staff_Id) {
        Optional<StaffEntity> staff = staffDao.findById(staff_Id);
        if(!staff.isPresent()) {
            throw new StaffMemberNotFoundException("The staff member is not found.");
        }
        return entityDTOConversion.toStaffDTO(staffDao.getReferenceById(staff.get().getStaff_id()));
    }


    @Override
    public List<StaffDTO> getAllStaffs() {
        List<StaffEntity> allStaff = staffDao.findAll();
        return entityDTOConversion.toStaffDTOList(allStaff);
    }
}
