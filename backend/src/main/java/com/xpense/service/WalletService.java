package com.xpense.service;

import com.xpense.exception.BadRequestException;
import com.xpense.exception.ResourceNotFoundException;
import com.xpense.model.Wallet;
import com.xpense.repository.WalletRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class WalletService {

    private final WalletRepository walletRepository;
    private final UserProfileService userProfileService;

    public WalletService(WalletRepository walletRepository, UserProfileService userProfileService) {
        this.walletRepository = walletRepository;
        this.userProfileService = userProfileService;
    }

    public List<Wallet> getWalletsByUserId(String userId) {
        return walletRepository.findByUserIdOrderByCreatedAtAsc(userId);
    }

    public Wallet getWalletById(String id) {
        return walletRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found with id: " + id));
    }

    @Transactional
    public Wallet createWallet(Wallet wallet) {
        if (wallet.getUserId() == null || wallet.getUserId().isEmpty()) {
            wallet.setUserId(UserProfileService.DEFAULT_USER_ID);
        }
        if (wallet.getBalance() == null) {
            wallet.setBalance(BigDecimal.ZERO);
        }
        if (wallet.getBudgetLimit() == null) {
            wallet.setBudgetLimit(new BigDecimal("1000.00"));
        }
        return walletRepository.save(wallet);
    }

    @Transactional
    public Wallet updateWallet(String id, Wallet updateData) {
        Wallet wallet = getWalletById(id);
        if (updateData.getName() != null) wallet.setName(updateData.getName());
        if (updateData.getCategory() != null) wallet.setCategory(updateData.getCategory());
        if (updateData.getBalance() != null) wallet.setBalance(updateData.getBalance());
        if (updateData.getBudgetLimit() != null) wallet.setBudgetLimit(updateData.getBudgetLimit());
        if (updateData.getIcon() != null) wallet.setIcon(updateData.getIcon());
        if (updateData.getColor() != null) wallet.setColor(updateData.getColor());
        if (updateData.getStatus() != null) wallet.setStatus(updateData.getStatus());
        return walletRepository.save(wallet);
    }

    @Transactional
    public void deleteWallet(String id) {
        Wallet wallet = getWalletById(id);
        walletRepository.delete(wallet);
    }

    @Transactional
    public Wallet topUpWallet(String id, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Top-up amount must be greater than zero");
        }
        Wallet wallet = getWalletById(id);
        BigDecimal current = wallet.getBalance() != null ? wallet.getBalance() : BigDecimal.ZERO;
        wallet.setBalance(current.add(amount));

        // Update health status if balance is replenished
        if (wallet.getBudgetLimit() != null && wallet.getBudgetLimit().compareTo(BigDecimal.ZERO) > 0) {
            double ratio = wallet.getBalance().doubleValue() / wallet.getBudgetLimit().doubleValue();
            if (ratio >= 0.3) {
                wallet.setStatus("Good");
            }
        }

        Wallet saved = walletRepository.save(wallet);

        // Adjust total user balance
        userProfileService.adjustBalance(wallet.getUserId(), amount);

        return saved;
    }

    @Transactional
    public Wallet deductFromWallet(String id, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Deduct amount must be greater than zero");
        }
        Wallet wallet = getWalletById(id);
        BigDecimal current = wallet.getBalance() != null ? wallet.getBalance() : BigDecimal.ZERO;
        if (current.compareTo(amount) < 0) {
            throw new BadRequestException("Insufficient balance in wallet: " + wallet.getName());
        }
        wallet.setBalance(current.subtract(amount));

        // Update health status if low
        if (wallet.getBudgetLimit() != null && wallet.getBudgetLimit().compareTo(BigDecimal.ZERO) > 0) {
            double ratio = wallet.getBalance().doubleValue() / wallet.getBudgetLimit().doubleValue();
            if (ratio <= 0.1) {
                wallet.setStatus("Warning");
            } else if (ratio <= 0.25) {
                wallet.setStatus("Low");
            }
        }

        return walletRepository.save(wallet);
    }
}
