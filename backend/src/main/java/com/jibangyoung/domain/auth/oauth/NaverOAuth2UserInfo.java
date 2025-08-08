package com.jibangyoung.domain.auth.oauth;

import java.util.Map;

public class NaverOAuth2UserInfo implements OAuth2UserInfo {

    private final Map<String, Object> response;

    @SuppressWarnings("unchecked")
    public NaverOAuth2UserInfo(Map<String, Object> attributes) {
        Object resp = attributes.get("response");
        if (resp instanceof Map) {
            this.response = (Map<String, Object>) resp;
        } else {
            this.response = null;
        }
    }

    @Override
    public String getProviderId() {
        return response != null ? (String) response.get("id") : null;
    }

    @Override
    public String getProvider() {
        return "naver";
    }

    @Override
    public String getEmail() {
        return response != null ? (String) response.get("email") : null;
    }

    @Override
    public String getName() {
        return response != null ? (String) response.get("name") : null;
    }

    @Override
    public String getImageUrl() {
        return response != null ? (String) response.get("profile_image") : null;
    }

    @Override
    public String getGender() {
        if (response != null) {
            String gender = (String) response.get("gender");
            if ("M".equalsIgnoreCase(gender))
                return "남성";
            if ("F".equalsIgnoreCase(gender))
                return "여성";
        }
        return null;
    }

    @Override
    public String getBirthYear() {
        return response != null ? (String) response.get("birthyear") : null;
    }

    public String getBirthday() {
        return response != null ? (String) response.get("birthday") : null; // MM-DD
    }

    @Override
    public String getPhone() {
        if (response != null) {
            String mobile = (String) response.get("mobile");
            if (mobile != null) {
                return mobile.replaceAll("-", "");
            }
        }
        return null;
    }

    /** birthyear + birthday → yyyy-MM-dd 조합 */
    public String getFullBirthDate() {
        if (getBirthYear() != null && getBirthday() != null) {
            return getBirthYear() + "-" + getBirthday();
        }
        return getBirthYear(); // 연도만 있을 수 있음
    }
}
