package com.xpense.controller;

import com.xpense.dto.ApiResponse;
import com.xpense.model.UserProfile;
import com.xpense.service.UserProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<UserProfile>> getCurrentProfile(
            @RequestParam(value = "userId", required = false, defaultValue = UserProfileService.DEFAULT_USER_ID) String userId) {
        UserProfile profile = userProfileService.getDefaultProfile();
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<UserProfile>> updateProfile(
            @RequestParam(value = "userId", required = false, defaultValue = UserProfileService.DEFAULT_USER_ID) String userId,
            @RequestBody UserProfile updateData) {
        UserProfile updated = userProfileService.updateProfile(userId, updateData);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }
}
