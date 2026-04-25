package com.campushub.campus_hub.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class FileStorageService {
    private final Path root = Paths.get("uploads/profiles");

    public  String saveProfileImage(MultipartFile file) {
        try{
            String fileName = file.getContentType();
            List<String> allowedTypes = Arrays.asList("image/jpeg", "image/png", "image/jpg");


            if(fileName == null || !allowedTypes.contains(fileName)){
                throw new RuntimeException("Invalid file type provided. Only image/jpeg, image/png, image/jpg allowed");
            }

            if(!Files.exists(root)){
                Files.createDirectories(root);
            }

            String extension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
            String fName = UUID.randomUUID().toString() + extension;

            Files.copy(file.getInputStream(), this.root.resolve(fName));

            return fName;
        }catch(IOException e){
            throw new RuntimeException("Could not save file. Error: "+ e.getMessage());
        }
    }
}
