package com.xpense.service;

import com.xpense.exception.ResourceNotFoundException;
import com.xpense.model.UserProfile;
import com.xpense.repository.UserProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class UserProfileService {

    public static final String DEFAULT_USER_ID = "user-default-1";

    private final UserProfileRepository userProfileRepository;

    public UserProfileService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    public UserProfile getDefaultProfile() {
        return userProfileRepository.findById(DEFAULT_USER_ID)
                .orElseGet(() -> {
                    UserProfile profile = new UserProfile(
                            DEFAULT_USER_ID,
                            "128003008@sastra.ac.in",
                            "Aditya Venkata Sai Burle",
                            "128003008@sastra.ac.in",
                            new BigDecimal("2450.00")
                    );
                    return userProfileRepository.save(profile);
                });
    }

    public UserProfile getProfile(String id) {
        return userProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found with id: " + id));
    }

    @Transactional
    public UserProfile updateProfile(String id, UserProfile updateData) {
        UserProfile profile = userProfileRepository.findById(id)
                .orElseGet(this::getDefaultProfile);

        if (updateData.getFullName() != null) {
            profile.setFullName(updateData.getFullName());
        }
        if (updateData.getEmail() != null) {
            profile.setEmail(updateData.getEmail());
        }
        if (updateData.getAvatarUrl() != null) {
            profile.setAvatarUrl(updateData.getAvatarUrl());
        }
        if (updateData.getRole() != null) {
            profile.setRole(updateData.getRole());
        }
        if (updateData.getAccountType() != null) {
            profile.setAccountType(updateData.getAccountType());
        }
        if (updateData.getCurrency() != null) {
            profile.setCurrency(updateData.getCurrency());
        }
        if (updateData.getCurrencySymbol() != null) {
            profile.setCurrencySymbol(updateData.getCurrencySymbol());
        }
        if (updateData.getTotalBalance() != null) {
            profile.setTotalBalance(updateData.getTotalBalance());
        }

        return userProfileRepository.save(profile);
    }

    @Transactional
    public UserProfile adjustBalance(String id, BigDecimal delta) {
        UserProfile profile = userProfileRepository.findById(id)
                .orElseGet(this::getDefaultProfile);

        BigDecimal current = profile.getTotalBalance() != null ? profile.getTotalBalance() : BigDecimal.ZERO;
        BigDecimal updated = current.add(delta);
        if (updated.compareTo(BigDecimal.ZERO) < 0) {
            updated = BigDecimal.ZERO;
        }
        profile.setTotalBalance(updated);
        return userProfileRepository.save(profile);
    }
}
