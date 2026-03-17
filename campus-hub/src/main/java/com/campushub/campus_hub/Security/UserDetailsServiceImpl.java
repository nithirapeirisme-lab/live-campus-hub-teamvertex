package com.campushub.campus_hub.Security;

import com.campushub.campus_hub.Dao.StaffDao;
import com.campushub.campus_hub.Dao.StudentDao;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final StudentDao studentDao;
    private final StaffDao staffDao;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var student = studentDao.findById(username);
        if (student.isPresent()) {
            return User.withUsername(student.get().getStudent_id())
                    .password(student.get().getStudent_pwd())
                    .authorities("ROLE_STUDENT")
                    .build();
        }

        var staff = staffDao.findById(username);
        if (staff.isPresent()) {
            return User.withUsername(staff.get().getStaff_id())
                    .password(staff.get().getStaff_pwd())
                    .authorities("ROLE_STAFF")
                    .build();
        }

        throw new UsernameNotFoundException("User not found with id: " + username);
    }
}
