package com.campushub.campus_hub.config;

import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;


public class WebConfig implements WebMvcConfigurer {
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadDir = "uploads";
        Path uploadPath = Paths.get(uploadDir);
        String absolutePath = uploadPath.toFile().getAbsolutePath();

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + absolutePath + "/");

        System.out.println("Spring Boot Static Resource Handler mapped route -> file:" + absolutePath + "/");
    }
}
