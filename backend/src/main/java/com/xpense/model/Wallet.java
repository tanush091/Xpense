package com.xpense.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "wallets")
public class Wallet {

    @Id
    @Column(name = "id", nullable = false, length = 64)
    private String id;

    @Column(name = "user_id", nullable = false, length = 64)
    private String userId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(precision = 12, scale = 2)
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(name = "budget_limit", precision = 12, scale = 2)
    private BigDecimal budgetLimit = new BigDecimal("1000.00");

    @Column
    private String icon = "wallet";

    @Column
    private String color = "#3B82F6";

    @Column(name = "cycle_days_left")
    private Integer cycleDaysLeft = 30;

    @Column(name = "daily_avg", precision = 10, scale = 2)
    private BigDecimal dailyAvg = BigDecimal.ZERO;

    @Column
    private String status = "Good";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Wallet() {
    }

    public Wallet(String id, String userId, String name, String category, BigDecimal balance, BigDecimal budgetLimit, String icon, String color) {
        this.id = id != null ? id : UUID.randomUUID().toString();
        this.userId = userId;
        this.name = name;
        this.category = category;
        this.balance = balance;
        this.budgetLimit = budgetLimit;
        this.icon = icon;
        this.color = color;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (id == null || id.isEmpty()) {
            id = UUID.randomUUID().toString();
        }
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public BigDecimal getBudgetLimit() {
        return budgetLimit;
    }

    public void setBudgetLimit(BigDecimal budgetLimit) {
        this.budgetLimit = budgetLimit;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Integer getCycleDaysLeft() {
        return cycleDaysLeft;
    }

    public void setCycleDaysLeft(Integer cycleDaysLeft) {
        this.cycleDaysLeft = cycleDaysLeft;
    }

    public BigDecimal getDailyAvg() {
        return dailyAvg;
    }

    public void setDailyAvg(BigDecimal dailyAvg) {
        this.dailyAvg = dailyAvg;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
