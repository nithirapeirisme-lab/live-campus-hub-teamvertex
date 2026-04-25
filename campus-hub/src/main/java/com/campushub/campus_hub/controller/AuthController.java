package com.campushub.campus_hub.controller;

import com.campushub.campus_hub.dto.AuthResponse;
import com.campushub.campus_hub.dto.LoginDTO;
import com.campushub.campus_hub.dto.SignUpDTO;
import com.campushub.campus_hub.dao.StaffDao;
import com.campushub.campus_hub.dao.StudentDao;
import com.campushub.campus_hub.entity.StaffEntity;
import com.campushub.campus_hub.entity.StudentEntity;
import com.campushub.campus_hub.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://127.0.0.1:5501")
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final StudentDao studentDao;
    private final StaffDao staffDao;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO ) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDTO.getUsername(),
                        loginDTO.getPassword()
                )
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwt = jwtUtils.generateToken(userDetails.getUsername());

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new AuthResponse( jwt, userDetails.getUsername(), roles) );

    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignUpDTO signupDTO) {
        if (studentDao.existsById(signupDTO.getUserId()) || staffDao.existsById(signupDTO.getUserId())) {
            return ResponseEntity.badRequest().body("User ID already exists");
        }

        if("STUDENT".equalsIgnoreCase(signupDTO.getRole())) {
            StudentEntity student = new StudentEntity();
            student.setStudent_id(signupDTO.getUserId());
            student.setStudent_pwd(passwordEncoder.encode(signupDTO.getPassword()));
            student.setFirst_name(signupDTO.getFirstName());
            student.setLast_name(signupDTO.getLastName());
            student.setEmail(signupDTO.getEmail());

            studentDao.save(student);
            return ResponseEntity.ok("Registration Successful!");

        }else if("STAFF".equalsIgnoreCase(signupDTO.getRole())) {
            StaffEntity staff = new StaffEntity();
            staff.setStaff_id(signupDTO.getUserId());
            staff.setStaff_pwd(passwordEncoder.encode(signupDTO.getPassword()));
            staff.setFirst_name(signupDTO.getFirstName());
            staff.setLast_name(signupDTO.getLastName());
            staff.setEmail(signupDTO.getEmail());
            staff.setIs_admin(true);

            staffDao.save(staff);
            return ResponseEntity.ok("Registration Successful!");
        }
        return ResponseEntity.badRequest().body("Invalid role");
    }

}
