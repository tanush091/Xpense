package com.xpense.controller;

import com.xpense.dto.ApiResponse;
import com.xpense.dto.AnalyticsSummaryDTO;
import com.xpense.service.AnalyticsService;
import com.xpense.service.UserProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<AnalyticsSummaryDTO>> getAnalytics(
            @RequestParam(value = "userId", required = false, defaultValue = UserProfileService.DEFAULT_USER_ID) String userId) {
        AnalyticsSummaryDTO summary = analyticsService.getAnalyticsSummary(userId);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }
}
