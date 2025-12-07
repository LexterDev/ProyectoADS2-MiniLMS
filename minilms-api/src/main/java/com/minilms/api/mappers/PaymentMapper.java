package com.minilms.api.mappers;

import com.minilms.api.dto.payment.PaymentDTO;
import com.minilms.api.dto.payment.PaymentMethodDTO;
import com.minilms.api.entities.FormaPago;
import com.minilms.api.entities.Pago;
import com.minilms.api.utils.LmsUtils;

public class PaymentMapper {

    public static PaymentDTO toDTO(Pago entity) {
        if (entity == null) {
            return null;
        }

        PaymentDTO dto = new PaymentDTO();
        dto.setId(entity.getId());
        dto.setMontoTotal(entity.getMontoTotal());
        dto.setComisionPlataforma(entity.getComisionPlataforma());
        dto.setMontoInstructor(entity.getMontoInstructor());
        dto.setIdTransaccionPasarela(entity.getIdTransaccionPasarela());

        if (entity.getFormaPago() != null) {
            dto.setFormaPagoId(entity.getFormaPago().getId());
            dto.setFormaPagoNombre(entity.getFormaPago().getNombre());
        }

        if (entity.getEstado() != null) {
            dto.setEstadoCodigo(entity.getEstado().getCodigo());
            dto.setEstadoNombre(entity.getEstado().getDescripcion());
        }

        if (entity.getInscripcion() != null) {
            dto.setInscripcionId(entity.getInscripcion().getId());

            if (entity.getInscripcion().getCurso() != null) {
                dto.setCursoId(entity.getInscripcion().getCurso().getId());
                dto.setCursoTitulo(entity.getInscripcion().getCurso().getTitulo());
            }

            if (entity.getInscripcion().getEstudiante() != null) {
                dto.setEstudianteId(entity.getInscripcion().getEstudiante().getId());
                dto.setEstudianteNombre(
                    entity.getInscripcion().getEstudiante().getNombre() + " " +
                    entity.getInscripcion().getEstudiante().getApellido()
                );
            }
        }

        dto.setCreadoEn(LmsUtils.formatDateTime(entity.getCreadoEn()));
        dto.setActualizadoEn(LmsUtils.formatDateTime(entity.getActualizadoEn()));

        return dto;
    }

    public static Pago toEntity(PaymentDTO dto) {
        if (dto == null) {
            return null;
        }

        Pago entity = new Pago();
        entity.setMontoTotal(dto.getMontoTotal());
        entity.setComisionPlataforma(dto.getComisionPlataforma());
        entity.setMontoInstructor(dto.getMontoInstructor());
        entity.setIdTransaccionPasarela(dto.getIdTransaccionPasarela());

        return entity;
    }

    public static PaymentMethodDTO toDTO(FormaPago entity) {
        if (entity == null) {
            return null;
        }

        PaymentMethodDTO dto = new PaymentMethodDTO();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());

        return dto;
    }
}
