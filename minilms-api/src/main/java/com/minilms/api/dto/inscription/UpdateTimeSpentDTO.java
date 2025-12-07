package com.minilms.api.dto.inscription;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class UpdateTimeSpentDTO {

    @NotNull(message = "El ID de la lección es obligatorio")
    private Long leccionId;

    @NotNull(message = "El tiempo dedicado es obligatorio")
    @Positive(message = "El tiempo dedicado debe ser un número positivo")
    private Long tiempoDedicadoSegundos;

}
