package com.xpense.service;

import com.xpense.dto.AnalyticsSummaryDTO;
import com.xpense.model.SavingsGoal;
import com.xpense.model.Transaction;
import com.xpense.repository.SavingsGoalRepository;
import com.xpense.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

@Service
public class AnalyticsService {

    private final TransactionRepository transactionRepository;
    private final SavingsGoalRepository savingsGoalRepository;

    public AnalyticsService(TransactionRepository transactionRepository, SavingsGoalRepository savingsGoalRepository) {
        this.transactionRepository = transactionRepository;
        this.savingsGoalRepository = savingsGoalRepository;
    }

    public AnalyticsSummaryDTO getAnalyticsSummary(String userId) {
        if (userId == null || userId.isEmpty()) {
            userId = UserProfileService.DEFAULT_USER_ID;
        }

        AnalyticsSummaryDTO dto = new AnalyticsSummaryDTO();
        LocalDate now = LocalDate.now();

        // 1. Current month range
        LocalDateTime startOfMonth = now.with(TemporalAdjusters.firstDayOfMonth()).atStartOfDay();
        LocalDateTime endOfMonth = now.with(TemporalAdjusters.lastDayOfMonth()).atTime(LocalTime.MAX);

        // 2. Previous month range
        LocalDate prevMonthDate = now.minusMonths(1);
        LocalDateTime startOfPrevMonth = prevMonthDate.with(TemporalAdjusters.firstDayOfMonth()).atStartOfDay();
        LocalDateTime endOfPrevMonth = prevMonthDate.with(TemporalAdjusters.lastDayOfMonth()).atTime(LocalTime.MAX);

        // 3. Today range
        LocalDateTime startOfToday = now.atStartOfDay();
        LocalDateTime endOfToday = now.atTime(LocalTime.MAX);

        List<Transaction> currentMonthTxs = transactionRepository.findByUserIdAndDateBetween(userId, startOfMonth, endOfMonth);
        List<Transaction> prevMonthTxs = transactionRepository.findByUserIdAndDateBetween(userId, startOfPrevMonth, endOfPrevMonth);

        BigDecimal monthlySpend = BigDecimal.ZERO;
        BigDecimal todaySpend = BigDecimal.ZERO;
        Map<String, BigDecimal> breakdown = new HashMap<>();

        for (Transaction tx : currentMonthTxs) {
            if ("expense".equalsIgnoreCase(tx.getType())) {
                BigDecimal amt = tx.getAmount() != null ? tx.getAmount() : BigDecimal.ZERO;
                monthlySpend = monthlySpend.add(amt);

                if (tx.getDate() != null && !tx.getDate().isBefore(startOfToday) && !tx.getDate().isAfter(endOfToday)) {
                    todaySpend = todaySpend.add(amt);
                }

                String cat = tx.getCategory() != null ? tx.getCategory() : "General";
                breakdown.put(cat, breakdown.getOrDefault(cat, BigDecimal.ZERO).add(amt));
            }
        }

        BigDecimal prevMonthSpend = BigDecimal.ZERO;
        for (Transaction tx : prevMonthTxs) {
            if ("expense".equalsIgnoreCase(tx.getType())) {
                BigDecimal amt = tx.getAmount() != null ? tx.getAmount() : BigDecimal.ZERO;
                prevMonthSpend = prevMonthSpend.add(amt);
            }
        }

        // Active Goals
        List<SavingsGoal> goals = savingsGoalRepository.findByUserIdOrderByCreatedAtDesc(userId);
        long activeGoals = goals.stream().filter(g -> "in_progress".equalsIgnoreCase(g.getStatus())).count();

        // Average Daily Spend
        int dayOfMonth = Math.max(1, now.getDayOfMonth());
        BigDecimal avgDailySpend = monthlySpend.divide(BigDecimal.valueOf(dayOfMonth), 2, RoundingMode.HALF_UP);

        // Percent change
        double pctChange = 0.0;
        if (prevMonthSpend.compareTo(BigDecimal.ZERO) > 0) {
            pctChange = ((monthlySpend.doubleValue() - prevMonthSpend.doubleValue()) / prevMonthSpend.doubleValue()) * 100.0;
        }

        dto.setMonthlySpend(monthlySpend);
        dto.setTodaySpend(todaySpend);
        dto.setActiveGoalsCount(activeGoals);
        dto.setAvgDailySpend(avgDailySpend);
        dto.setPreviousMonthSpend(prevMonthSpend);
        dto.setPercentChange(Math.round(pctChange * 10.0) / 10.0);
        dto.setCategoryBreakdown(breakdown);

        // AI Insights
        List<String> insights = new ArrayList<>();
        if (monthlySpend.compareTo(BigDecimal.ZERO) == 0) {
            insights.add("No expenses logged this month yet. Great start keeping your wallet full!");
        } else {
            String topCategory = breakdown.entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .map(Map.Entry::getKey)
                    .orElse("Daily Life");
            insights.add("Your highest expense category is " + topCategory + ". Consider reviewing your envelope limits.");
            if (pctChange > 15) {
                insights.add("Monthly spending has risen by " + Math.round(pctChange) + "% compared to last month. Pace yourself!");
            } else if (pctChange < -5) {
                insights.add("Great discipline! Spending is down " + Math.abs(Math.round(pctChange)) + "% from last month.");
            }
        }
        if (activeGoals > 0) {
            insights.add("You have " + activeGoals + " active savings goal(s). Depositing spare change weekly accelerates progress.");
        }
        dto.setAiInsights(insights);

        return dto;
    }
}
