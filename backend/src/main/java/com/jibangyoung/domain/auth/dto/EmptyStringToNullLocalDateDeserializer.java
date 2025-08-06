// EmptyStringToNullLocalDateDeserializer.java
package com.jibangyoung.domain.auth.dto;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

public class EmptyStringToNullLocalDateDeserializer extends StdDeserializer<LocalDate> {

    public EmptyStringToNullLocalDateDeserializer() {
        super(LocalDate.class);
    }

    @Override
    public LocalDate deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getText();
        if (value == null || value.trim().isEmpty())
            return null;
        return LocalDate.parse(value, DateTimeFormatter.ISO_DATE);
    }
}
