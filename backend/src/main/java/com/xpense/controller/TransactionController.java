package com.xpense.controller;

import com.xpense.dto.ApiResponse;
import com.xpense.dto.TransferRequest;
import com.xpense.model.Transaction;
import com.xpense.service.TransactionService;
import com.xpense.service.UserProfileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Transaction>>> getTransactions(
            @RequestParam(value = "userId", required = false, defaultValue = UserProfileService.DEFAULT_USER_ID) String userId,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "walletId", required = false) String walletId) {
        List<Transaction> transactions = transactionService.getTransactions(userId, category, type, walletId);
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Transaction>> getTransactionById(@PathVariable String id) {
        Transaction tx = transactionService.getTransactionById(id);
        return ResponseEntity.ok(ApiResponse.success(tx));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Transaction>> createTransaction(@Valid @RequestBody Transaction transaction) {
        Transaction created = transactionService.createTransaction(transaction);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Transaction recorded successfully", created));
    }

    @PostMapping("/transfer")
    public ResponseEntity<ApiResponse<Transaction>> processTransfer(
            @RequestParam(value = "userId", required = false, defaultValue = UserProfileService.DEFAULT_USER_ID) String userId,
            @Valid @RequestBody TransferRequest transferRequest) {
        Transaction tx = transactionService.processTransfer(userId, transferRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Transfer completed successfully", tx));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTransaction(@PathVariable String id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.ok(ApiResponse.success("Transaction deleted successfully", null));
    }
}
