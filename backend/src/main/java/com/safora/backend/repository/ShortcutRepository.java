package com.safora.backend.repository;

import com.safora.backend.model.Shortcut;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShortcutRepository
        extends JpaRepository<Shortcut, Long> {

    List<Shortcut> findByUserId(
            Long userId
    );
}