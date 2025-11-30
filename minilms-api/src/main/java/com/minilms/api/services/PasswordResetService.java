package com.minilms.api.services;

import com.minilms.api.config.responseApi.ApiException;
import com.minilms.api.dto.ForgotPasswordRequest;
import com.minilms.api.dto.ResetPasswordRequest;
import com.minilms.api.entities.PasswordResetToken;
import com.minilms.api.entities.User;
import com.minilms.api.repository.PasswordResetTokenRepository;
import com.minilms.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;

    // Token expiration time: 1 hour
    private static final int EXPIRATION_HOURS = 1;

    /**
     * Generate a password reset token for the given email
     */
    @Transactional
    public String generatePasswordResetToken(ForgotPasswordRequest request) {
        User user = userRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() -> new ApiException(
                        "Si el correo existe en nuestro sistema, recibirás un enlace de recuperación",
                        HttpStatus.OK
                ));

        // Delete any existing tokens for this user
        tokenRepository.deleteByUser(user);

        // Generate new token
        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusHours(EXPIRATION_HOURS);

        PasswordResetToken resetToken = new PasswordResetToken(token, user, expiryDate);
        tokenRepository.save(resetToken);

        // In production, send email here
        // For development, we'll log the token
        log.info("Password reset token generated for user {}: {}", user.getCorreo(), token);
        log.info("Reset link: http://localhost:4200/auth/reset-password?token={}", token);

        return token;
    }

    /**
     * Validate a password reset token
     */
    @Transactional(readOnly = true)
    public boolean validatePasswordResetToken(String token) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElse(null);

        if (resetToken == null) {
            return false;
        }

        if (resetToken.isUsed()) {
            return false;
        }

        if (resetToken.isExpired()) {
            return false;
        }

        return true;
    }

    /**
     * Reset password using the token
     */
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new ApiException("Token inválido o expirado", HttpStatus.BAD_REQUEST));

        if (resetToken.isUsed()) {
            throw new ApiException("Este token ya ha sido utilizado", HttpStatus.BAD_REQUEST);
        }

        if (resetToken.isExpired()) {
            throw new ApiException("Este token ha expirado", HttpStatus.BAD_REQUEST);
        }

        // Update user password
        User user = resetToken.getUser();
        user.setClave(passwordEncoder.encode(request.getNuevaClave()));
        userRepository.save(user);

        // Mark token as used
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);

        log.info("Password successfully reset for user: {}", user.getCorreo());
    }

    /**
     * Clean up expired tokens (can be scheduled to run periodically)
     */
    @Transactional
    public void deleteExpiredTokens() {
        tokenRepository.deleteByExpiryDateBefore(LocalDateTime.now());
    }
}
