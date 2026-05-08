package com.testing.springpractice.thapartyres.DTO;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResetPasswordRequest {
    private String newpassword;
    private Long OTP;
    private String username;
}
