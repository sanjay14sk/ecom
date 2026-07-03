package com.example.ecommerce.service;

import com.example.ecommerce.dto.UserDto;

public interface UserService {
    UserDto getUserProfile(Long userId);
    UserDto updateUserProfile(Long userId, UserDto userDto);
}
