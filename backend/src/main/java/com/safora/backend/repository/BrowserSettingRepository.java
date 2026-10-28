package com.safora.backend.repository;

import com.safora.backend.model.BrowserSetting;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BrowserSettingRepository
        extends JpaRepository<BrowserSetting, Long> {

    Optional<BrowserSetting> findByUserId(
            Long userId
    );
}