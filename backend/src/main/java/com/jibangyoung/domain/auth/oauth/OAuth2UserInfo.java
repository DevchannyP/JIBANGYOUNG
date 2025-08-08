package com.jibangyoung.domain.auth.oauth;

public interface OAuth2UserInfo {
    String getProviderId();

    String getProvider();

    String getEmail();

    String getName();

    String getImageUrl();

    String getGender();

    String getBirthYear();

    String getPhone();
}
