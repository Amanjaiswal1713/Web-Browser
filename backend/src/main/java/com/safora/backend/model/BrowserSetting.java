package com.safora.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "browser_settings")
public class BrowserSetting {

    @Id
    @GeneratedValue(
            strategy =
                    GenerationType.IDENTITY
    )
    private Long id;

    @Column(nullable = false)
    private String searchEngine;

    @Column(nullable = false)
    private String theme;

    @Column(nullable = false)
    private String startupMode;

    private String startupUrl;

    @Column(nullable = false)
    private Boolean askDownloadLocation;

    @Column(nullable = false)
    private Boolean switchToNewTab;

    @JsonIgnore
    @OneToOne
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true
    )
    private User user;

    public BrowserSetting() {
    }

    public Long getId() {

        return id;
    }

    public void setId(
            Long id
    ) {

        this.id = id;
    }

    public String getSearchEngine() {

        return searchEngine;
    }

    public void setSearchEngine(
            String searchEngine
    ) {

        this.searchEngine =
                searchEngine;
    }

    public String getTheme() {

        return theme;
    }

    public void setTheme(
            String theme
    ) {

        this.theme = theme;
    }

    public String getStartupMode() {

        return startupMode;
    }

    public void setStartupMode(
            String startupMode
    ) {

        this.startupMode =
                startupMode;
    }

    public String getStartupUrl() {

        return startupUrl;
    }

    public void setStartupUrl(
            String startupUrl
    ) {

        this.startupUrl =
                startupUrl;
    }

    public Boolean getAskDownloadLocation() {

        return askDownloadLocation;
    }

    public void setAskDownloadLocation(
            Boolean askDownloadLocation
    ) {

        this.askDownloadLocation =
                askDownloadLocation;
    }

    public Boolean getSwitchToNewTab() {

        return switchToNewTab;
    }

    public void setSwitchToNewTab(
            Boolean switchToNewTab
    ) {

        this.switchToNewTab =
                switchToNewTab;
    }

    public User getUser() {

        return user;
    }

    public void setUser(
            User user
    ) {

        this.user = user;
    }
}