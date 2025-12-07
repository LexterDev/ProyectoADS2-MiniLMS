package com.minilms.api.dto.payment;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PaymentMethodDTO {

    private String id;
    private String nombre;
}
